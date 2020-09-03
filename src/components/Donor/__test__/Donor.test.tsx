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
import { addDonorForm, addDonorFormSelectFields } from "../inputField.json";

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

const inputIds = [...addDonorForm, ...addDonorFormSelectFields];

describe("Donor tests", () => {
	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			let fieldName = (await dialog.findByTestId(inputIds[i].testId)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].name];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			await expect(fieldName.value).toBe(value);
		});
	}

	test("Submit button enabled", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].testId)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].name];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
		}
		await act(async () => {
			let saveButton = await dialog.getByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			for (let j = 0; j < inputIds.length; j++) {
				if (i == j) {
					let fieldName = (await dialog.findByTestId(
						inputIds[i].testId
					)) as HTMLInputElement;
					await act(async () => {
						await fireEvent.change(fieldName, { target: { value: "" } });
					});
					continue;
				}
				let fieldName = (await dialog.findByTestId(inputIds[j].testId)) as HTMLInputElement;
				let value = intialFormValue[inputIds[j].name];
				await act(async () => {
					await fireEvent.change(fieldName, { target: { value } });
				});
			}
			if (inputIds[i].required) {
				await act(async () => {
					let saveButton = await dialog.getByTestId("createSaveButton");
					expect(saveButton).not.toBeEnabled();
				});
			} else {
				await act(async () => {
					let saveButton = await dialog.getByTestId("createSaveButton");
					expect(saveButton).toBeEnabled();
				});
			}
		});
	}

	test("Mock response", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].testId)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].name];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
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
