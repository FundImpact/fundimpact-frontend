import React from "react";
import { waitForElement } from "@testing-library/react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import {
	GET_BUDGET_TARGET_PROJECT,
} from "../../../../../graphql/queries/budget";
import { GET_PROJECT_BUDGET_TARCKING } from "../../../../../graphql/queries/budget/query";
import { renderApollo } from "../../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import { projectDetails, organizationDetails } from "../../../../../utils/testMock.json";
import { GET_ORG_CURRENCIES_BY_ORG, GET_ANNUAL_YEAR_LIST } from "../../../../../graphql/queries";
import BudgetLineItemTable from "../BudgetLineItemTable";

let table: any;

const mockOrgHomeCurrency = [{ currency: { code: "INR" } }];

const mockAnnualYearList = [
	{
		id: "ay",
		name: "year 1",
		short_name: "sh1",
		start_date: "2020-03-03",
		end_date: "2020-04-04",
	},
];


const mockBudgetLineItem = [
	{
		id: "1",
		budget_targets_project: {
			id: "1",
			name: "budget target 1",
		},
		amount: 500,
		note: "note 1",
		reporting_date: new Date(),
		annual_year: {
			id: "1",
		},
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
				projectBudgetTargets: mockBudgetTarget,
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
