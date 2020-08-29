import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useQuery, useApolloClient, useLazyQuery } from "@apollo/client";
import {
	CREATE_PROJECT_BUDGET_TRACKING,
	UPDATE_PROJECT_BUDGET_TRACKING,
} from "../../../graphql/Budget/mutation";
import { GET_BUDGET_TARGET_PROJECT, GET_PROJ_BUDGET_TRACINGS_COUNT } from "../../../graphql/Budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IBudgetLineitemProps } from "../../../models/budget/";
import { IBudgetTrackingLineitemForm } from "../../../models/budget/budgetForm";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { budgetLineitemFormSelectFields, budgetLineitemFormInputFields } from "./inputFields.json";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";
import {
	GET_PROJECT_BUDGET_TARCKING,
	GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
	GET_GRANT_PERIODS_PROJECT_LIST,
} from "../../../graphql/Budget";
import {
	GET_ANNUAL_YEAR_LIST,
	GET_FINANCIAL_YEARS,
	GET_ORG_CURRENCIES_BY_ORG,
} from "../../../graphql/";
import { getTodaysDate } from "../../../utils/index";
import {
	IGET_BUDGET_TARGET_PROJECT,
	IGET_BUDGET_TARCKING_LINE_ITEM,
} from "../../../models/budget/query";
import { compareObjectKeys } from "../../../utils";

const defaultFormValues: IBudgetTrackingLineitemForm = {
	amount: "",
	note: "",
	budget_targets_project: "",
	annual_year: "",
	reporting_date: getTodaysDate(),
	fy_donor: "",
	fy_org: "",
	grant_periods_project: "",
};

let budgetTargetHash: {
	[key: string]: {
		id: string;
		country: { id: string };
	};
} = {};

