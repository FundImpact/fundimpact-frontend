import React from "react";
import { fireEvent, wait } from "@testing-library/react";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../../graphql";
import { GET_ORGANIZATION_BUDGET_CATEGORY } from "../../../../graphql/Budget";
import { CREATE_PROJECT_BUDGET_TARGET } from "../../../../graphql/Budget/mutation";
import { GET_PROJ_DONORS } from "../../../../graphql/project";
import { BudgetTargetinputFields } from "../../../../utils/inputTestFields.json";
import { organizationDetails, projectDetails } from "../../../../utils/testMock.json";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../../utils/test.util";
import BudgetTarget from "../BudgetTarget";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { FORM_ACTIONS } from "../../../../models/constants";
import { budgetTargetFormInputFields, budgetTargetFormSelectFields } from "../inputFields.json";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const intialFormValue: any = {
	name: "bud tar",
	total_target_amount: "213",
	description: "desc",
	budget_category_organization: "1",
	donor: "1",
};

const mockOrgHomeCurrency = [{ currency: { code: "INR" } }];

const mockDonors = [
	{ id: "1", donor: { id: "1", name: "donor 1" } },
	{ id: "2", donor: { id: "2", name: "donor 2" } },
];

const mockOrgBudgetCategory = [
	{ id: "1", name: "military 1", code: "m5" },
	{ id: "2", name: "military 2", code: "m6" },
];

const mocks = [
	{
		request: {
			query: GET_ORGANIZATION_BUDGET_CATEGORY,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: {
				orgBudgetCategory: mockOrgBudgetCategory,
			},
		},
	},
	{
		request: {
			query: GET_PROJ_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projectDonors: mockDonors,
			},
		},
	},
	{
		request: {
			query: GET_ORG_CURRENCIES_BY_ORG,
			variables: {
				filter: {
					organization: "3",
					isHomeCurrency: true,
				},
			},
		},
		result: {
			data: {
				orgCurrencies: mockOrgHomeCurrency,
			},
		},
	},
	{
		request: {
			query: CREATE_PROJECT_BUDGET_TARGET,
			variables: {
				input: {
					project: 3,
					name: "bud tar",
					total_target_amount: 213,
					description: "desc",
					budget_category_organization: "1",
					donor: "1",
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createProjectBudgetTarget: {
						id: "1",
						name: "bud tar",
						total_target_amount: 213,
						budget_category_organization: {
							name: "military 1",
							id: "1",
						},
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
					<BudgetTarget
						formAction={FORM_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
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

const budgetTargetInputIds = [...budgetTargetFormInputFields, ...budgetTargetFormSelectFields];

describe("Budget Target Dialog tests", () => {
	for (let i = 0; i < budgetTargetInputIds.length; i++) {
		test(`running test for ${budgetTargetInputIds[i].name} to check if the value is equal to value provided`, async () => {
			let fieldName = (await dialog.findByTestId(
				budgetTargetInputIds[i].testId
			)) as HTMLInputElement;
			let value = intialFormValue[budgetTargetInputIds[i].name];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			await expect(fieldName.value).toBe(value);
		});
	}

	test("Submit button enabled", async () => {
		for (let i = 0; i < budgetTargetInputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(
				budgetTargetInputIds[i].testId
			)) as HTMLInputElement;
			let value = intialFormValue[budgetTargetInputIds[i].name];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
		}
		await act(async () => {
			let saveButton = await dialog.getByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
		});
	});

	for (let i = 0; i < budgetTargetInputIds.length; i++) {
		test(`Required Field test for ${budgetTargetInputIds[i].name}`, async () => {
			for (let j = 0; j < budgetTargetInputIds.length; j++) {
				if (i == j) {
					let fieldName = (await dialog.findByTestId(
						budgetTargetInputIds[i].testId
					)) as HTMLInputElement;
					await act(async () => {
						await fireEvent.change(fieldName, { target: { value: "" } });
					});
					continue;
				}
				let fieldName = (await dialog.findByTestId(
					budgetTargetInputIds[j].testId
				)) as HTMLInputElement;
				let value = intialFormValue[budgetTargetInputIds[j].name];
				await act(async () => {
					await fireEvent.change(fieldName, { target: { value } });
				});
			}
			if (budgetTargetInputIds[i].required) {
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
		for (let i = 0; i < budgetTargetInputIds.length; i++) {
			let budgetCategoryFieldName = (await dialog.findByTestId(
				budgetTargetInputIds[i].testId
			)) as HTMLInputElement;
			let value = intialFormValue[budgetTargetInputIds[i].name];
			await act(async () => {
				await fireEvent.change(budgetCategoryFieldName, { target: { value } });
			});
		}
		await act(async () => {
			let budgetTargetSaveButton = await dialog.getByTestId("createSaveButton");
			fireEvent.click(budgetTargetSaveButton);
			await wait();
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));
		expect(creationOccured).toBe(true);
	});
});
