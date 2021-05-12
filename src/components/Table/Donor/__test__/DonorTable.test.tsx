import React from "react";
import { waitForElement } from "@testing-library/react";
import { wait } from "@testing-library/dom";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { GET_DONOR_COUNT, GET_ORG_DONOR } from "../../../../graphql/donor";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockOrgDonor,
	mockCountryList,
	mockCurrencyList,
} from "../../../../utils/testMock.json";
import { GET_COUNTRY_LIST, GET_CURRENCY_LIST } from "../../../../graphql";
import DonorTable from "../DonorTable";
import { donorTableHeading } from "../../constants";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";

let table: any;

const mocks = [
	{
		request: {
			query: GET_DONOR_COUNT,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: {
				orgDonorsCount: 10,
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
				limit: 10,
				start: 0,
				sort: "created_at:DESC",
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
			query: GET_CURRENCY_LIST,
		},
		result: {
			data: {
				currencyList: mockCurrencyList,
			},
		},
	},
	{
		request: {
			query: GET_COUNTRY_LIST,
		},
		result: {
			data: {
				countryList: mockCountryList,
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
				<DonorTable />
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

describe("Donor Table tests", () => {
	for (let i = 0; i < donorTableHeading.length; i++) {
		test(`Table Headings ${donorTableHeading[i].label} for Budget Target Table`, async () => {
			await waitForElement(() => table.getAllByText(donorTableHeading[i].label));
		});
	}

	test("renders correctly", async () => {
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockOrgDonor[0].country.name, "i"))
		);

		await waitForElement(() =>
			table.getByText(new RegExp("" + mockOrgDonor[0].legal_name, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockOrgDonor[0].short_name, "i"))
		);
		await waitForElement(() => table.getAllByText(new RegExp("" + mockOrgDonor[0].name, "i")));
	});
});
