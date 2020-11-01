import React from "react";
import { waitForElement, fireEvent } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
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
import { Enitity } from "../../../../models/constants";
import { GET_CONTACT_LIST_COUNT, GET_CONTACT_LIST } from "../../../../graphql/Contact";
import { IContactForm } from "../../../../models/contact";

let table: any;

const intialFormValue: IContactForm = {
	contact_type: "PERSONAL",
	email: "educationOrg@gmail.com",
	email_other: "educationOrgDelhi@gmail.com",
	phone: "9999999999",
	phone_other: "8888888888",
};

const mocks = [
	{
		request: {
			query: GET_CONTACT_LIST_COUNT,
			variables: {
				filter: {
					entity_id: organizationDetails.id,
					entity_name: Enitity.organization,
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
					entity_name: Enitity.organization,
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
					<ContactTable
						entity_id={organizationDetails.id}
						entity_name={Enitity.organization}
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
	for (let i = 0; i < contactTableHeadings.length; i++) {
		test(`Table Headings ${contactTableHeadings[i].label} for Contact Target Table`, async () => {
			await waitForElement(() => table.getAllByText(contactTableHeadings[i].label));
		});
	}

	test("renders correctly", async () => {
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockContactList[0].contact_type, "i"))
		);

		await waitForElement(() => table.getByText(new RegExp("" + mockContactList[0].email, "i")));
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].email_other, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].phone_other, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + mockContactList[0].phone, "i"))
		);
	});

	test("Filter List test", async () => {
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

	test("Filter List Input Elements test", async () => {
		let buttonElement = await table.findByTestId(`filter-button`);
		expect(buttonElement).toBeInTheDocument();
		act(() => {
			fireEvent.click(buttonElement);
		});

		let emailField = (await table.findByTestId("createEmailInput")) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(emailField, { target: { value: intialFormValue.email } });
		});
		await expect(emailField.value).toBe(intialFormValue.email);

		let emailOtherField = (await table.findByTestId(
			"createEmailOtherInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(emailOtherField, {
				target: { value: intialFormValue.email_other },
			});
		});
		await expect(emailOtherField.value).toBe(intialFormValue.email_other);

		let phoneField = (await table.findByTestId("createPhoneInput")) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(phoneField, { target: { value: intialFormValue.phone } });
		});
		await expect(phoneField.value).toBe(intialFormValue.phone);

		let phoneOtherField = (await table.findByTestId(
			"createPhoneOtherInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(phoneOtherField, {
				target: { value: intialFormValue.phone_other },
			});
		});
		await expect(phoneOtherField.value).toBe(intialFormValue.phone_other);
	});
});