function BudgetLineitem(props: IBudgetLineitemProps) {
	const apolloClient = useApolloClient();
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const [selectedDonor, setSelectedDonor] = useState<{
		id: string;
		country: { id: string };
	} | null>(null);

	const currentProject = dashboardData?.project;
	let initialValues = props.initialValues ? props.initialValues : defaultFormValues;

	const [createProjectBudgetTracking, { loading: creatingLineItem, data }] = useMutation(
		CREATE_PROJECT_BUDGET_TRACKING
	);
	const [updateProjectBudgetTracking, { loading: updatingLineItem }] = useMutation(
		UPDATE_PROJECT_BUDGET_TRACKING
	);
	const [getBudgetTargetProject] = useLazyQuery(GET_BUDGET_TARGET_PROJECT, {
		variables: {
			filter: {
				project: currentProject?.id,
			},
		},
	});

	const { data: annualYears } = useQuery(GET_ANNUAL_YEAR_LIST);

	const closeDialog = useCallback(() => {
		budgetLineitemFormSelectFields[2].hidden = false;
		props.handleClose();
	}, []);

	const validate = useCallback(
		(values: IBudgetTrackingLineitemForm) => {
			let errors: Partial<IBudgetTrackingLineitemForm> = {};
			if (values.budget_targets_project) {
				setSelectedDonor(budgetTargetHash[values.budget_targets_project]);
				if (
					budgetTargetHash[values.budget_targets_project]?.country?.id ==
					dashboardData?.organization?.country?.id
				) {
					budgetLineitemFormSelectFields[2].hidden = true;
				} else {
					budgetLineitemFormSelectFields[2].hidden = false;
				}
			}

			if (!values.amount) {
				errors.amount = "Amount is required";
			}
			if (!values.note) {
				errors.note = "Note is required";
			}
			if (!values.budget_targets_project) {
				errors.budget_targets_project = "Budget project is required";
			}
			if (!values.annual_year) {
				errors.annual_year = "Annual year is required";
			}
			if (!values.reporting_date) {
				errors.reporting_date = "Reporting date is required";
			}
			if (!values.grant_periods_project) {
				errors.grant_periods_project = "Grant period is required";
			}
			if (!values.fy_donor && !budgetLineitemFormSelectFields[2].hidden) {
				errors.fy_donor = "Financial year of donor is required";
			}
			if (!values.fy_org) {
				errors.fy_org = "Financial year of organization is required";
			}

			return errors;
		},
		[setErrorNotification, dashboardData]
	);

	const { data: grantPeriodProject } = useQuery(GET_GRANT_PERIODS_PROJECT_LIST, {
		variables: {
			filter: {
				project: currentProject?.id,
			},
		},
	});

	const { data: financialYearOrg } = useQuery(GET_FINANCIAL_YEARS, {
		variables: {
			filter: {
				country: dashboardData?.organization?.country?.id,
			},
		},
	});

	const [getFinancialYearDonor, { data: financialYearDonor }] = useLazyQuery(GET_FINANCIAL_YEARS);

	let oldCachedBudgetTargetProjectData: IGET_BUDGET_TARGET_PROJECT | null = null;
	try {
		oldCachedBudgetTargetProjectData = apolloClient.readQuery<IGET_BUDGET_TARGET_PROJECT>({
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project: currentProject?.id,
				},
			},
		});
	} catch (error) {}

	const { data: orgCurrencies } = useQuery(GET_ORG_CURRENCIES_BY_ORG, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
				isHomeCurrency: true,
			},
		},
	});

	useEffect(() => {
		if (!oldCachedBudgetTargetProjectData && currentProject) {
			getBudgetTargetProject();
		}
	}, [oldCachedBudgetTargetProjectData, currentProject, getBudgetTargetProject]);

	useEffect(() => {
		if (orgCurrencies && orgCurrencies.orgCurrencies.length) {
			budgetLineitemFormInputFields[1].endAdornment =
				orgCurrencies.orgCurrencies[0].currency.code;
		}
	}, [orgCurrencies]);

	useEffect(() => {
		if (oldCachedBudgetTargetProjectData) {
			budgetLineitemFormSelectFields[0].optionsArray = oldCachedBudgetTargetProjectData.projectBudgetTargets as any;
			budgetTargetHash = oldCachedBudgetTargetProjectData.projectBudgetTargets.reduce(
				(accunulator, current) => {
					accunulator[current.id] = current.donor;
					return accunulator;
				},
				{} as { [key: string]: { id: string; country: { id: string } } }
			);
		}
	}, [oldCachedBudgetTargetProjectData]);

	useEffect(() => {
		if (annualYears) {
			budgetLineitemFormSelectFields[1].optionsArray = annualYears.annualYearList;
		}
	}, [annualYears]);

	useEffect(() => {
		if (financialYearDonor) {
			budgetLineitemFormSelectFields[2].optionsArray = financialYearDonor?.financialYears
				? financialYearDonor?.financialYears
				: [];
		}
	}, [financialYearDonor]);

	useEffect(() => {
		if (financialYearOrg) {
			budgetLineitemFormSelectFields[3].optionsArray = financialYearOrg?.financialYears
				? financialYearOrg?.financialYears
				: [];
		}
	}, [financialYearOrg]);

	useEffect(() => {
		if (grantPeriodProject) {
			budgetLineitemFormSelectFields[4].optionsArray =
				grantPeriodProject.grantPeriodsProjectList;
		}
	}, [grantPeriodProject]);

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
	}, [selectedDonor]);

	const onCreate = async (values: IBudgetTrackingLineitemForm) => {
		const reporting_date = new Date(values.reporting_date);
		try {
			if (budgetLineitemFormSelectFields[2].hidden) {
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
								projBudgetTrackings: [
									lineItemCreated,
									...data!.projBudgetTrackings,
								],
							},
						});
					} catch (err) {
						console.log("err :>> ", err);
					}

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
									amountSpentData!.projBudgetTrackingsTotalAmount +
									lineItemCreated.amount,
							},
						});
					} catch (err) {
						console.log("err :>> ", err);
					}
				},
			});
			notificationDispatch(setSuccessNotification("Budget Line Item Creation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Line Item Creation Failure"));
		} finally {
			closeDialog();
		}
	};

	const onUpdate = async (values: IBudgetTrackingLineitemForm) => {
		try {
			const reporting_date = new Date(values.reporting_date);
			if (compareObjectKeys(values, initialValues)) {
				closeDialog();
				return;
			}
			delete values.id;
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
									amountSpentData!.projBudgetTrackingsTotalAmount + change,
							},
						});
					} catch (err) {}
				},
			});
			notificationDispatch(setSuccessNotification("Budget  Line Item Updation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget  Line Item Updation Failure"));
		} finally {
			closeDialog();
		}
	};
	return (
		<FormDialog
			handleClose={closeDialog}
			open={props.open}
			loading={creatingLineItem || updatingLineItem}
			title="Report Expenditure"
			subtitle="Physical addresses of your organizatin like headquater, branch etc."
			workspace={dashboardData?.workspace?.name}
			project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
		>
			<CommonForm
				initialValues={initialValues}
				validate={validate}
				onSubmit={onCreate}
				onCancel={props.handleClose}
				inputFields={budgetLineitemFormInputFields}
				selectFields={budgetLineitemFormSelectFields}
				formAction={props.formAction}
				onUpdate={onUpdate}
			/>
		</FormDialog>
	);
}

export default React.memo(BudgetLineitem);
