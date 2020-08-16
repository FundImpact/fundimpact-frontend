import React from "react";
import CreateBudgetDialog from "../CreateBudgetDialog";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { CREATE_ORG_BUDGET_CATEGORY } from "../../../../graphql/queries/budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { createBudgetDialogInputFields } from "../../../../utils/inputTestFields.json";

const handleClose = jest.fn();

let dialog: any;
let updationDone = false;

const intialFormValue: any = {
	code: "category code",
	description: "category description",
	name: "category namqfe",
};

const mocks = [
	{
		request: {
			query: CREATE_ORG_BUDGET_CATEGORY,
			variables: {
				input: {
					name: "new name",
					description: "new desc",
					code: "new code",
				},
			},
		},
		result: () => {
			updationDone = true;
			return {};
		},
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<CreateBudgetDialog open={true} handleClose={handleClose} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

let inputIds = createBudgetDialogInputFields;

describe("Budget Category Dialog tests", () => {
	test("Create Budget Category", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].id)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].key];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			await expect(fieldName.value).toBe(value);
		}

		await act(async () => {
			let saveButton = await dialog.getByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
		});

		await act(async () => {
			let saveButton = await dialog.findByTestId("createSaveButton");
			await fireEvent.click(saveButton);
		});

		// await new Promise((resolve) => setTimeout(resolve, 1000));
		// expect(updationDone).toBe(true);
	});
});
