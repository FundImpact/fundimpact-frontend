import React from "react";
import { fireEvent, wait } from "@testing-library/react";
import { GET_COUNTRY_LIST } from "../../../graphql";
import { donorInputFields } from "../../../utils/inputTestFields.json";
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

const inputIds = donorInputFields;

describe("Donor tests", () => {
	test("Mock response", async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].id)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].key];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			expect(fieldName.value).toBe(value);
		}
		await act(async () => {
			let saveButton = await dialog.getByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
			fireEvent.click(saveButton);
			await wait();
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));
		expect(creationOccured).toBe(true);
	});
});
