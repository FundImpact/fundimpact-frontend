import React from "react";
import ImpaceUnitDialog from "../ImpaceUnitDialog";
import { act, fireEvent, wait } from "@testing-library/react";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { CREATE_IMPACT_UNITS_ORG_INPUT } from "../../../../graphql/Impact/mutation";
import { impactUnitDialogFields } from "../../../../utils/inputTestFields.json";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../../graphql/Impact/query";
import { organizationDetails } from "../../../../utils/testMock.json";
import { FORM_ACTIONS } from "../../../../models/constants";
const handleClose = jest.fn();

const impactCategoryMock = [
	{
		id: "2",
		name: "SONG 2",
		code: "ICO 2",
		shortname: "IMORG 2",
		description: "createImpactCategoryOrgInput 2",
	},
	{
		id: "1",
		name: "SONG 1",
		code: "ICO 1",
		shortname: "IMORG 1",
		description: "createImpactCategoryOrgInput 1",
	},
	{
		id: "3",
		name: "SONG 3",
		code: "ICO 3",
		shortname: "IMORG 3",
		description: "createImpactCategoryOrgInput 3",
	},
];
let dialog: any;

const initialValues: any = {
	name: "impc name",
	description: "desc",
	code: "impc code",
};

let creationOccured = false;

const mocks = [
	{
		request: {
			query: CREATE_IMPACT_UNITS_ORG_INPUT,
			variables: {
				input: { ...initialValues, organization: "3" },
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createImpactUnitsOrgInput: {
						id: "1",
						...initialValues,
					},
				},
			};
		},
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_BY_ORG,
			variables: { filter: { organization: "3" } },
		},
		result: { data: { impactCategoryOrgList: impactCategoryMock } },
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider defaultState={{ organization: organizationDetails }}>
				<NotificationProvider>
					<ImpaceUnitDialog
						formAction={FORM_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
						organization={"3"}
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

const inputIds = impactUnitDialogFields;

describe("Impact Unit dialog tests", () => {
	test("mock data", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].id)) as HTMLInputElement;
			let value = initialValues[inputIds[i].key];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			// await expect(fieldName.value).toBe(value);
		}

		// await act(async () => {
		// 	let saveButton = await dialog.findByTestId("createSaveButton");
		// 	expect(saveButton).toBeEnabled();
		// 	fireEvent.click(saveButton);
		// 	await wait();
		// });

		// await new Promise((resolve) => setTimeout(resolve, 1000));
		// expect(creationOccured).toBe(true);
	});
});
