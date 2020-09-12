import React from "react";
import {
	GET_ORG_CURRENCIES_BY_ORG,
	GET_CURRENCY_LIST,
	GET_ORGANIZATION_REGISTRATION_TYPES,
	GET_COUNTRY_LIST,
} from "../../../../graphql";
import { GET_ORGANIZATION_BUDGET_CATEGORY } from "../../../../graphql/Budget";
import { CREATE_PROJECT_BUDGET_TARGET } from "../../../../graphql/Budget/mutation";
import { GET_PROJ_DONORS } from "../../../../graphql/project";
import {
	organizationDetails,
	projectDetails,
	mockCurrencyList,
	mockOrganizationRegistrationTypes,
	mockCountryList,
} from "../../../../utils/testMock.json";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../../utils/test.util";
import BudgetTarget from "../BudgetTarget";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { FORM_ACTIONS } from "../../../../models/constants";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { IBudgetTargetForm } from "../../../../models/budget/budgetForm";
import { fireEvent, wait } from "@testing-library/dom";
import Organization from "../index";
import { UPDATE_ORGANIZATION } from "../../../../graphql/mutation";
import { organizationFormInputFields } from "../inputFields.json";

const handleClose = jest.fn();

let organizationUpdateForm: any;
let creationOccured = false;

const intialFormValue: IBudgetTargetForm = {
	organization_registration_type: "1",
	country: "1",
	name: "my org",
	legal_name: "sh legal detective",
	short_name: "sh homes",
};

const mockOrgHomeCurrency = [{ currency: { code: "INR" } }];

const mockDonors = [
	{ id: "1", donor: { id: "1", name: "donor 1" } },
	{ id: "2", donor: { id: "2", name: "donor 2" } },
];

const mockOrgBudgetCategory = [
	{ id: "1", name: "military 1", code: "m5" },
	{ id: "2", name: "military 2", code: "m6" },
];

const mocks = [
	{
		request: {
			query: GET_ORGANIZATION_BUDGET_CATEGORY,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: {
				orgBudgetCategory: mockOrgBudgetCategory,
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
			query: GET_PROJ_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projectDonors: mockDonors,
			},
		},
	},
	{
		request: {
			query: GET_ORG_CURRENCIES_BY_ORG,
			variables: {
				filter: {
					organization: "3",
					isHomeCurrency: true,
				},
			},
		},
		result: {
			data: {
				orgCurrencies: mockOrgHomeCurrency,
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
					organization_registration_type: "",
					name: "",
					legal_name: "",
					short_name: "",
					country: "",
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

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Organization Update Form tests", () => {
	// test("Submit button enabled", async () => {
	// 	await checkSubmitButtonIsEnabled<IBudgetTargetForm>({
	// 		inputFields: inputIds,
	// 		reactElement: organizationUpdateForm,
	// 		intialFormValue,
	// 	});
	// });

	// for (let i = 0; i < inputIds.length; i++) {
	// 	test(`Required Field test for ${inputIds[i].name}`, async () => {
	// 		await requiredFieldTestForInputElement<IBudgetTargetForm>({
	// 			inputFields: inputIds,
	// 			reactElement: organizationUpdateForm,
	// 			intialFormValue,
	// 			inputElement: inputIds[i],
	// 		});
	// 	});
	// }

	const inputIds = [...organizationFormInputFields];
	inputIds.shift();

	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: organizationUpdateForm,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	test("check organization registration type has correct value", async () => {
		let fieldName = (await organizationUpdateForm.findByTestId(
			"createOrganizationRegistrationType"
    )) as HTMLInputElement;
    await wait();
    console.log('fieldName. :>> ', fieldName.value);
    // console.log('fieldName :>> ', fieldName);
		expect(fieldName.value).toBe(1);
	});

	// test("Mock response", async () => {
	// 	await triggerMutation<IBudgetTargetForm>({
	// 		inputFields: inputIds,
	// 		reactElement: organizationUpdateForm,
	// 		intialFormValue,
	// 	});
	// 	expect(creationOccured).toBe(true);
	// });
});
