import React from "react";
import { GET_COUNTRY_LIST } from "../../../graphql";
import { organizationDetails, projectDetails } from "../../../utils/testMock.json";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { FORM_ACTIONS } from "../../../models/constants";
import Donor from "../Donor";
import { mockCountryList } from "../../../utils/testMock.json";
import { IDONOR } from "../../../models/donor/";
import { CREATE_ORG_DONOR } from "../../../graphql/donor/mutation";
import { addDonorForm, addDonorFormSelectFields } from "../inputField.json";
import { commonFormTestUtil } from "../../../utils/commonFormTest.util";
import { fireEvent, wait } from "@testing-library/dom";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const intialFormValue: IDONOR = {
	country: "1",
	legal_name: "legal name",
	name: "donor name",
	short_name: "donor short name",
};

const mocks = [
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
			query: CREATE_ORG_DONOR,
			variables: {
				input: {
					country: "1",
					legal_name: "legal name",
					name: "donor name",
					short_name: "donor short name",
					organization: "3",
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createOrgDonor: {
						id: "1",
					},
				},
			};
		},
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<Donor formAction={FORM_ACTIONS.CREATE} open={true} handleClose={handleClose} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

const inputIds = [...addDonorForm, ...addDonorFormSelectFields];

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Donor Dialog tests", () => {
	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled<IDONOR>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IDONOR>({
				inputFields: inputIds,
				reactElement: dialog,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to provided value`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: dialog,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IDONOR>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
