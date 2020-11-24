import React from "react";
import { waitForElement, fireEvent } from "@testing-library/react";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { renderApollo } from "../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockContactListCount,
	mockContactList,
} from "../../../../utils/testMock.json";
import { contactTableHeadings } from "../../constants";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import ContactTable from "../ContactTableGraphql";
import { GET_CONTACT_LIST_COUNT, GET_CONTACT_LIST } from "../../../../graphql/Contact";
import { IContactForm } from "../../../../models/contact";
import { Enitity_Name } from "../../../../models/constants";

let table: RenderResult;

const mocks = [
	{
		request: {
			query: GET_CONTACT_LIST_COUNT,
			variables: {
				filter: {
					entity_id: organizationDetails.id,
					entity_name: Enitity_Name.organization,
				},
			},
		},
		result: {
			data: mockContactListCount,
		},
	},
	{
		request: {
			query: GET_CONTACT_LIST,
			variables: {
				filter: {
					entity_id: organizationDetails.id,
					entity_name: Enitity_Name.organization,
				},
				limit: mockContactListCount.t4DContactsConnection.aggregate.count,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: {
			data: {
				t4DContacts: mockContactList,
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
					<ContactCardList
						entity_id={organizationDetails.id}
						entity_name={Enitity_Name.organization}
					/>
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Contact Table tests", () => {
	test("renders correctly", async () => {
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockContactList[0].emails[0].value, "i"))
		);
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockContactList[0].emails[0].label, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].phone_numbers[0].label, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].phone_numbers[0].value, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].addresses[0].address_line_1, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].addresses[0].address_line_2, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].addresses[0].city, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].addresses[0].pincode, "i"))
		);
	});
});
