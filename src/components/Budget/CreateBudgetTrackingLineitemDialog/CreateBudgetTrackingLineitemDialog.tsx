import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useLazyQuery, useApolloClient } from "@apollo/client";
import {
	CREATE_PROJECT_BUDGET_TRACKING,
	UPDATE_PROJECT_BUDGET_TRACKING,
} from "../../../graphql/queries/budget";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../graphql/queries";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/queries/budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IGET_BUDGET_TARGET_PROJECT } from "../../../models/budget/query";
import { ICreateBudgetTargetProjectDialogProps } from "../../../models/budget/budget";
import { FORM_ACTIONS } from "../../../models/budget/constants";
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
import CommonDialog from "../../Dasboard/CommonDialog";
import CommonInputForm from "../../Forms/CommonInputForm/CommonInputForm";
import {
	GET_GRANT_PERIODS_PROJECT_LIST,
	GET_PROJECT_BUDGET_TARCKING,
} from "../../../graphql/queries/budget/query";
import {
	GET_FINANCIAL_YEARS_ORG_LIST_BY_ORG,
	GET_FINANCIAL_YEARS_DONOR_LIST_BY_DONOR,
	GET_ANNUAL_YEAR_LIST,
} from "../../../graphql/queries/";
import { GET_PROJ_DONORS_BY_DONOR } from "../../../graphql/queries/project/project";
import { getTodaysDate } from "../../../utils/index";

const defaultFormValues: IBudgetTrackingLineitemForm = {
	amount: "",
	note: "",
	conversion_factor: "",
	budget_targets_project: "",
	annual_year: "",
	financial_years_org: "",
	financial_years_donor: "",
	grant_periods_project: "",
	organization_currency: "",
	donor: "",
	reporting_date: getTodaysDate(),
};

const compObject = (obj1: any, obj2: any): boolean =>
	Object.keys(obj1).length == Object.keys(obj2).length &&
	Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && obj2[key] == obj1[key]);

