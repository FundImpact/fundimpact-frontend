import React from "react";
import { waitForElement, fireEvent } from "@testing-library/react";
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
	mockBudgetTrackingsCount,
	mockCurrencyList,
} from "../../../../../utils/testMock.json";
import {
	GET_ORG_CURRENCIES_BY_ORG,
	GET_ANNUAL_YEAR_LIST,
	GET_FINANCIAL_YEARS,
	GET_CURRENCY_LIST,
} from "../../../../../graphql";
import BudgetLineItemTable from "../BudgetLineItemTableGraphql";
import { budgetLineItemTableHeading } from "../../../constants";
import { getTodaysDate } from "../../../../../utils";

let table: any;

let intialFormValue = {
	name: "budget target name",
	amount: "100",
	reporting_date: getTodaysDate(),
};

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
	budgetLineItemTableHeading[3].label += `(${mockCurrencyList[0].code})`;
	for (let i = 0; i < budgetLineItemTableHeading.length; i++) {
		test(`Table Headings ${budgetLineItemTableHeading[i].label} for Budget Target Table`, async () => {
			await waitForElement(() => table.getAllByText(budgetLineItemTableHeading[i].label));
		});
	}

	test("renders correctly", async () => {
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockBudgetLineItem[0].amount, "i"))
		);

		await waitForElement(() =>
			table.getByText(new RegExp("" + mockBudgetLineItem[0].note, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockBudgetLineItem[0].fy_donor.name, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockBudgetLineItem[0].fy_org.name, "i"))
		);
		await waitForElement(() =>
			table.getByText(
				new RegExp("" + getTodaysDate(mockBudgetLineItem[0].reporting_date, true), "i")
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + mockBudgetLineItem[0].grant_periods_project.name, "i")
			)
		);
	});

	test("Filter List test", async () => {
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

	test("Filter List Input Elements test", async () => {
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(filterButton);
		});

		let nameField = (await table.findByTestId(
			"createBudgetTargetLineItemNameInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(nameField, { target: { value: intialFormValue.name } });
		});
		await expect(nameField.value).toBe(intialFormValue.name);

		let amountField = (await table.findByTestId(
			"createBudgetLineItemAmountInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(amountField, {
				target: { value: intialFormValue.amount },
			});
		});
		await expect(amountField.value).toBe(intialFormValue.amount);

		let dateField = (await table.findByTestId(
			"createReporingDateInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(dateField, {
				target: { value: intialFormValue.reporting_date },
			});
		});
		await expect(dateField.value).toBe(intialFormValue.reporting_date);
	});
});
