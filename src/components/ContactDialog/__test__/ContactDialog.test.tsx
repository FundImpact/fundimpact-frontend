import React from "react";
import { fireEvent, wait, RenderResult } from "@testing-library/react";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { renderApollo } from "../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetails } from "../../../utils/testMock.json";
import { commonFormTestUtil } from "../../../utils/commonFormTest.util";
import { Entity_Name, FORM_ACTIONS } from "../../../models/constants";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import ContactForm from "..";
import { CREATE_CONTACT } from "../../../graphql/Contact/mutation";
import { GET_CONTACT_LIST } from "../../../graphql/Contact";
import { mockContactList } from "../../../utils/testMock.json";

let contactForm: RenderResult;
let creationOccured = false;

const handleClose = jest.fn();

const intialFormValue = {
	label: "sherlock",
	emailValue: "sher@locked.com",
	emailLabel: "famous detective email",
	phoneValue: "9999999999",
	phoneLabel: "famous detective phone",
	address_line_1: "221 baker street",
	address_line_2: "221 baker street england",
	pincode: "112233",
	city: "London",
	contact_type: "PERSONAL",
};

let inputIds = [
	{ testId: "createLabelInput", name: "label", required: true },
	{ testId: "createEmailValueInput", name: "emailValue", required: true },
	{ testId: "createEmailLabelInput", name: "emailLabel", required: false },
	{ testId: "createPhoneValueInput", name: "phoneValue", required: true },
	{ testId: "createPhoneLabelInput", name: "phoneLabel", required: false },
	{ testId: "createAddressesAddressLine1Input", name: "address_line_1", required: false },
	{ testId: "createAddressesAddressLine2Input", name: "address_line_2", required: false },
	{ testId: "createAddressesPincodeInput", name: "pincode", required: false },
	{ testId: "createAddressesCityInput", name: "city", required: false },
	{ testId: "createContactTypeSelectField", name: "contact_type", required: true },
];

let orgDetails = organizationDetails;

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
			query: GET_CONTACT_LIST,
			variables: {
				filter: {
					entity_id: organizationDetails.id,
					entity_name: Entity_Name.organization,
				},
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
			query: CREATE_CONTACT,
			variables: {
				input: {
					data: {
						emails: [
							{
								label: intialFormValue.emailLabel,
								value: intialFormValue.emailValue,
							},
						],
						phone_numbers: [
							{
								label: intialFormValue.phoneLabel,
								value: intialFormValue.phoneValue,
							},
						],
						addresses: [
							{
								address_line_1: intialFormValue.address_line_1,
								address_line_2: intialFormValue.address_line_2,
								pincode: intialFormValue.pincode,
								city: intialFormValue.city,
							},
						],
						contact_type: intialFormValue.contact_type,
						entity_name: Entity_Name.organization,
						entity_id: orgDetails.id,
						label: intialFormValue.label,
					},
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createT4DContact: {
						t4DContact: {
							id: "1",
							emails: [
								{
									label: intialFormValue.emailLabel,
									value: intialFormValue.emailValue,
								},
							],
							phone_numbers: [
								{
									label: intialFormValue.phoneLabel,
									value: intialFormValue.phoneValue,
								},
							],
							addresses: [
								{
									address_line_1: intialFormValue.address_line_1,
									address_line_2: intialFormValue.address_line_2,
									pincode: intialFormValue.pincode,
									city: intialFormValue.city,
								},
							],
							contact_type: intialFormValue.contact_type,
							label: intialFormValue.label,
						},
					},
				},
			};
		},
	},
];

beforeEach(() => {
	act(() => {
		contactForm = renderApollo(
			<DashboardProvider defaultState={{ organization: orgDetails }}>
				<NotificationProvider>
					<ContactForm
						entity_name={Entity_Name.organization}
						entity_id={orgDetails.id}
						formAction={FORM_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
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

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Contact tests", () => {
	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: contactForm,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement({
				inputFields: inputIds,
				reactElement: contactForm,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	test("Mock response", async () => {
		await checkSubmitButtonIsEnabled({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});

		await act(async () => {
			let form = await contactForm.getByTestId("contact-form");
			fireEvent.submit(form);
		});
		await wait();
		expect(creationOccured).toBe(true);
	});
});
