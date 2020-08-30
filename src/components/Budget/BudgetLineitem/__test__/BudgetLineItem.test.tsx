import React from "react";
import BudgetLineitem from "../BudgetLineItem";
import { fireEvent, wait } from "@testing-library/react";
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
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../../../models/budget/constants";
import { budgetLineItemInputFields } from "../../../../utils/inputTestFields.json";
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
				financialYears: mockFinancialYears,
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
				financialYears: mockFinancialYears,
			},
		},
	},
	{
		request: {
			query: GET_GRANT_PERIODS_PROJECT_LIST,
			variables: {
				filter: {
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

const inputIds = budgetLineItemInputFields;

describe("Budget Line Item Dialog tests", () => {
	test("Mock response", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].id)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].key];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			await expect(fieldName.value).toBe(value);
		}

		await act(async () => {
			let saveButton = await dialog.getByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
			fireEvent.click(saveButton);
			await wait();
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));
		expect(creationOccured).toBe(true);
	});
});
