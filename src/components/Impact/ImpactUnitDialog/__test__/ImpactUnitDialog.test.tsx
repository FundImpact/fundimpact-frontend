import React from "react";
import ImpaceUnitDialog from "../ImpaceUnitDialog";
import { act, fireEvent, wait } from "@testing-library/react";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { CREATE_IMPACT_UNITS_ORG_INPUT } from "../../../../graphql/Impact/mutation";
import { impactUnitDialogFields } from "../../../../utils/inputTestFields.json";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../../graphql/Impact/query";
import { organizationDetail } from "../../../../utils/testMock.json";
const handleClose = jest.fn();

const impactCategoryMock = [
	{
		id: "2",
		name: "SONG",
		code: "ICO",
		shortname: "IMORG",
		description: "createImpactCategoryOrgInput",
		organization: {
			id: "2",
			name: "TSERIES",
			address: null,
			account: {
				id: "2",
				name: "rahul@gmail.com",
				description: null,
				account_no: "a8c1e362-405f-4572-a849-eb8094ffa550",
			},
			short_name: "TS",
			legal_name: "",
			description: null,
			organization_registration_type: {
				id: "1",
				reg_type: "Trusts",
			},
		},
	},
];
let dialog: any;

const initialValues: any = {
	name: "impc name",
	description: "desc",
	code: "impc code",
	target_unit: "123",
	prefix_label: "pre label",
	suffix_label: "suf label",
};

let creationOccured = false;

const mocks = [
	{
		request: {
			query: CREATE_IMPACT_UNITS_ORG_INPUT,
			variables: {
				input: { ...initialValues, target_unit: 123 },
			},
		},
		result: () => {
			creationOccured = true;
			return {};
		},
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_BY_ORG,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { impactCategoryOrgList: impactCategoryMock } },
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider defaultState={{ organization: organizationDetail }}>
				<NotificationProvider>
					<ImpaceUnitDialog open={true} handleClose={handleClose} />
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
			await expect(fieldName.value).toBe(value);
		}

		await act(async () => {
			let saveButton = await dialog.findByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
			fireEvent.click(saveButton);
			await wait();
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));
		expect(creationOccured).toBe(true);
	});
});
