import React from "react";
import BudgetCategory from "../BudgeCategory";
import { fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { CREATE_ORG_BUDGET_CATEGORY } from "../../../../graphql/Budget/mutation";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { organizationDetails } from "../../../../utils/testMock.json";
import { budgetCategoryFormInputFields } from "../inputFields.json";

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

let inputIds = budgetCategoryFormInputFields;

describe("Budget Category Dialog tests", () => {
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

	test("Create Budget Category", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].testId)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].name];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
		}

		await act(async () => {
			let saveButton = await dialog.getByTestId("createSaveButton");
			fireEvent.click(saveButton);
			await wait();
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));
		expect(updationDone).toBe(true);
	});
});