function CreateBudgetTrackingLineItemDialog(props: any) {
	const apolloClient = useApolloClient();
	const [selectedDonor, setSelectedDonor] = useState("");

	const notificationDispatch = useNotificationDispatch();
	const [createProjectBudgetTracking, { loading: creatingProjectBudgeetTracking }] = useMutation(
		CREATE_PROJECT_BUDGET_TRACKING
	);

	let initialValues = props.initialValues ? props.initialValues : defaultFormValues;

	const [updateProjectBudgetTracking, { loading: updatingProjectBudgetTarget }] = useMutation(
		UPDATE_PROJECT_BUDGET_TRACKING
	);

	const dashboardData = useDashBoardData();
	const currentProject = dashboardData?.project;

	//write usecallback here
	const validate = (values: IBudgetTrackingLineitemForm) => {
		let errors: Partial<IBudgetTrackingLineitemForm> = {};
		if (values.donor) {
			setSelectedDonor(values.donor);
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
		if (!values.conversion_factor) {
			errors.conversion_factor = "Conversion Factor is required";
		}
		if (!values.annual_year) {
			errors.annual_year = "Annual year is required";
		}
		if (!values.financial_years_donor) {
			errors.financial_years_donor = "Financial year of donor is required";
		}
		if (!values.financial_years_org) {
			errors.financial_years_org = "Financial year of organization is required";
		}
		if (!values.grant_periods_project) {
			errors.grant_periods_project = "Grant period of project is required";
		}
		if (!values.organization_currency) {
			errors.organization_currency = "Organization currency is required";
		}
		if (!values.donor) {
			errors.donor = "Donor is required";
		}
		console.log("values.reportigDate :>> ", typeof values.reporting_date);
		if (!values.reporting_date) {
			console.log("values.reporting_date :>> ", values.reporting_date);
			// errors.reporting_date = "Reporting date is required";
		}
		return errors;
	};

	const { data: annualYears } = useQuery(GET_ANNUAL_YEAR_LIST);

	const { data: projectDonors } = useQuery(GET_PROJ_DONORS_BY_DONOR, {
		variables: {
			filter: {
				project: currentProject?.id,
			},
		},
	});

	const { data: orgCurrencies, error } = useQuery(GET_ORG_CURRENCIES_BY_ORG, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
			},
		},
	});
	//change this
	console.log("dashboardData :>> ", dashboardData);
	const { data: grantPeriodProjectList } = useQuery(GET_GRANT_PERIODS_PROJECT_LIST, {
		variables: {
			filter: {
				project: currentProject?.id,
			},
		},
	});
	const { data: financialYearsOrgList } = useQuery(GET_FINANCIAL_YEARS_ORG_LIST_BY_ORG, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
			},
		},
	});
	const [getFinancialYearsDonorList, { data: financialYearsDonorList }] = useLazyQuery(
		GET_FINANCIAL_YEARS_DONOR_LIST_BY_DONOR
	);

	useEffect(() => {
		console.log("initialValues.donor :>> ", initialValues.donor);
		if (initialValues.donor) {
			getFinancialYearsDonorList({
				variables: {
					filter: {
						donor: initialValues.donor,
					},
				},
			});
		}
	}, [initialValues.donor]);

	useEffect(() => {
		if (selectedDonor) {
			getFinancialYearsDonorList({
				variables: {
					filter: {
						donor: selectedDonor,
					},
				},
			});
		}
	}, [selectedDonor]);

	const [getBudgetTargetProject] = useLazyQuery(GET_BUDGET_TARGET_PROJECT);
	//projectBudgetTargets
	//change the type
	let oldCachedBudgetTargetProjectData: any = null;
	try {
		oldCachedBudgetTargetProjectData = apolloClient.readQuery({
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project: currentProject?.id,
				},
			},
		});
	} catch (error) {}

	useEffect(() => {
		if (!oldCachedBudgetTargetProjectData) {
			getBudgetTargetProject({
				variables: {
					filter: {
						project: currentProject?.id,
					},
				},
			});
		}
	}, [oldCachedBudgetTargetProjectData]);
	// const { data: budgetCategory } = useQuery(GET_ORGANIZATION_BUDGET_CATEGORY);

	useEffect(() => {
		if (oldCachedBudgetTargetProjectData) {
			createBudgetTrackingLineitemFormSelectFields[0].optionsArray =
				oldCachedBudgetTargetProjectData.projectBudgetTargets;
		}
		if (!createBudgetTrackingLineitemFormSelectFields[1].optionsArray.length && annualYears) {
			createBudgetTrackingLineitemFormSelectFields[1].optionsArray =
				annualYears.annualYearList;
		}
		if (financialYearsOrgList) {
			createBudgetTrackingLineitemFormSelectFields[2].optionsArray =
				financialYearsOrgList.financialYearsOrgList;
		}
		if (projectDonors) {
			createBudgetTrackingLineitemFormSelectFields[3].optionsArray = projectDonors.projectDonors.map(
				({ donor }: { donor: { id: string; name: string } }) => {
					return { name: donor.name, id: donor.id };
				}
			);
		}
		if (financialYearsDonorList) {
			createBudgetTrackingLineitemFormSelectFields[4].optionsArray =
				financialYearsDonorList.financialYearsDonorList;
		}
		if (grantPeriodProjectList) {
			createBudgetTrackingLineitemFormSelectFields[5].optionsArray =
				grantPeriodProjectList.grantPeriodsProjectList;
		}
		if (orgCurrencies) {
			createBudgetTrackingLineitemFormSelectFields[6].optionsArray = orgCurrencies.orgCurrencies.map(
				(element: { id: string; currency: { name: string } }) => {
					return {
						name: element.currency.name,
						id: element.id,
					};
				}
			);
		}
	}, [
		orgCurrencies,
		grantPeriodProjectList,
		financialYearsOrgList,
		financialYearsDonorList,
		oldCachedBudgetTargetProjectData,
		projectDonors,
	]);

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
						const data: any = store.readQuery({
							query: GET_PROJECT_BUDGET_TARCKING,
						});
						console.log("lineItemCreated :>> ", lineItemCreated);
						console.log("data :>> ", data);
						store.writeQuery({
							query: GET_PROJECT_BUDGET_TARCKING,
							data: {
								projBudgetTrackings: [
									...data!.projBudgetTrackings,
									lineItemCreated,
								],
							},
						});
					} catch (err) {
						throw err;
					}
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
			if (compObject(values, initialValues)) {
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
		<CommonDialog
			handleClose={props.handleClose}
			open={props.open}
			loading={false}
			title="Report Expenditure"
			subtitle="Physical addresses of your organizatin like headquater, branch etc."
			workspace="WORKSPACE 1"
		>
			<CommonInputForm
				initialValues={initialValues}
				validate={validate}
				onSubmit={onCreate}
				onCancel={props.handleClose}
				inputFields={createBudgetTrackingLineitemForm}
				selectFields={createBudgetTrackingLineitemFormSelectFields}
				formAction={props.formAction}
				onUpdate={onUpdate}
			/>
		</CommonDialog>
	);
}

export default CreateBudgetTrackingLineItemDialog;
