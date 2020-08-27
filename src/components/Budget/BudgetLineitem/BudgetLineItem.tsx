import React, { useEffect } from "react";
import { useMutation, useQuery, useApolloClient, useLazyQuery } from "@apollo/client";
import {
	CREATE_PROJECT_BUDGET_TRACKING,
	UPDATE_PROJECT_BUDGET_TRACKING,
} from "../../../graphql/Budget/mutation";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/Budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IBudgetLineitemProps } from "../../../models/budget";
import { IBudgetTrackingLineitemForm } from "../../../models/budget/budgetForm";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	createBudgetTrackingLineitemFormSelectFields,
	createBudgetTrackingLineitemForm,
} from "../../../utils/inputFields.json";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";
import {
	GET_PROJECT_BUDGET_TARCKING,
	GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
} from "../../../graphql/Budget";
import { GET_ANNUAL_YEAR_LIST } from "../../../graphql";
import { getTodaysDate } from "../../../utils/index";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../graphql";
import {
	IGET_BUDGET_TARGET_PROJECT,
	IGET_BUDGET_TARCKING_LINE_ITEM,
	IBUDGET_TRACKING_LINE_ITEM_RESPONSE,
} from "../../../models/budget/query";
import { compareObjectKeys } from "../../../utils";

const defaultFormValues: IBudgetTrackingLineitemForm = {
	amount: "",
	note: "",
	budget_targets_project: "",
	annual_year: "",
	reporting_date: getTodaysDate(),
};

const validate = (values: IBudgetTrackingLineitemForm) => {
	let errors: Partial<IBudgetTrackingLineitemForm> = {};
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
	return errors;
};

function BudgetLineitem(props: IBudgetLineitemProps) {
	const apolloClient = useApolloClient();
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();

	const currentProject = dashboardData?.project;
	let initialValues = props.initialValues ? props.initialValues : defaultFormValues;

	const [createProjectBudgetTracking, { loading: creatingLineItem }] = useMutation(
		CREATE_PROJECT_BUDGET_TRACKING
	);
	const [updateProjectBudgetTracking, { loading: updatingLineItem }] = useMutation(
		UPDATE_PROJECT_BUDGET_TRACKING
	);
	const [getBudgetTargetProject] = useLazyQuery(GET_BUDGET_TARGET_PROJECT);
	const { data: annualYears } = useQuery(GET_ANNUAL_YEAR_LIST);

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
			getBudgetTargetProject({
				variables: {
					filter: {
						project: currentProject?.id,
					},
				},
			});
		}
	}, [oldCachedBudgetTargetProjectData, currentProject, getBudgetTargetProject]);

	useEffect(() => {
		if (orgCurrencies?.orgCurrencies?.length) {
			createBudgetTrackingLineitemForm[1].endAdornment =
				orgCurrencies.orgCurrencies[0].currency.code;
		}
	}, [orgCurrencies]);

	useEffect(() => {
		if (oldCachedBudgetTargetProjectData) {
			createBudgetTrackingLineitemFormSelectFields[0].optionsArray = oldCachedBudgetTargetProjectData.projectBudgetTargets as any;
		}
	}, [oldCachedBudgetTargetProjectData]);

	useEffect(() => {
		if (annualYears) {
			createBudgetTrackingLineitemFormSelectFields[1].optionsArray =
				annualYears.annualYearList;
		}
	}, [annualYears]);

	const onCreate = async (values: IBudgetTrackingLineitemForm) => {
		const reporting_date = new Date(values.reporting_date);
		try {
			await createProjectBudgetTracking({
				variables: {
					input: {
						...values,
						reporting_date,
					},
				},
				update: (store, { data: { createProjBudgetTracking: lineItemCreated } }) => {
					try {
						const data = store.readQuery<IGET_BUDGET_TARCKING_LINE_ITEM>({
							query: GET_PROJECT_BUDGET_TARCKING,
							variables: {
								filter: {
									budget_targets_project:
										lineItemCreated.budget_targets_project.id,
								},
							},
						});
						let budgetLineItems: IBUDGET_TRACKING_LINE_ITEM_RESPONSE[] = data?.projBudgetTrackings
							? data?.projBudgetTrackings
							: [];
						store.writeQuery({
							query: GET_PROJECT_BUDGET_TARCKING,
							variables: {
								filter: {
									budget_targets_project:
										lineItemCreated.budget_targets_project.id,
								},
							},
							data: {
								projBudgetTrackings: [...budgetLineItems, lineItemCreated],
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
			notificationDispatch(
				setSuccessNotification("Budget Tracking Line Item Creation Success")
			);
			props.handleClose();
		} catch (err) {
			notificationDispatch(
				setErrorNotification("Budget Tracking Line Item Creation Failure")
			);
			props.handleClose();
		}
	};

	const onUpdate = async (values: IBudgetTrackingLineitemForm) => {
		try {
			const reporting_date = new Date(values.reporting_date);
			if (compareObjectKeys(values, initialValues)) {
				props.handleClose();
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
					} catch (err) {
						console.log("err :>> ", err);
						// throw err;
					}
				},
			});
			notificationDispatch(
				setSuccessNotification("Budget Tracking Line Item Updation Success")
			);
			props.handleClose();
		} catch (err) {
			notificationDispatch(
				setErrorNotification("Budget Tracking Line Item Updation Failure")
			);
			props.handleClose();
		}
	};
	return (
		<FormDialog
			handleClose={props.handleClose}
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
				inputFields={createBudgetTrackingLineitemForm}
				selectFields={createBudgetTrackingLineitemFormSelectFields}
				formAction={props.formAction}
				onUpdate={onUpdate}
			/>
		</FormDialog>
	);
}

export default BudgetLineitem;
