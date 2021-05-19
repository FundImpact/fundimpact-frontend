import React from "react";
import { waitForElement, fireEvent, RenderResult, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	projectDonorMock,
	mockFundReceiptProjectList,
	fundReceiptProjectListCount,
	mockCountryList,
	mockCurrencyList,
} from "../../../../utils/testMock.json";
import { GET_PROJECT_DONORS, GET_COUNTRY_LIST, GET_CURRENCY_LIST } from "../../../../graphql";
import FundReceivedTable from "../FundReceivedTableGraphql";
import { fundReceivedTableHeadings } from "../../constants";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import {
	GET_FUND_RECEIPT_PROJECT_LIST,
	GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
} from "../../../../graphql/FundRecevied";
import { getTodaysDate } from "../../../../utils";
import { fundReceiptInputFields } from "../inputFields.json";
import { GET_PROJ_DONORS } from "../../../../graphql/project";
import { GET_ORG_DONOR } from "../../../../graphql/donor";

let table: RenderResult;

let intialFormValue = {
	amount: "100",
	reporting_date: getTodaysDate(),
	project_donor: "18",
};

let mockProjectDonors = [
	{
		id: "18",
		donor: { id: "1", name: "donor 1", deleted: false },
		project: { id: "3", name: "my project" },
		deleted: false,
	},
	{
		id: "2",
		donor: { id: "2", name: "donor 2", deleted: false },
		project: { id: "3", name: "my project" },
		deleted: false,
	},
];

let mockOrganizationDonor = [
	{
		id: "20",
		name: "vikram pathak",
		country: {
			id: "1",
			name: "India",
		},
		legal_name: "vikram legal 001",
		short_name: "vikram short 100",
		deleted: false,
	},
];

const mocks = [
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
			query: GET_PROJECT_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projDonors: projectDonorMock,
			},
		},
	},
	{
		request: {
			query: GET_FUND_RECEIPT_PROJECT_LIST,
			variables: {
				filter: {
					project: projectDetails.id,
				},
				limit: fundReceiptProjectListCount,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: {
			data: {
				fundReceiptProjectList: mockFundReceiptProjectList,
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
			query: GET_ORG_DONOR,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: {
				orgDonors: mockOrganizationDonor,
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
			query: GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
			variables: {
				filter: {
					project: projectDetails.id,
				},
			},
		},
		result: {
			data: {
				fundReceiptProjectListCount,
			},
		},
	},
];

beforeEach(async () => {
	table = renderApollo(
		<DashboardProvider
			defaultState={{ project: projectDetails, organization: organizationDetails }}
		>
			<NotificationProvider>
				<FundReceivedTable />
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

describe("Fund Received Table tests", () => {
	fundReceivedTableHeadings[2].label += `(${mockCurrencyList[0].code})`;

	for (let i = 0; i < fundReceivedTableHeadings.length; i++) {
		test(`Table Headings ${fundReceivedTableHeadings[i].label} for Fund Received Table`, async () => {
			await waitForElement(() => table.getAllByText(fundReceivedTableHeadings[i].label));
		});
	}

	for (let i = 0; i < mockFundReceiptProjectList.length; i++) {
		test("renders correctly", async () => {
			await waitForElement(() =>
				table.getByText(new RegExp("" + mockFundReceiptProjectList[i].amount, "i"))
			);

			await waitForElement(() =>
				table.getByText(
					new RegExp(
						"" + getTodaysDate(mockFundReceiptProjectList[i].reporting_date, true),
						"i"
					)
				)
			);
			await waitForElement(() =>
				table.getAllByText(
					new RegExp("" + mockFundReceiptProjectList[i].project_donor.donor.name, "i")
				)
			);
		});
	}

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

		let amountField = (await table.findByTestId(
			"createFundReceiptAmountFilterInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(amountField, { target: { value: intialFormValue.amount } });
		});
		await expect(amountField.value).toBe(intialFormValue.amount);

		let dateField = (await table.findByTestId(
			"createReporingDateFilterInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(dateField, {
				target: { value: intialFormValue.reporting_date },
			});
		});
		await expect(dateField.value).toBe(intialFormValue.reporting_date);
	});
});
