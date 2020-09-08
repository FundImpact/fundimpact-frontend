import React from "react";
import { waitForElement } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { GET_DONOR_COUNT, GET_ORG_DONOR } from "../../../../graphql/donor";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockOrgDonor,
	mockCountryList,
} from "../../../../utils/testMock.json";
import { GET_COUNTRY_LIST } from "../../../../graphql";
import DonorTable from "../DonorTable";
import { donorTableHeading } from "../../constants";

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
			query: GET_COUNTRY_LIST,
		},
		result: {
			data: {
				countryList: mockCountryList,
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
					<DonorTable />
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
