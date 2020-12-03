import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { GET_ANNUAL_YEAR_LIST, GET_FINANCIAL_YEARS, GET_CURRENCY_LIST } from "../../../graphql/";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_GRANT_PERIODS_PROJECT_LIST,
	GET_PROJ_BUDGET_TRACINGS_COUNT,
	GET_PROJECT_BUDGET_TARCKING,
	GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
} from "../../../graphql/Budget";
import {
	CREATE_PROJECT_BUDGET_TRACKING,
	UPDATE_PROJECT_BUDGET_TRACKING,
} from "../../../graphql/Budget/mutation";
import useMultipleFileUpload from "../../../hooks/multipleFileUpload";
import { AttachFile } from "../../../models/AttachFile";
import { IBudgetLineitemProps } from "../../../models/budget/";
import { IBudgetTrackingLineitemForm } from "../../../models/budget/budgetForm";
import {
	IBUDGET_LINE_ITEM_RESPONSE,
	IGET_BUDGET_TARCKING_LINE_ITEM,
	IGET_BUDGET_TARGET_PROJECT,
} from "../../../models/budget/query";
import { FORM_ACTIONS } from "../../../models/constants";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys, uploadPercentageCalculator } from "../../../utils";
import { getTodaysDate } from "../../../utils";
import {
	CommonFormTitleFormattedMessage,
	CommonUploadingFilesMessage,
} from "../../../utils/commonFormattedMessage";
import { CircularPercentage } from "../../commons";
import FormDialog from "../../FormDialog";
import AttachFileForm from "../../Forms/AttachFiles";
import CommonForm from "../../CommonForm";
import { budgetLineitemFormInputFields } from "./inputFields.json";
import BudgetTarget from "../BudgetTarget";
import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";
import { Grid, Box, Typography, useTheme } from "@material-ui/core";
import AmountSpent from "../../Table/Budget/BudgetTargetTable/AmountSpent";
import { GET_PROJECT_AMOUNT_SPEND } from "../../../graphql/project";

const defaultFormValues: IBudgetTrackingLineitemForm = {
	amount: "",
	note: "",
	budget_targets_project: "",
	annual_year: "",
	reporting_date: getTodaysDate(),
	fy_donor: "",
	fy_org: "",
	grant_periods_project: "",
	attachments: [],
};

let budgetTargetHash: {
	[key: string]: {
		id: string;
		country: { id: string };
	};
} = {};

const getBudgetTarget = ({
	budgetTargetId,
	budgetTargets,
}: {
	budgetTargetId: string;
	budgetTargets: IGET_BUDGET_TARGET_PROJECT["projectBudgetTargets"];
}) => budgetTargets.find((budgetTarget) => budgetTarget.id === budgetTargetId);

