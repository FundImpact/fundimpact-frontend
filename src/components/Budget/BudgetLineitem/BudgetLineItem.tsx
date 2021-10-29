import { useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { GET_ANNUAL_YEAR_LIST, GET_FINANCIAL_YEARS, GET_CURRENCY_LIST } from "../../../graphql/";
import {
	GET_BUDGET_SUB_TARGETS,
	GET_BUDGET_SUB_TARGETS_COUNT,
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
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../../utils";
import { getTodaysDate } from "../../../utils";
import { CommonFormTitleFormattedMessage } from "../../../utils/commonFormattedMessage";

import FormDialog from "../../FormDialog";
import AttachFileForm from "../../Forms/AttachFiles";
import CommonForm from "../../CommonForm";
import { budgetLineitemFormInputFields } from "./inputFields.json";
// import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";
import { Grid, Box, Typography, useTheme } from "@material-ui/core";
import AmountSpent from "../../Table/Budget/BudgetTargetTable/AmountSpent";
import { GET_PROJECT_AMOUNT_SPEND } from "../../../graphql/project";
import DeleteModal from "../../DeleteModal";
import { useDocumentTableDataRefetch } from "../../../hooks/document";
import { GET_YEARTAGS } from "../../../graphql/yearTags/query";
import { YearTagPayload } from "../../../models/yearTags";
import { GET_GRANT_PERIOD } from "../../../graphql";

const defaultFormValues: IBudgetTrackingLineitemForm = {
	amount: "",
	note: "",
	budget_sub_target: "",
	annual_year: "",
	reporting_date: getTodaysDate(),
	fy_donor: "",
	fy_org: "",
	financial_year_org: "",
	financial_year_donor: "",
	timeperiod_start: "",
	timeperiod_end: "",
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
	const apolloClient = useApolloClient();

	const [lists, setList] = useState<{
		annualYear: any;
		financialYear: any;
	}>({
		annualYear: [],
		financialYear: [],
	});

	const { data: yearTags } = useQuery(GET_YEARTAGS, {
		onError: (err) => {
			console.log("err", err);
		},
	});

	useEffect(() => {
		let yearTagsLists: {
			annualYear: any;
			financialYear: any;
		} = {
			annualYear: [],
			financialYear: [],
		};
		yearTags?.yearTags?.forEach((elem: YearTagPayload) => {
			if (elem.type === "annual") {
				yearTagsLists.annualYear.push(elem);
			} else if (elem.type === "financial") {
				yearTagsLists.financialYear.push(elem);
			}
		});
		setList(yearTagsLists);
	}, [yearTags]);

	const [selectedDonor, setSelectedDonor] = useState<{
		id: string;
		country: { id: string };
	} | null>(null);

	const currentProject = dashboardData?.project;
	let initialValues = props.initialValues ? props.initialValues : defaultFormValues;

	const [filesArray, setFilesArray] = React.useState<AttachFile[]>(
		initialValues.attachments ? initialValues.attachments : []
	);
	let { multiplefileMorph, success, setSuccess } = useMultipleFileUpload(
		filesArray,
		setFilesArray
	);

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
	// const [openGrantPeriodDialog, setOpenGrantPeriodDialog] = useState<boolean>(false);

	const { handleClose } = props;

	const closeDialog = useCallback(() => {
		budgetLineitemFormInputFields[6].hidden = false;
		budgetLineitemFormInputFields[8].size = 12;
		budgetLineitemFormInputFields[8].optionsArray = [];
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, budgetTrackingRefetch, props, setSuccess]);

	const { refetchDocuments } = useDocumentTableDataRefetch({ projectDocumentRefetch: false });

	const [createProjectBudgetTracking, { loading: creatingLineItem }] = useMutation(
		CREATE_PROJECT_BUDGET_TRACKING,
		{
			onCompleted(data) {
				multiplefileMorph({
					related_id: data.createProjBudgetTracking.id,
					related_type: "budget_tracking_lineitem",
					field: "attachments",
				}).then(() => refetchDocuments());
			},
		}
	);
	const [updateProjectBudgetTracking, { loading: updatingLineItem }] = useMutation(
		UPDATE_PROJECT_BUDGET_TRACKING
	);

	let [getBudgetSubTarget, { data: budgetTargets }] = useLazyQuery(GET_BUDGET_SUB_TARGETS);

	let [getAnnualYears] = useLazyQuery(GET_ANNUAL_YEAR_LIST);

	let [getGrantPeriodProject, { data: grantPeriodProject }] = useLazyQuery(GET_GRANT_PERIOD);

	let [getFinancialYearOrg, { data: financialYearOrg }] = useLazyQuery(GET_FINANCIAL_YEARS);
	let [getFinancialYearDonor] = useLazyQuery(GET_FINANCIAL_YEARS);
	let [getCurrency, { data: currency }] = useLazyQuery(GET_CURRENCY_LIST);

	const [openAttachFiles, setOpenAttachFiles] = React.useState<boolean>();

	/* Open Attach File Form*/
	budgetLineitemFormInputFields[9].onClick = () => setOpenAttachFiles(true);

	if (filesArray.length) budgetLineitemFormInputFields[9].label = "View Files";
	else budgetLineitemFormInputFields[9].label = "Attach Files";

	if (filesArray.length)
		budgetLineitemFormInputFields[9].textNextToButton = `${filesArray.length} files attached`;
	else budgetLineitemFormInputFields[9].textNextToButton = ``;
	useEffect(() => {
		if (currentProject) {
			getBudgetSubTarget({
				variables: {
					filter: {
						project: currentProject?.id,
					},
				},
			});
		}
	}, [currentProject, getBudgetSubTarget]);

	const validate = useCallback(
		(values: IBudgetTrackingLineitemForm) => {
			let errors: Partial<IBudgetTrackingLineitemForm> = {};
			if (values.budget_sub_target) {
				setSelectedDonor(budgetTargetHash[values.budget_sub_target]);
			}
			if (
				values.budget_sub_target &&
				budgetTargetHash[values.budget_sub_target]?.country?.id ===
					dashboardData?.organization?.country?.id
			) {
				budgetLineitemFormInputFields[6].hidden = true;
				// budgetLineitemFormInputFields[8].size = 6;
			} else {
				budgetLineitemFormInputFields[6].hidden = false;
				// budgetLineitemFormInputFields[8].size = 12;
			}

			// if (!values.budget_sub_target) {
			// 	budgetLineitemFormInputFields[8].optionsArray = [];
			// } else {
			// 	budgetLineitemFormInputFields[8].optionsArray =
			// 		grantPeriodProject?.grantPeriodsProjectList || [];
			// }

			if (!values.amount) {
				errors.amount = "Amount is required";
			}

			if (!values.budget_sub_target) {
				errors.budget_sub_target = "Budget project is required";
			}

			if (!values.reporting_date) {
				errors.reporting_date = "Reporting date is required";
			}
			return errors;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
						country: selectedDonor?.country?.id,
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
			budgetTargetHash = budgetTargets.budgetSubTargets.reduce(
				(accunulator: any, current: any) => {
					accunulator[current.id] = current.donor;
					return accunulator;
				},
				{} as { [key: string]: { id: string; country: { id: string } } }
			);
		}
	}, [budgetTargets]);

	const getBudgetTargetBySubTarget = async (apolloClient: any, budget_sub_target: string) => {
		let subtarget;
		try {
			subtarget = await apolloClient.query({
				query: GET_BUDGET_SUB_TARGETS,
				variables: {
					filter: {
						id: budget_sub_target,
					},
				},
				fetchPolicy: "network-only",
			});
		} catch (error) {
			console.error(error);
		}
		return subtarget?.data?.budgetSubTargets?.[0]?.budget_targets_project?.id || undefined;
	};

	const onCreate = async (valuesSubmitted: IBudgetTrackingLineitemForm) => {
		let currentBudgetTarget = await getBudgetTargetBySubTarget(
			apolloClient,
			valuesSubmitted.budget_sub_target || ""
		);
		const reporting_date = new Date(valuesSubmitted.reporting_date);
		setSubmittedBudgetTarget(valuesSubmitted.budget_targets_project);
		let values = removeEmptyKeys<IBudgetTrackingLineitemForm>({
			objectToCheck: valuesSubmitted,
		});

		try {
			if (budgetLineitemFormInputFields[6].hidden) {
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
							query: GET_PROJECT_BUDGET_TARCKING,
							variables: {
								filter: {
									budget_sub_target: lineItemCreated.budgetSubTargets.id,
								},
							},
						});
						store.writeQuery<{ projBudgetTrackingsCount: number }>({
							query: GET_PROJ_BUDGET_TRACINGS_COUNT,
							variables: {
								filter: {
									budget_sub_target: lineItemCreated.budgetSubTargets.id,
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
					{
						query: GET_PROJ_BUDGET_TRACINGS_COUNT,
						variables: {
							filter: {
								budget_sub_target: {
									budget_targets_project: currentBudgetTarget,
									project: dashboardData?.project?.id,
								},
							},
						},
					},
					{
						query: GET_PROJ_BUDGET_TRACINGS_COUNT,
						variables: {
							filter: {
								budget_sub_target: valuesSubmitted.budget_sub_target,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget Line Item Creation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			closeDialog();
		}
	};

	const onUpdate = async (valuesSubmitted: IBudgetTrackingLineitemForm) => {
		try {
			let currentBudgetTarget = await getBudgetTargetBySubTarget(
				apolloClient,
				valuesSubmitted.budget_sub_target || ""
			);
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
					{
						query: GET_PROJ_BUDGET_TRACINGS_COUNT,
						variables: {
							filter: {
								budget_sub_target: {
									budget_targets_project: currentBudgetTarget,
									project: dashboardData?.project?.id,
								},
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget  Line Item Updation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
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

	budgetLineitemFormInputFields[4].getInputValue = (budgetTargetId: string) => {
		setSelectedBudgetTarget(
			getBudgetTarget({
				budgetTargetId,
				budgetTargets: budgetTargets?.projectBudgetTargets || [],
			})
		);
	};

	if (financialYearOrg) {
		budgetLineitemFormInputFields[7].optionsArray = lists.financialYear
			? lists.financialYear
			: [];
	}

	if (currency?.currencyList?.length) {
		budgetLineitemFormInputFields[1].endAdornment = currency.currencyList[0].code;
	}

	if (lists.annualYear) {
		budgetLineitemFormInputFields[5].optionsArray = lists.annualYear;
	}

	if (budgetTargets) {
		budgetLineitemFormInputFields[4].optionsArray = budgetTargets.budgetSubTargets;
	}
	if (lists.financialYear) {
		budgetLineitemFormInputFields[6].optionsArray = lists.financialYear;
	}

	// budgetLineitemFormInputFields[0].addNewClick = () => setOpenBudgetTargetDialog(true);
	// budgetLineitemFormInputFields[8].addNewClick = () => setOpenGrantPeriodDialog(true);
	let { newOrEdit } = CommonFormTitleFormattedMessage(props.formAction);

	const onDelete = async () => {
		try {
			const reporting_date = new Date(initialValues?.reporting_date);
			const budgetLineItemValues = removeEmptyKeys({
				objectToCheck: { ...initialValues },
				keysToRemainUnchecked: {
					note: 1,
				},
			});
			delete budgetLineItemValues["id"];
			await updateProjectBudgetTracking({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...budgetLineItemValues,
						reporting_date,
					},
				},
				refetchQueries: [
					{
						query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
						variables: {
							filter: {
								budgetTargetsProject: initialValues?.budget_targets_project,
							},
						},
					},
					{
						query: GET_PROJECT_AMOUNT_SPEND,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_BUDGET_SUB_TARGETS_COUNT,
						variables: {
							filter: {
								budget_targets_project: initialValues?.budget_targets_project,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget Line Item Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={handleClose}
				onDeleteConformation={onDelete}
				title="Delete Budget Line Item"
			/>
		);
	}

	return (
		<>
			{/* <BudgetTarget
				open={openBudgetTargetDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenBudgetTargetDialog(false)}
			/> */}
			{/* <GrantPeriodDialog
				open={openGrantPeriodDialog}
				onClose={() => {
					setOpenGrantPeriodDialog(false);
				}}
				action={FORM_ACTIONS.CREATE}
			/> */}
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
						parentOnSuccessCall={() => {
							if (props.formAction === FORM_ACTIONS.UPDATE) {
								props?.refetchOnSuccess?.();
								refetchDocuments();
							}
						}}
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
