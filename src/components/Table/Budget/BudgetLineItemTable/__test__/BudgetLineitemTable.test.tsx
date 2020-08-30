import React from "react";
import { waitForElement } from "@testing-library/react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_PROJECT_BUDGET_TARCKING,
	GET_GRANT_PERIODS_PROJECT_LIST,
	GET_PROJ_BUDGET_TRACINGS_COUNT,
} from "../../../../../graphql/Budget";
import { renderApollo } from "../../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockAnnualYearList,
	mockOrgHomeCurrency,
	mockOrgBudgetTargetProject,
	mockBudgetLineItem,
	mockGrantPeriodsProjectList,
	mockFinancialYears,
	mockBudgetTrackingsCount
} from "../../../../../utils/testMock.json";
import {
	GET_ORG_CURRENCIES_BY_ORG,
	GET_ANNUAL_YEAR_LIST,
	GET_FINANCIAL_YEARS,
} from "../../../../../graphql";
import BudgetLineItemTable from "../BudgetLineItemTable";

let table: any;

mockBudgetLineItem.reporting_date = new Date();

const mocks = [
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
			query: GET_PROJECT_BUDGET_TARCKING,
			variables: {
				filter: {
					budget_targets_project: "1",
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
				financialYears: mockFinancialYears,
			},
		},
	},
	{
		request: {
			query: GET_PROJ_BUDGET_TRACINGS_COUNT,
			variables: {
				filter: {
					budget_targets_project: "1",
				},
			},
		},
		result: {
			data: mockBudgetTrackingsCount,
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
					<BudgetLineItemTable budgetTargetId="1" currency="INR" />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Budget Line Item Table tests", () => {
	test("renders correctly", async () => {
		await waitForElement(() => table.getByText(/500/i));
		await waitForElement(() => table.getByText(/note 1/i));
	});
});
