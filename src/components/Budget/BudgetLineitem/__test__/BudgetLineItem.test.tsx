import React from "react";
import BudgetLineitem from "../BudgetLineItem";
import "@testing-library/jest-dom/extend-expect";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { CREATE_PROJECT_BUDGET_TRACKING } from "../../../../graphql/Budget/mutation";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_GRANT_PERIODS_PROJECT_LIST,
	GET_PROJECT_BUDGET_TARCKING,
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
} from "../../../../graphql/Budget";
import {
	GET_ANNUAL_YEAR_LIST,
	GET_ORG_CURRENCIES_BY_ORG,
	GET_FINANCIAL_YEARS,
	GET_CURRENCY_LIST,
	GET_COUNTRY_LIST,
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
	mockCurrencyList,
	mockCountryList,
	mockOrgBudgetCategory,
	mockProjectDonors,
	mockOrgDonor,
} from "../../../../utils/testMock.json";
import { getTodaysDate } from "../../../../utils";
import { IBudgetTrackingLineitemForm } from "../../../../models/budget/budgetForm";
import { act } from "react-dom/test-utils";
import { budgetLineitemFormInputFields } from "../inputFields.json";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { fireEvent, wait } from "@testing-library/dom";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import { mockBudgetLineItem } from "../../../../utils/testMock.json";
import { GET_PROJECT_AMOUNT_SPEND, GET_PROJ_DONORS } from "../../../../graphql/project";
import { GET_ORG_DONOR } from "../../../../graphql/donor";
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
			query: GET_USER_ROLES,
			variables: {
				filter: {
					role: "1",
				},
			},
		},
		result: { data: mockUserRoles },
	},
	{
		request: {
			query: GET_ORG_DONOR,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: {
				orgDonors: mockOrgDonor,
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
			query: GET_PROJ_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projectDonors: mockProjectDonors,
			},
		},
	},
	{
		request: {
			query: GET_COUNTRY_LIST,
		},
		result: {
			data: {
				countries: mockCountryList,
			},
		},
	},
	{
		request: {
			query: GET_ORGANIZATION_BUDGET_CATEGORY,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: {
				orgBudgetCategory: mockOrgBudgetCategory,
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
			query: GET_PROJECT_BUDGET_TARCKING,
			variables: {
				filter: {
					budget_targets_project: "",
				},
			},
		},
		result: {
			data: {
				projBudgetTrackings: mockBudgetLineItem,
			},
		},
	},
	{
		request: {
			query: GET_PROJECT_BUDGET_TARCKING,
			variables: {
				filter: {
					budget_targets_project: "3",
				},
			},
		},
		result: {
			data: {
				projBudgetTrackings: mockBudgetLineItem,
			},
		},
	},
	{
		request: {
			query: GET_PROJECT_BUDGET_TARCKING,
			variables: {
				filter: {
					budget_targets_project: "3",
				},
			},
		},
		result: {
			data: {
				projBudgetTrackings: mockBudgetLineItem,
			},
			refetch: () => {},
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
			query: GET_CURRENCY_LIST,
			variables: {
				filter: {
					country: "1",
				},
			},
		},
		result: {
			data: {
				currencyList: mockCurrencyList,
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
			query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
			variables: {
				filter: {
					budgetTargetsProject: "3",
				},
			},
		},
		result: { data: { projBudgetTrackingsTotalAmount: 10 } },
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
						id: "1",
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
	{
		request: {
			query: GET_PROJECT_AMOUNT_SPEND,
			variables: { filter: { project: 3 } },
		},
		result: { data: { projBudgetTrackingsTotalSpendAmount: 0 } },
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

const inputIds = [...budgetLineitemFormInputFields];
//remove attach file element
inputIds.pop();
//removing the last filed which is grant period
let inputFieldsWithRemovedGrantPeriod = [...inputIds];
inputFieldsWithRemovedGrantPeriod.splice(7, 1);

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

	test("running test to check value of grant period is equal to value provided", async () => {
		let budgetTargetField = (await dialog.findByTestId(
			"createBudgetLineitemBudgetTargetsOption"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(budgetTargetField, {
				target: { value: intialFormValue.budget_targets_project },
			});
		});
		await expect(budgetTargetField.value).toBe(intialFormValue.budget_targets_project);
		let grantPeriodField = (await dialog.findByTestId(
			"createBudgetLineitemGrantPeriodProjectOption"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(grantPeriodField, {
				target: { value: intialFormValue.grant_periods_project },
			});
		});
		await expect(grantPeriodField.value).toBe(intialFormValue.grant_periods_project);
	});

	//Inorder to check value of grant period we have to provide value of budgetTarget
	for (let i = 0; i < inputFieldsWithRemovedGrantPeriod.length; i++) {
		test(`running test for ${inputFieldsWithRemovedGrantPeriod[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputFieldsWithRemovedGrantPeriod[i],
				reactElement: dialog,
				value: intialFormValue[inputFieldsWithRemovedGrantPeriod[i].name],
			});
		});
	}

	//grantPeriod is not required hence not running required test for grantPeriod
	for (let i = 0; i < inputFieldsWithRemovedGrantPeriod.length; i++) {
		test(`Required Field test for ${inputFieldsWithRemovedGrantPeriod[i].name}`, async () => {
			await requiredFieldTestForInputElement<IBudgetTrackingLineitemForm>({
				inputFields: inputFieldsWithRemovedGrantPeriod,
				reactElement: dialog,
				intialFormValue,
				inputElement: inputFieldsWithRemovedGrantPeriod[i],
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
