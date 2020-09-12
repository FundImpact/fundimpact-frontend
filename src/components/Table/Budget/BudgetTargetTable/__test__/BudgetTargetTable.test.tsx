import React from "react";
import { waitForElement, fireEvent } from "@testing-library/react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_GRANT_PERIODS_PROJECT_LIST,
	GET_PROJECT_BUDGET_TARGETS_COUNT,
	GET_PROJ_BUDGET_TRACINGS_COUNT,
	GET_PROJECT_BUDGET_TARCKING,
} from "../../../../../graphql/Budget";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
} from "../../../../../graphql/Budget";
import { renderApollo } from "../../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockOrgHomeCurrency,
	mockDonors,
	mockOrgBudgetCategory,
	mockAnnualYearList,
	mockOrgBudgetTargetProject,
	mockGrantPeriodsProjectList,
	mockFinancialYears,
	mockBudgetTargetAmountSum,
	mockBudgetTargetCount,
	mockBudgetTrackingsCount,
	mockBudgetLineItem,
	mockCurrencyList,
} from "../../../../../utils/testMock.json";
import { GET_PROJ_DONORS } from "../../../../../graphql/project";
import {
	GET_ORG_CURRENCIES_BY_ORG,
	GET_ANNUAL_YEAR_LIST,
	GET_FINANCIAL_YEARS,
	GET_CURRENCY_LIST,
} from "../../../../../graphql";
import BudgetTargetTable from "..";
import { budgetTargetTableHeading, budgetLineItemTableHeading } from "../../../constants";
import { getTodaysDate } from "../../../../../utils";

let table: any;

const mocks = [
	{
		request: {
			query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
			variables: {
				filter: {
					budgetTargetsProject: "1",
				},
			},
		},
		result: {
			data: {
				projBudgetTrackingsTotalAmount: 10,
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
			query: GET_PROJ_BUDGET_TRACINGS_COUNT,
			variables: {
				filter: {
					budget_targets_project: "3",
				},
			},
		},
		result: {
			data: mockBudgetTrackingsCount,
		},
	},
	{
		request: {
			query: GET_PROJECT_BUDGET_TARCKING,
			variables: {
				filter: {
					budget_targets_project: "3",
				},
				limit: 10,
				start: 0,
				sort: "created_at:DESC",
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
			query: GET_PROJ_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projectDonors: mockDonors,
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
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project: 3,
				},
				limit: 10,
				start: 0,
				sort: "created_at:DESC",
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
			query: GET_PROJECT_BUDGET_TARGETS_COUNT,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: mockBudgetTargetCount,
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
		result: {
			data: mockBudgetTargetAmountSum,
		},
	},
];

beforeEach(() => {
	act(() => {
		table = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<BudgetTargetTable />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Budget Target Table tests", () => {
	budgetTargetTableHeading[5].label += `(${mockCurrencyList[0].code})`;
	for (let i = 0; i < budgetTargetTableHeading.length; i++) {
		test(`Table Headings ${budgetTargetTableHeading[i].label} for Budget Target Table`, async () => {
			await waitForElement(() => table.getAllByText(budgetTargetTableHeading[i].label));
		});
	}
	test("renders correctly", async () => {
		await waitForElement(() =>
			table.getByText(new RegExp(mockOrgBudgetTargetProject[0].name, "i"))
		);
		await waitForElement(() =>
			table.getByText(new RegExp(mockOrgBudgetTargetProject[0].donor.name, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + mockOrgBudgetTargetProject[0].total_target_amount, "i")
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp(mockOrgBudgetTargetProject[0].budget_category_organization.name, "i")
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + mockBudgetTargetAmountSum.projBudgetTrackingsTotalAmount, "i")
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp(
					"" +
						(
							(mockBudgetTargetAmountSum.projBudgetTrackingsTotalAmount /
								mockOrgBudgetTargetProject[0].total_target_amount) *
							100
						).toFixed(2),
					"i"
				)
			)
		);
	});

	test("Table Headings and Data listing of Budget trackline table", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		budgetLineItemTableHeading[3].label += `(${mockOrgHomeCurrency[0].currency.code})`;

		for (let i = 0; i < budgetLineItemTableHeading.length; i++) {
			await waitForElement(() => table.findAllByText(budgetLineItemTableHeading[i].label));
		}

		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + mockBudgetLineItem[0].grant_periods_project.name, "i")
			)
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockBudgetLineItem[0].fy_org.name, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockBudgetLineItem[0].fy_donor.name, "i"))
		);
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockBudgetLineItem[0].note, "i"))
		);
		await waitForElement(() =>
			table.getByText(
				new RegExp("" + getTodaysDate(mockBudgetLineItem[0].reporting_date, true), "i")
			)
		);
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockBudgetLineItem[0].amount, "i"))
		);
	});
});
