import React from "react";
import { waitForElement } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockAddressListCount,
	mockAddressList,
} from "../../../../utils/testMock.json";
import { addressTableHeadings } from "../../constants";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import AddressTable from "../AddressTableGraphql";
import { Enitity } from "../../../../models/constants";
import { GET_ADDRESS_LIST_COUNT, GET_ADDRESS_LIST } from "../../../../graphql/Address";

let table: any;

const t_4_d_contact = "1";

const mocks = [
	{
		request: {
			query: GET_ADDRESS_LIST_COUNT,
			variables: {
				filter: {
					t_4_d_contact,
				},
			},
		},
		result: {
			data: mockAddressListCount,
		},
	},
	{
		request: {
			query: GET_ADDRESS_LIST,
			variables: {
				filter: {
					t_4_d_contact,
				},
				limit: mockAddressListCount.t4DAddressesConnection.aggregate.count,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: {
			data: {
				t4DAddresses: mockAddressList,
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
];

beforeEach(() => {
	act(() => {
		table = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<AddressTable contactId={t_4_d_contact} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Address Table tests", () => {
	for (let i = 0; i < addressTableHeadings.length; i++) {
		test(`Table Headings ${addressTableHeadings[i].label} for Address Target Table`, async () => {
			await waitForElement(() => table.getAllByText(addressTableHeadings[i].label));
		});
	}

	test("renders correctly", async () => {
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockAddressList[0].address_type, "i"))
		);

		await waitForElement(() =>
			table.getByText(new RegExp("" + mockAddressList[0].address_line_1, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockAddressList[0].address_line_2, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockAddressList[0].city, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockAddressList[0].pincode, "i"))
		);
	});
});
