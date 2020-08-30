import React from "react";
import { waitForElement } from "@testing-library/react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_GRANT_PERIODS_PROJECT_LIST,
	GET_PROJECT_BUDGET_TARGETS_COUNT,
} from "../../../../../graphql/Budget";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
} from "../../../../../graphql/Budget";
// import {GET_} from '../../../../../graphql';
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
} from "../../../../../utils/testMock.json";
import { GET_PROJ_DONORS } from "../../../../../graphql/project";
import {
	GET_ORG_CURRENCIES_BY_ORG,
	GET_ANNUAL_YEAR_LIST,
	GET_FINANCIAL_YEARS,
} from "../../../../../graphql";
import BudgetTargetTable from "..";

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
				financialYears: mockFinancialYears,
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
	test("renders correctly", async () => {
		await waitForElement(() => table.getByText(/target1/i));
		await waitForElement(() => table.getByText(/water supply/i));
		await waitForElement(() => table.getByText(/donor 1/i));
	});
});