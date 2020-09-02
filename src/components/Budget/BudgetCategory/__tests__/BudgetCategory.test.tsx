import React from "react";
import BudgetCategory from "../BudgeCategory";
import { fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { CREATE_ORG_BUDGET_CATEGORY } from "../../../../graphql/Budget/mutation";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { BudgetCategoryInputFields } from "../../../../utils/inputTestFields.json";
import { organizationDetails } from "../../../../utils/testMock.json";

const handleClose = jest.fn();

let dialog: any;
let updationDone = false;

const intialFormValue: any = {
	code: "new code",
	description: "new desc",
	name: "new name",
};

let orgDetails = organizationDetails;

const mocks = [
	{
		request: {
			query: CREATE_ORG_BUDGET_CATEGORY,
			variables: {
				input: {
					name: "new name",
					description: "new desc",
					code: "new code",
					organization: "3",
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
			<DashboardProvider defaultState={{ organization: orgDetails }}>
				<NotificationProvider>
					<BudgetCategory open={true} handleClose={handleClose} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

let inputIds = BudgetCategoryInputFields;

describe("Budget Category Dialog tests", () => {
	test("Create Budget Category", async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
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
			fireEvent.click(saveButton);
			await wait();
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));
		expect(updationDone).toBe(true);
	});
});
