import React from "react";
import { fireEvent, wait, RenderResult } from "@testing-library/react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import { organizationDetails } from "../../../../../utils/testMock.json";
import { addressFormFields } from "../inputFields.json";
import { commonFormTestUtil } from "../../../../../utils/commonFormTest.util";
import { FORM_ACTIONS } from "../../../../../models/constants";
import { mockUserRoles } from "../../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../../graphql/User/query";
import AddressForm from "..";
import { CREATE_ADDRESS } from "../../../../../graphql/Address/mutation";
import { IAddressForm } from "../../../../../models/address";

let contactForm: RenderResult;
let creationOccured = false;

const intialFormValue: IAddressForm = {
	address_line_1: "prashant vihar delhi",
	address_line_2: "pitampura delhi",
	address_type: "TEMPORARY",
	city: "Delhi",
	pincode: "118877",
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
			query: CREATE_ADDRESS,
			variables: {
				input: {
					data: {
						...intialFormValue,
						t_4_d_contact: "12",
					},
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createT4DAddress: {
						t4DAddress: {
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
					<AddressForm t_4_d_contact="12" formAction={FORM_ACTIONS.CREATE} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

let inputIds = addressFormFields;

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Address tests", () => {
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
		await checkSubmitButtonIsEnabled<IAddressForm>({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IAddressForm>({
				inputFields: inputIds,
				reactElement: contactForm,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IAddressForm>({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
