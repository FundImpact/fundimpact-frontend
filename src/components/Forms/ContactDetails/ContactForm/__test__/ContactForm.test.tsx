import React from "react";
import { fireEvent, wait, RenderResult } from "@testing-library/react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import { organizationDetails } from "../../../../../utils/testMock.json";
import { contactFormFields } from "../inputField.json";
import { commonFormTestUtil } from "../../../../../utils/commonFormTest.util";
import { FORM_ACTIONS, Enitity } from "../../../../../models/constants";
import { mockUserRoles } from "../../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../../graphql/User/query";
import { IContactForm } from "../../../../../models/contact";
import ContactForm from "..";
import { CREATE_CONTACT } from "../../../../../graphql/Contact/mutation";


let contactForm: RenderResult;
let creationOccured = false;

const intialFormValue: IContactForm = {
	contact_type: "PERSONAL",
	email: "educationOrg@gmail.com",
	email_other: "educationOrgDelhi@gmail.com",
	phone: "9999999999",
	phone_other: "8888888888",
};

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
			query: CREATE_CONTACT,
			variables: {
				input: {
					data: {
						...intialFormValue,
						entity_name: Enitity.organization,
						entity_id: orgDetails.id,
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
							...intialFormValue,
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
						entity_name={Enitity.organization}
						entity_id={orgDetails.id}
						formAction={FORM_ACTIONS.CREATE}
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

let inputIds = contactFormFields;

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
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
		await checkSubmitButtonIsEnabled<IContactForm>({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IContactForm>({
				inputFields: inputIds,
				reactElement: contactForm,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IContactForm>({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
