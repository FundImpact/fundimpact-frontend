import React from "react";
import ImpactCategoryDialog from "../ImpactCategoryDialog";
import { act, fireEvent, wait } from "@testing-library/react";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { CREATE_IMPACT_CATEGORY_ORG_INPUT } from "../../../../graphql/Impact/mutation";
import { impactCategoeyDialogFields } from "../../../../utils/inputTestFields.json";
import { organizationDetail } from "../../../../utils/testMock.json";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../../graphql/Impact/query";
import { FORM_ACTIONS } from "../../../../models/constants";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const initialValues: any = {
	name: "impc name",
	description: "desc",
	code: "impc code ",
	shortname: "sh name",
};

const categoryMock = [
	{ id: 1, name: "Category" },
	{ id: 2, name: "Supply" },
];

const mocks = [
	{
		request: {
			query: CREATE_IMPACT_CATEGORY_ORG_INPUT,
			variables: {
				input: { ...initialValues, organization: "13" },
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
		result: { data: { impactCategoryOrgList: categoryMock } },
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider defaultState={{ organization: organizationDetail }}>
				<NotificationProvider>
					<ImpactCategoryDialog
						formAction={FORM_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
						organization="13"
					/>
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
				resolvers: {},
			}
		);
	});
});

const inputIds = impactCategoeyDialogFields;

describe("Imact category dialog tests", () => {
	test("Mock response", async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].id)) as HTMLInputElement;
			let value = initialValues[inputIds[i].key];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			await expect(fieldName.value).toBe(value);
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