const FormDetails = ({
	budgetTarget,
	currency,
}: {
	budgetTarget: IGET_BUDGET_TARGET_PROJECT["projectBudgetTargets"][0];
	currency?: string;
}) => {
	const theme = useTheme();
	return (
		<Grid container>
			<Grid item xs={12}>
				<Box mt={1}>
					<Typography color="textSecondary" align="center">
						<Box fontWeight="bolder">{budgetTarget?.name?.toUpperCase()}</Box>
					</Typography>
				</Box>
				<Box py={2} display="flex" justifyContent="space-between">
					<Typography color="primary">
						<FormattedMessage
							id="budgetCategoryTitle"
							defaultMessage="Category"
							description="This text will tell user about budget category"
						/>
					</Typography>
					<Typography>{budgetTarget?.budget_category_organization?.name}</Typography>
				</Box>
				<Box py={2} display="flex" justifyContent="space-between">
					<Typography color="primary">
						<FormattedMessage
							id="donorTitle"
							defaultMessage="Donor"
							description="This text will tell user about donor"
						/>
					</Typography>
					<Typography>{budgetTarget?.donor?.name}</Typography>
				</Box>
				<Box py={2} display="flex" justifyContent="space-between">
					<Typography color="primary">
						<FormattedMessage
							id="moneySpentTitle"
							defaultMessage="Money Spent"
							description="This text will tell user about Money Spent"
						/>
					</Typography>
					<AmountSpent budgetTargetId={budgetTarget.id}>
						{(amount: number) => {
							return (
								<Box display="flex">
									<Typography
										color="textSecondary"
										style={{ marginRight: theme.spacing(1) }}
									>
										{currency}
									</Typography>
									<Typography>{amount}</Typography>
								</Box>
							);
						}}
					</AmountSpent>
				</Box>
				<Box py={2} display="flex" justifyContent="space-between">
					<Typography color="primary">
						<FormattedMessage
							id="totalAmoutTitle"
							defaultMessage="Total Amount"
							description="This text will tell user about Money Spent"
						/>
					</Typography>
					<Box display="flex">
						<Typography color="textSecondary" style={{ marginRight: theme.spacing(1) }}>
							{currency}
						</Typography>
						<Typography>{budgetTarget?.total_target_amount}</Typography>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

function BudgetLineitem(props: IBudgetLineitemProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const intl = useIntl();
	let budgetTargetLineTitle = intl.formatMessage({
		id: "budgetExpenditureFormTitle",
		defaultMessage: "Budget Expenditure",
		description: `This text will be show on Budget Expenditure form for title`,
	});
	// let budgetTargetLineSubtitle = intl.formatMessage({
	// 	id: "budgetExpenditureFormSubtitle",
	// 	defaultMessage: "Physical addresses of your organisation like headquarter branch etc",
	// 	description: `This text will be show on Budget Expenditureform for subtitle`,
	// });
	const [selectedDonor, setSelectedDonor] = useState<{
		id: string;
		country: { id: string };
	} | null>(null);

	const currentProject = dashboardData?.project;
	let initialValues = props.initialValues ? props.initialValues : defaultFormValues;

	const [values, setValues] = useState<IBudgetTrackingLineitemForm>(defaultFormValues);

	const [filesArray, setFilesArray] = React.useState<AttachFile[]>(
		initialValues.attachments ? initialValues.attachments : []
	);
	// console.log("here props", props, initialValues);
	let {
		multiplefileMorph,
		loading: uploadMorphLoading,
		success,
		setSuccess,
	} = useMultipleFileUpload(filesArray, setFilesArray);

	const [submittedBudgetTarget, setSubmittedBudgetTarget] = React.useState<
		string | number | undefined
	>("");

	const [selectedBudgetTarget, setSelectedBudgetTarget] = useState<
		IGET_BUDGET_TARGET_PROJECT["projectBudgetTargets"][0]
	>();

	const { refetch: budgetTrackingRefetch } = useQuery(GET_PROJECT_BUDGET_TARCKING, {
		variables: {
			filter: { budget_targets_project: submittedBudgetTarget ? submittedBudgetTarget : "" },
		},
	});

	// const [openBudgetTargetDialog, setOpenBudgetTargetDialog] = useState<boolean>(false);
	const [openGrantPeriodDialog, setOpenGrantPeriodDialog] = useState<boolean>(false);

	const { handleClose } = props;

	const closeDialog = useCallback(() => {
		budgetLineitemFormInputFields[5].hidden = false;
		budgetLineitemFormInputFields[7].size = 12;
		budgetLineitemFormInputFields[7].optionsArray = [];
		setFilesArray([]);

		handleClose();
	}, [handleClose, setFilesArray]);

	useEffect(() => {
		if (success) {
			if (props.formAction === FORM_ACTIONS.CREATE) {
				budgetTrackingRefetch();
			} else if (props.formAction === FORM_ACTIONS.UPDATE && props.refetchOnSuccess) {
				props.refetchOnSuccess();
			}
			setSuccess(false);
			closeDialog();
		}
	}, [success, budgetTrackingRefetch, props, setSuccess]);

	const [createProjectBudgetTracking, { loading: creatingLineItem }] = useMutation(
		CREATE_PROJECT_BUDGET_TRACKING,
		{
			onCompleted(data) {
				multiplefileMorph({
					related_id: data.createProjBudgetTracking.id,
					related_type: "budget_tracking_lineitem",
					field: "attachments",
				});
			},
		}
	);
	const [updateProjectBudgetTracking, { loading: updatingLineItem }] = useMutation(
		UPDATE_PROJECT_BUDGET_TRACKING
	);

	let [getBudgetTargetProject, { data: budgetTargets }] = useLazyQuery(GET_BUDGET_TARGET_PROJECT);

	let [getAnnualYears, { data: annualYears }] = useLazyQuery(GET_ANNUAL_YEAR_LIST);

	let [getGrantPeriodProject, { data: grantPeriodProject }] = useLazyQuery(
		GET_GRANT_PERIODS_PROJECT_LIST
	);

	let [getFinancialYearOrg, { data: financialYearOrg }] = useLazyQuery(GET_FINANCIAL_YEARS);
	let [getFinancialYearDonor, { data: financialYearDonor }] = useLazyQuery(GET_FINANCIAL_YEARS);

	let [getCurrency, { data: currency }] = useLazyQuery(GET_CURRENCY_LIST);

	const [openAttachFiles, setOpenAttachFiles] = React.useState<boolean>();

	/* Open Attach File Form*/
	budgetLineitemFormInputFields[8].onClick = () => setOpenAttachFiles(true);

	if (filesArray.length) budgetLineitemFormInputFields[8].label = "View Files";
	else budgetLineitemFormInputFields[8].label = "Attach Files";

	if (filesArray.length)
		budgetLineitemFormInputFields[8].textNextToButton = `${filesArray.length} files attached`;
	else budgetLineitemFormInputFields[8].textNextToButton = ``;
	useEffect(() => {
		if (currentProject) {
			getBudgetTargetProject({
				variables: {
					filter: {
						project: currentProject?.id,
					},
				},
			});
		}
	}, [currentProject, getBudgetTargetProject]);

	const validate = useCallback(
		(values: IBudgetTrackingLineitemForm) => {
			let errors: Partial<IBudgetTrackingLineitemForm> = {};
			if (values.budget_targets_project) {
				setSelectedDonor(budgetTargetHash[values.budget_targets_project]);
			}
			if (
				values.budget_targets_project &&
				budgetTargetHash[values.budget_targets_project]?.country?.id ===
					dashboardData?.organization?.country?.id
			) {
				budgetLineitemFormInputFields[5].hidden = true;
				budgetLineitemFormInputFields[7].size = 6;
			} else {
				budgetLineitemFormInputFields[5].hidden = false;
				budgetLineitemFormInputFields[7].size = 12;
			}

			if (!values.budget_targets_project) {
				budgetLineitemFormInputFields[7].optionsArray = [];
			} else {
				budgetLineitemFormInputFields[7].optionsArray =
					grantPeriodProject?.grantPeriodsProjectList || [];
			}

			if (!values.amount) {
				errors.amount = "Amount is required";
			}

			if (!values.budget_targets_project) {
				errors.budget_targets_project = "Budget project is required";
			}

			if (!values.reporting_date) {
				errors.reporting_date = "Reporting date is required";
			}

			return errors;
		},
		[setSelectedDonor, dashboardData, grantPeriodProject]
	);

	useEffect(() => {
		getAnnualYears();
	}, [getAnnualYears]);

	useEffect(() => {
		if (selectedDonor) {
			getGrantPeriodProject({
				variables: {
					filter: {
						donor: selectedDonor?.id,
						project: currentProject?.id,
					},
				},
			});
		}
	}, [selectedDonor, getGrantPeriodProject, currentProject]);

	useEffect(() => {
		if (dashboardData?.organization) {
			getFinancialYearOrg({
				variables: {
					filter: {
						country: dashboardData?.organization?.country?.id,
					},
				},
			});
		}
	}, [dashboardData, getFinancialYearOrg]);

	useEffect(() => {
		if (selectedDonor) {
			getFinancialYearDonor({
				variables: {
					filter: {
						country: selectedDonor.country.id,
					},
				},
			});
		}
	}, [selectedDonor, getFinancialYearDonor]);

	useEffect(() => {
		if (dashboardData) {
			getCurrency({
				variables: {
					filter: {
						country: dashboardData?.organization?.country?.id,
					},
				},
			});
		}
	}, [getCurrency, dashboardData]);

	useEffect(() => {
		if (budgetTargets) {
			budgetTargetHash = budgetTargets.projectBudgetTargets.reduce(
				(accunulator: any, current: any) => {
					accunulator[current.id] = current.donor;
					return accunulator;
				},
				{} as { [key: string]: { id: string; country: { id: string } } }
			);
		}
	}, [budgetTargets]);

	const onCreate = async (valuesSubmitted: IBudgetTrackingLineitemForm) => {
		const reporting_date = new Date(valuesSubmitted.reporting_date);
		setSubmittedBudgetTarget(valuesSubmitted.budget_targets_project);
		let values = removeEmptyKeys<IBudgetTrackingLineitemForm>({
			objectToCheck: valuesSubmitted,
		});

		try {
			if (budgetLineitemFormInputFields[5].hidden) {
				values.fy_donor = values.fy_org;
			}
			await createProjectBudgetTracking({
				variables: {
					input: {
						...values,
						reporting_date,
					},
				},
				update: async (store, { data: { createProjBudgetTracking: lineItemCreated } }) => {
					try {
						const count = await store.readQuery<{ projBudgetTrackingsCount: number }>({
							query: GET_PROJ_BUDGET_TRACINGS_COUNT,
							variables: {
								filter: {
									budget_targets_project:
										lineItemCreated.budget_targets_project.id,
								},
							},
						});
						store.writeQuery<{ projBudgetTrackingsCount: number }>({
							query: GET_PROJ_BUDGET_TRACINGS_COUNT,
							variables: {
								filter: {
									budget_targets_project:
										lineItemCreated.budget_targets_project.id,
								},
							},
							data: {
								projBudgetTrackingsCount: count!.projBudgetTrackingsCount + 1,
							},
						});
						let limit = 0;
						if (count) {
							limit = count.projBudgetTrackingsCount;
						}
						const data = await store.readQuery<IGET_BUDGET_TARCKING_LINE_ITEM>({
							query: GET_PROJECT_BUDGET_TARCKING,
							variables: {
								filter: {
									budget_targets_project:
										lineItemCreated.budget_targets_project.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let budgetLineItems: IBUDGET_LINE_ITEM_RESPONSE[] = data?.projBudgetTrackings
							? data?.projBudgetTrackings
							: [];
						store.writeQuery({
							query: GET_PROJECT_BUDGET_TARCKING,
							variables: {
								filter: {
									budget_targets_project:
										lineItemCreated.budget_targets_project.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								projBudgetTrackings: [lineItemCreated, ...budgetLineItems],
							},
						});
					} catch (err) {}

					try {
						const amountSpentData = store.readQuery<{
							projBudgetTrackingsTotalAmount: number;
						}>({
							query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
							variables: {
								filter: {
									budgetTargetsProject: lineItemCreated.budget_targets_project.id,
								},
							},
						});
						store.writeQuery({
							query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
							variables: {
								filter: {
									budgetTargetsProject: lineItemCreated.budget_targets_project.id,
								},
							},
							data: {
								projBudgetTrackingsTotalAmount:
									(amountSpentData?.projBudgetTrackingsTotalAmount
										? amountSpentData?.projBudgetTrackingsTotalAmount
										: 0) + lineItemCreated.amount,
							},
						});
					} catch (err) {}
				},
				refetchQueries: [
					{
						query: GET_PROJECT_AMOUNT_SPEND,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget Line Item Creation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Line Item Creation Failure"));
		} finally {
			closeDialog();
		}
	};

	const onUpdate = async (valuesSubmitted: IBudgetTrackingLineitemForm) => {
		try {
			const reporting_date = new Date(valuesSubmitted.reporting_date);
			let values = removeEmptyKeys<IBudgetTrackingLineitemForm>({
				objectToCheck: valuesSubmitted,
				keysToRemainUnchecked: {
					note: 1,
				},
			});
			values = { ...values, attachments: filesArray };
			if (compareObjectKeys(values, initialValues)) {
				closeDialog();
				return;
			}
			delete (values as any).id;
			delete (values as any).attachments;
			if (budgetLineitemFormInputFields[5].hidden) {
				values.fy_donor = values.fy_org;
			}
			await updateProjectBudgetTracking({
				variables: {
					id: initialValues.id,
					input: {
						...values,
						reporting_date,
					},
				},
				update: async (store, { data: { updateProjBudgetTracking: lineItemCreated } }) => {
					try {
						const amountSpentData = store.readQuery<{
							projBudgetTrackingsTotalAmount: number;
						}>({
							query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
							variables: {
								filter: {
									budgetTargetsProject: lineItemCreated.budget_targets_project.id,
								},
							},
						});
						const change = lineItemCreated.amount - +initialValues.amount;
						store.writeQuery({
							query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
							variables: {
								filter: {
									budgetTargetsProject: lineItemCreated.budget_targets_project.id,
								},
							},
							data: {
								projBudgetTrackingsTotalAmount:
									(amountSpentData?.projBudgetTrackingsTotalAmount
										? amountSpentData?.projBudgetTrackingsTotalAmount
										: 0) + change,
							},
						});
					} catch (err) {}
				},
				refetchQueries: [
					{
						query: GET_PROJECT_AMOUNT_SPEND,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget  Line Item Updation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget  Line Item Updation Failure"));
		} finally {
			closeDialog();
		}
	};

	useEffect(() => {
		if (initialValues.budget_targets_project) {
			setSelectedBudgetTarget(
				getBudgetTarget({
					budgetTargetId: initialValues.budget_targets_project,
					budgetTargets: budgetTargets?.projectBudgetTargets || [],
				})
			);
		}
	}, [initialValues, budgetTargets]);

	budgetLineitemFormInputFields[3].getInputValue = (budgetTargetId: string) => {
		setSelectedBudgetTarget(
			getBudgetTarget({
				budgetTargetId,
				budgetTargets: budgetTargets?.projectBudgetTargets || [],
			})
		);
	};

	if (grantPeriodProject) {
		budgetLineitemFormInputFields[7].optionsArray = grantPeriodProject.grantPeriodsProjectList;
	}

	if (financialYearOrg) {
		budgetLineitemFormInputFields[6].optionsArray = financialYearOrg?.financialYearList
			? financialYearOrg?.financialYearList
			: [];
	}

	if (currency?.currencyList?.length) {
		budgetLineitemFormInputFields[1].endAdornment = currency.currencyList[0].code;
	}

	if (annualYears) {
		budgetLineitemFormInputFields[4].optionsArray = annualYears.annualYearList;
	}

	if (budgetTargets) {
		budgetLineitemFormInputFields[3].optionsArray = budgetTargets.projectBudgetTargets;
	}
	if (financialYearDonor) {
		budgetLineitemFormInputFields[5].optionsArray = financialYearDonor?.financialYearList || [];
	}

	// budgetLineitemFormInputFields[0].addNewClick = () => setOpenBudgetTargetDialog(true);
	budgetLineitemFormInputFields[7].addNewClick = () => setOpenGrantPeriodDialog(true);
	let { newOrEdit } = CommonFormTitleFormattedMessage(props.formAction);

	return (
		<>
			{/* <BudgetTarget
				open={openBudgetTargetDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenBudgetTargetDialog(false)}
			/> */}
			<GrantPeriodDialog
				open={openGrantPeriodDialog}
				onClose={() => {
					setOpenGrantPeriodDialog(false);
				}}
				action={FORM_ACTIONS.CREATE}
			/>
			<FormDialog
				handleClose={closeDialog}
				open={props.open}
				loading={creatingLineItem || updatingLineItem}
				title={newOrEdit + " " + budgetTargetLineTitle}
				subtitle={""}
				workspace={dashboardData?.project?.workspace?.name || ""}
				project={dashboardData?.project?.name || ""}
				{...(selectedBudgetTarget
					? {
							formDetails: (
								<FormDetails
									budgetTarget={selectedBudgetTarget}
									currency={currency?.currencyList[0]?.code}
								/>
							),
					  }
					: {})}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onCreate}
					onCancel={closeDialog}
					inputFields={budgetLineitemFormInputFields}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
				{openAttachFiles && (
					<AttachFileForm
						open={openAttachFiles}
						handleClose={() => setOpenAttachFiles(false)}
						filesArray={filesArray}
						setFilesArray={setFilesArray}
						parentOnSuccessCall={
							props.formAction === FORM_ACTIONS.UPDATE && props.refetchOnSuccess
								? props.refetchOnSuccess
								: undefined
						}
						uploadApiConfig={{
							ref: "budget-tracking-lineitem",
							refId:
								props.formAction === FORM_ACTIONS.UPDATE
									? props.initialValues.id || ""
									: "",
							field: "attachments",
							path: `org-${dashboardData?.organization?.id}/project-${dashboardData?.project?.id}/budget-tracking-lineitem`,
						}}
					/>
				)}
			</FormDialog>
		</>
	);
}

export default BudgetLineitem;
