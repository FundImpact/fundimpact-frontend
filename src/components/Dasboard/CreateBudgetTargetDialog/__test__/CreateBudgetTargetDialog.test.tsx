import React from "react";
import CreateBudgetTargetDialog from "../CreateBudgetTargetDialog";
import { fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	CREATE_PROJECT_BUDGET_TARGET,
} from "../../../../graphql/queries/budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../../../models/budget/constants";
import { GET_ORG_CURRENCIES } from "../../../../graphql/queries";
import { createBudgetTargetDialoginputFields } from "../../../../utils/inputTestFields.json";
import { projectDetails } from "../../../../utils/testMock.json";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const intialFormValue: any = {
	name: "bud tar",
	total_target_amount: "213",
	description: "desc",
	conversion_factor: "43",
	organization_currency: "1",
	budget_category_organization: "1",
};

const mockOrgBudgetCategory = [
	{ id: "1", name: "bud name 1", code: "bd code 1" },
	{ id: "2", name: "bud name 2", code: "bd code 2" },
];

const mockOrgCurrencies = [{ id: "1", currency: { name: "INR" } }];

const mocks = [
	{
		request: {
			query: GET_ORGANIZATION_BUDGET_CATEGORY,
			variables: {},
		},
		result: {
			data: {
				orgBudgetCategory: mockOrgBudgetCategory,
			},
		},
	},
	{
		request: {
			query: GET_ORG_CURRENCIES,
			variables: {},
		},
		result: {
			data: {
				orgCurrencies: mockOrgCurrencies,
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
					conversion_factor: 43,
					organization_currency: "1",
					budget_category_organization: "1",
				},
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
			<DashboardProvider defaultState={{ project: projectDetails }}>
				<NotificationProvider>
					<CreateBudgetTargetDialog
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

const inputIds = createBudgetTargetDialoginputFields;

describe("Budget Target Dialog tests", () => {
	test("Mock response", async () => {
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
