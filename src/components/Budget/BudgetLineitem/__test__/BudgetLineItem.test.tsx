import React from "react";
import BudgetLineitem from "../BudgetLineItem";
import "@testing-library/jest-dom/extend-expect";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { CREATE_PROJECT_BUDGET_TRACKING } from "../../../../graphql/Budget/mutation";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_GRANT_PERIODS_PROJECT_LIST,
} from "../../../../graphql/Budget";
import {
	GET_ANNUAL_YEAR_LIST,
	GET_ORG_CURRENCIES_BY_ORG,
	GET_FINANCIAL_YEARS,
} from "../../../../graphql";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../../../models/budget/constants";
import {
	projectDetails,
	organizationDetails,
	mockOrgBudgetTargetProject,
	mockAnnualYearList,
	mockOrgHomeCurrency,
	mockFinancialYears,
	mockGrantPeriodsProjectList,
} from "../../../../utils/testMock.json";
import { getTodaysDate } from "../../../../utils";
import { IBudgetTrackingLineitemForm } from "../../../../models/budget/budgetForm";
import { act } from "react-dom/test-utils";
import { budgetLineitemFormInputFields, budgetLineitemFormSelectFields } from "../inputFields.json";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { fireEvent, wait } from "@testing-library/dom";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const intialFormValue: IBudgetTrackingLineitemForm = {
	reporting_date: getTodaysDate(),
	amount: "213",
	note: "desc",
	budget_targets_project: "3",
	annual_year: "ay",
	fy_donor: "1",
	fy_org: "1",
	grant_periods_project: "1",
};

const mocks = [
	{
		request: {
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projectBudgetTargets: mockOrgBudgetTargetProject,
			},
		},
	},
	{
		request: {
			query: GET_ANNUAL_YEAR_LIST,
			variables: {},
		},
		result: {
			data: {
				annualYearList: mockAnnualYearList,
			},
		},
	},
	{
		request: {
			query: GET_ORG_CURRENCIES_BY_ORG,
			variables: {
				filter: {
					organization: "3",
					isHomeCurrency: true,
				},
			},
		},
		result: {
			data: {
				orgCurrencies: mockOrgHomeCurrency,
			},
		},
	},
	{
		request: {
			query: GET_FINANCIAL_YEARS,
			variables: {
				filter: {
					country: "1",
				},
			},
		},
		result: {
			data: {
				financialYearList: mockFinancialYears,
			},
		},
	},
	{
		request: {
			query: GET_FINANCIAL_YEARS,
			variables: {
				filter: {
					country: "2",
				},
			},
		},
		result: {
			data: {
				financialYearList: mockFinancialYears,
			},
		},
	},
	{
		request: {
			query: GET_GRANT_PERIODS_PROJECT_LIST,
			variables: {
				filter: {
					donor: "1",
					project: 3,
				},
			},
		},
		result: {
			data: {
				grantPeriodsProjectList: mockGrantPeriodsProjectList,
			},
		},
	},
	{
		request: {
			query: CREATE_PROJECT_BUDGET_TRACKING,
			variables: {
				input: {
					amount: 213,
					note: "desc",
					budget_targets_project: "3",
					annual_year: "ay",
					reporting_date: new Date(getTodaysDate()),
					fy_donor: "1",
					fy_org: "1",
					grant_periods_project: "1",
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createProjBudgetTracking: {
						amount: 213,
						note: "desc",
						reporting_date: new Date(getTodaysDate()),
						budget_targets_project: {
							id: "3",
							name: "bud name 1",
						},
						annual_year: {
							id: "ay",
							name: "year 1",
						},
						fy_org: {
							id: "1",
							name: "financial year 1",
						},
						grant_periods_project: {
							id: "1",
							name: "Quater 1",
						},
						fy_donor: {
							id: "1",
							name: "financial year 1",
						},
					},
				},
			};
		},
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<NotificationProvider>
				<DashboardProvider
					defaultState={{ project: projectDetails, organization: organizationDetails }}
				>
					<BudgetLineitem
						formAction={FORM_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
					/>
				</DashboardProvider>
			</NotificationProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

const inputIds = [...budgetLineitemFormInputFields, ...budgetLineitemFormSelectFields];

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Budget Line Item Dialog tests", () => {
	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled<IBudgetTrackingLineitemForm>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: dialog,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IBudgetTrackingLineitemForm>({
				inputFields: inputIds,
				reactElement: dialog,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IBudgetTrackingLineitemForm>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
