import React from "react";
import { GET_ORGANIZATION_REGISTRATION_TYPES, GET_COUNTRY_LIST } from "../../../../graphql";
import {
	organizationDetails,
	projectDetails,
	mockOrganizationRegistrationTypes,
	mockCountryList,
} from "../../../../utils/testMock.json";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../../utils/test.util";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { fireEvent, wait } from "@testing-library/dom";
import Organization from "../index";
import { UPDATE_ORGANIZATION } from "../../../../graphql/mutation";
import { organizationUpdateForm as organizationFormInputFields } from "../../../../utils/inputTestFields.json";
import { IOrganisationForm } from "../../../../models/organisation/types";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";

let organizationUpdateForm: any;
let creationOccured = false;

const intialFormValue: IOrganisationForm = {
	organization_registration_type: organizationDetails.organization_registration_type.id,
	country: organizationDetails.country.id,
	name: organizationDetails.name,
	legal_name: organizationDetails.legal_name,
	short_name: organizationDetails.short_name,
	logo: "",
};

const newFormValues = {
	organization_registration_type: organizationDetails.organization_registration_type.id,
	country: "2",
	name: "my new org",
	legal_name: "org legal name",
	short_name: "org short name",
	primaryColor: "#5567FF",
	secondaryColor: "#14BB4C",
};

const formValues = {
	organization_registration_type: organizationDetails.organization_registration_type.id,
	country: "2",
	name: "my new org",
	legal_name: "org legal name",
	short_name: "org short name",
	primaryColor: "#5567FF",
	secondaryColor: "#14BB4C",
};

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
			query: GET_ORGANIZATION_REGISTRATION_TYPES,
		},
		result: {
			data: {
				organizationRegistrationTypes: mockOrganizationRegistrationTypes,
			},
		},
	},
	{
		request: {
			query: UPDATE_ORGANIZATION,
			variables: {
				id: "3",
				input: {
					organization_registration_type:
						organizationDetails.organization_registration_type.id,
					name: "my new org",
					legal_name: "org legal name",
					short_name: "org short name",
					country: "2",
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {};
		},
	},
];

beforeEach(() => {
	act(() => {
		organizationUpdateForm = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<Organization />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Organization Update Form tests", () => {
	for (let i = 0; i < organizationFormInputFields.length; i++) {
		test(`test to check ${organizationFormInputFields[i].id} is present on screen`, async () => {
			expect(
				await organizationUpdateForm.findByTestId(organizationFormInputFields[i].id)
			).toBeTruthy();
		});
	}

	for (let i = 0; i < organizationFormInputFields.length; i++) {
		test(`test to check ${organizationFormInputFields[i].id} has correct initial value`, async () => {
			let field = await organizationUpdateForm.findByTestId(
				organizationFormInputFields[i].id
			);
			expect(field.value).toBe(intialFormValue[organizationFormInputFields[i].name]);
		});
	}

	for (let i = 0; i < organizationFormInputFields.length; i++) {
		test(`test to check ${organizationFormInputFields[i].id} has correct new value`, async () => {
			let field = await organizationUpdateForm.findByTestId(
				organizationFormInputFields[i].id
			);
			await act(async () => {
				await fireEvent.change(field, {
					target: { value: newFormValues[organizationFormInputFields[i].name] },
				});
			});
			expect(field.value).toBe(newFormValues[organizationFormInputFields[i].name]);
		});
	}

	for (let i = 0; i < organizationFormInputFields.length; i++) {
		test(`test to check submit button is disabled when ${organizationFormInputFields[i].id} is empty`, async () => {
			let field = await organizationUpdateForm.findByTestId(
				organizationFormInputFields[i].id
			);
			await act(async () => {
				await fireEvent.change(field, {
					target: { value: "" },
				});
			});
			let saveButton = await organizationUpdateForm.getByTestId("createSaveButton");
			expect(saveButton).not.toBeEnabled();
		});
	}

	// test(`test to check submit button is enabled`, async () => {
	// 	for (let i = 0; i < organizationFormInputFields.length; i++) {
	// 		let field = await organizationUpdateForm.findByTestId(
	// 			organizationFormInputFields[i].id
	// 		);
	// 		await act(async () => {
	// 			await fireEvent.change(field, {
	// 				target: { value: formValues[organizationFormInputFields[i].name] },
	// 			});
	// 		});
	// 	}
	// 	let saveButton = await organizationUpdateForm.getByTestId("createSaveButton");
	// 	expect(saveButton).toBeEnabled();
	// });

	// test("Mock response", async () => {
	// 	for (let i = 0; i < organizationFormInputFields.length; i++) {
	// 		let field = await organizationUpdateForm.findByTestId(
	// 			organizationFormInputFields[i].id
	// 		);
	// 		await act(async () => {
	// 			await fireEvent.change(field, {
	// 				target: { value: newFormValues[organizationFormInputFields[i].name] },
	// 			});
	// 		});
	// 	}

	// 	let saveButton = await organizationUpdateForm.getByTestId("createSaveButton");
	// 	expect(saveButton).toBeEnabled();
	// 	await act(async () => {
	// 		let saveButton = await organizationUpdateForm.getByTestId("createSaveButton");
	// 		fireEvent.click(saveButton);
	// 		await wait();
	// 	});
	// 	await new Promise((resolve) => setTimeout(resolve, 1000));
	// 	expect(creationOccured).toBe(true);
	// });
});
