import React from "react";
import BudgetTarget from "../BudgetTarget";
import { fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { CREATE_PROJECT_BUDGET_TARGET } from "../../../../graphql/Budget/mutation";
import { GET_ORGANIZATION_BUDGET_CATEGORY } from "../../../../graphql/Budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../../../models/budget/constants";
import { BudgetTargetinputFields } from "../../../../utils/inputTestFields.json";
import { projectDetails, organizationDetails } from "../../../../utils/testMock.json";
import { GET_PROJ_DONORS } from "../../../../graphql/project";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../../graphql";

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

const inputIds = BudgetTargetinputFields;

describe("Budget Target Dialog tests", () => {
	test("Mock response", async () => {
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
		expect(creationOccured).toBe(true);
	});
});
