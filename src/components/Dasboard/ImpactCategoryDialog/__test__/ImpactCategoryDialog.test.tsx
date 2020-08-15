import React from "react";
import ImpactCategoryDialog from "../ImpactCategoryDialog";
import { act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { CREATE_IMPACT_CATEGORY_ORG_INPUT } from "../../../../graphql/queries/Impact/mutation";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const initialValues: any = {
	name: "impc name",
	description: "desc",
	code: "impc code ",
	shortname: "sh name",
};

const mocks = [
	{
		request: {
			query: CREATE_IMPACT_CATEGORY_ORG_INPUT,
			variables: {
				input: initialValues,
				organization: "1",
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
		dialog = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<ImpactCategoryDialog open={true} handleClose={handleClose} />
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

const inputIds = [
	{ id: "createImpactNameInput", key: "name" },
	{ id: "createImpactShortNameInput", key: "shortname" },
	{ id: "createImpactCodeInput", key: "code" },
	{ id: "createImpactCategoryDescriptionInput", key: "description" },
];

describe("Imact category dialog tests", () => {
	test("Dialog is rendered correctly", () => {
		const conponent = dialog.getByTestId("impact-category-dialog");
		expect(conponent).toBeInTheDocument();
	});

	test("Dialog render header correctly", () => {
		const header = dialog.getByTestId("impact-category-dialog-header");
		expect(header).toHaveTextContent("New Impact Category");
	});

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
			let saveButton = await dialog.getByTestId("createImpactCategorySaveButton");
			expect(saveButton).toBeEnabled();
		});

		// await act(async () => {
		// 	let saveButton = await dialog.getByTestId("createImpactCategorySaveButton");
		// 	await wait(() => fireEvent.click(saveButton));
		// });
		// expect(creationOccured).toBe(true);
	});
});
