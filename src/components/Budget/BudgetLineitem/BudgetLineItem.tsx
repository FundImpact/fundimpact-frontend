import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
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
import { budgetLineitemFormInputFields } from "./inputFields.json";
import FormDialog from "../../FormDialog";
import CommonForm from "../../CommonForm";
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
	IGET_BUDGET_TARCKING_LINE_ITEM,
	IBUDGET_LINE_ITEM_RESPONSE,
} from "../../../models/budget/query";
import { compareObjectKeys } from "../../../utils";
import { removeEmptyKeys } from "../../../utils";

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
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const [selectedDonor, setSelectedDonor] = useState<{
		id: string;
		country: { id: string };
	} | null>(null);

	const currentProject = dashboardData?.project;
	let initialValues = props.initialValues ? props.initialValues : defaultFormValues;

	const [createProjectBudgetTracking, { loading: creatingLineItem }] = useMutation(
		CREATE_PROJECT_BUDGET_TRACKING
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

	let [getOrgCurrencies, { data: orgCurrencies }] = useLazyQuery(GET_ORG_CURRENCIES_BY_ORG);

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

	const closeDialog = useCallback(() => {
		budgetLineitemFormInputFields[5].hidden = false;
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
					budgetLineitemFormInputFields[5].hidden = true;
				} else {
					budgetLineitemFormInputFields[5].hidden = false;
				}
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
		[setSelectedDonor, dashboardData]
	);

	useEffect(() => {
		getAnnualYears();
	}, []);

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
	}, [selectedDonor, getGrantPeriodProject]);

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
	}, [dashboardData?.organization, getFinancialYearOrg]);

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
		if (dashboardData?.organization) {
			getOrgCurrencies({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
						isHomeCurrency: true,
					},
				},
			});
		}
	}, [getOrgCurrencies, dashboardData?.organization]);

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
									(amountSpentData?.projBudgetTrackingsTotalAmount
										? amountSpentData?.projBudgetTrackingsTotalAmount
										: 0) + change,
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

	if (grantPeriodProject) {
		budgetLineitemFormInputFields[7].optionsArray = grantPeriodProject.grantPeriodsProjectList;
	}

	if (financialYearOrg) {
		budgetLineitemFormInputFields[6].optionsArray = financialYearOrg?.financialYearList
			? financialYearOrg?.financialYearList
			: [];
	}

	if (orgCurrencies?.orgCurrencies?.length) {
		budgetLineitemFormInputFields[1].endAdornment =
			orgCurrencies.orgCurrencies[0].currency.code;
	}

	if (annualYears) {
		budgetLineitemFormInputFields[4].optionsArray = annualYears.annualYearList;
	}

	if (budgetTargets) {
		budgetLineitemFormInputFields[3].optionsArray = budgetTargets.projectBudgetTargets;
	}

	if (financialYearDonor) {
		budgetLineitemFormInputFields[5].optionsArray = financialYearDonor?.financialYearList
			? financialYearDonor?.financialYearList
			: [];
	}

	return (
		<FormDialog
			handleClose={closeDialog}
			open={props.open}
			loading={creatingLineItem || updatingLineItem}
			title="Report Budget Spend"
			subtitle="Physical addresses of your organizatin like headquater, branch etc."
			workspace={dashboardData?.workspace?.name}
			project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
		>
			<CommonForm
				initialValues={initialValues}
				validate={validate}
				onCreate={onCreate}
				onCancel={props.handleClose}
				inputFields={budgetLineitemFormInputFields}
				formAction={props.formAction}
				onUpdate={onUpdate}
			/>
		</FormDialog>
	);
}

export default React.memo(BudgetLineitem);
