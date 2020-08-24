import React from "react";
import { waitForElement } from "@testing-library/react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_BUDGET_TARGET_PROJECT,
} from "../../../../../graphql/queries/budget";
import { GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM } from "../../../../../graphql/queries/budget/query";
import { renderApollo } from "../../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import { projectDetails, organizationDetails } from "../../../../../utils/testMock.json";
import { GET_PROJ_DONORS } from "../../../../../graphql/queries/project";
import { GET_ORG_CURRENCIES_BY_ORG, GET_ANNUAL_YEAR_LIST } from "../../../../../graphql/queries";
import BudgetTargetTable from "..";

let table: any;

const mockOrgHomeCurrency = [{ currency: { code: "INR" } }];

const mockDonors = [
	{ id: "1", donor: { id: "1", name: "donor 1" } },
	{ id: "2", donor: { id: "2", name: "donor 2" } },
];

const mockOrgBudgetCategory = [
	{ id: "1", name: "military 1", code: "m5" },
	{ id: "2", name: "military 2", code: "m6" },
];

const mockAnnualYearList = [
	{
		id: "ay",
		name: "year 1",
		short_name: "sh1",
		start_date: "2020-03-03",
		end_date: "2020-04-04",
	},
];

const mockBudgetTarget = [
	{
		id: "1",
		name: "Budget target 1",
		project: { id: 3, name: "my project" },
		budget_category_organization: { id: "1", name: "military 1", code: "m5" },
		description: "Description 1",
		total_target_amount: 100,
		donor: { name: "donor 1", id: "1" },
	},
];

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
			},
		},
		result: {
			data: {
				projectBudgetTargets: mockBudgetTarget,
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
		await waitForElement(() => table.getByText(/Budget target 1/i));
		await waitForElement(() => table.getByText(/100/i));
		await waitForElement(() => table.getByText(/military 1/i));
	});
});
