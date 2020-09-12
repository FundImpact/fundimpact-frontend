import React from "react";
import { waitForElement } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_PROJECT_BUDGET_TARCKING,
	GET_GRANT_PERIODS_PROJECT_LIST,
	GET_PROJ_BUDGET_TRACINGS_COUNT,
	GET_ORG_BUDGET_CATEGORY_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_BUDGET_CATEGORY_PROJECT_COUNT,
} from "../../../../graphql/Budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockAnnualYearList,
	mockOrgHomeCurrency,
	mockOrgBudgetTargetProject,
	mockBudgetLineItem,
	mockGrantPeriodsProjectList,
	mockFinancialYears,
	mockBudgetTrackingsCount,
	mockOrgBudgetCategory,
} from "../../../../utils/testMock.json";
import {
	GET_ORG_CURRENCIES_BY_ORG,
	GET_ANNUAL_YEAR_LIST,
	GET_FINANCIAL_YEARS,
} from "../../../../graphql";
import BudgetCategoryTable from "../BudgetCategoryTable";
import { budgetCategoryHeading } from "../../constants";

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
				financialYearList: mockFinancialYears,
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
	{
		request: {
			query: GET_ORG_BUDGET_CATEGORY_COUNT,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: { orgBudgetCategoryCount: mockOrgBudgetCategory.length },
		},
	},
	{
		request: {
			query: GET_BUDGET_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					budget_category_organization: "1",
				},
			},
		},
		result: {
			data: { projectCountBudgetCatByOrg: [{ project_count: 1 }] },
		},
	},
	{
		request: {
			query: GET_BUDGET_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					budget_category_organization: "2",
				},
			},
		},
		result: {
			data: { projectCountBudgetCatByOrg: [{ project_count: 1 }] },
		},
	},
	{
		request: {
			query: GET_ORGANIZATION_BUDGET_CATEGORY,
			variables: {
				filter: {
					organization: "3",
				},
				limit: mockOrgBudgetCategory.length,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: {
			data: { orgBudgetCategory: mockOrgBudgetCategory },
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
					<BudgetCategoryTable />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Budget Category Table tests", () => {
	for (let i = 0; i < budgetCategoryHeading.length; i++) {
		test(`Table Headings ${budgetCategoryHeading[i].label} for Budget Category Table`, async () => {
			await waitForElement(() => table.getAllByText(budgetCategoryHeading[i].label));
		});
	}

	for (let i = 0; i < mockOrgBudgetCategory.length; i++) {
		test("renders correctly", async () => {
			await waitForElement(() =>
				table.getByText(new RegExp("" + mockOrgBudgetCategory[i].code, "i"))
			);

			await waitForElement(() =>
				table.getByText(new RegExp("" + mockOrgBudgetCategory[i].description, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp("" + mockOrgBudgetCategory[i].name, "i"))
			);
		});
	}
});
