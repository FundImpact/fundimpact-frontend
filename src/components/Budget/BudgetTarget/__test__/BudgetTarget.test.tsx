import React from "react";
import { GET_ORG_CURRENCIES_BY_ORG, GET_CURRENCY_LIST } from "../../../../graphql";
import { GET_ORGANIZATION_BUDGET_CATEGORY } from "../../../../graphql/Budget";
import { CREATE_PROJECT_BUDGET_TARGET } from "../../../../graphql/Budget/mutation";
import { GET_PROJ_DONORS } from "../../../../graphql/project";
import {
	organizationDetails,
	projectDetails,
	mockCurrencyList,
} from "../../../../utils/testMock.json";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../../utils/test.util";
import BudgetTarget from "../BudgetTarget";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { FORM_ACTIONS } from "../../../../models/constants";
import { budgetTargetFormInputFields, budgetTargetFormSelectFields } from "../inputFields.json";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { IBudgetTargetForm } from "../../../../models/budget/budgetForm";
import { fireEvent, wait } from "@testing-library/dom";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const intialFormValue: IBudgetTargetForm = {
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
			query: GET_CURRENCY_LIST,
			variables: {
				filter: {
					country: "1",
				},
			},
		},
		result: {
			data: {
				currencyList: mockCurrencyList,
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

const inputIds = [...budgetTargetFormInputFields, ...budgetTargetFormSelectFields];

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Budget Target Dialog tests", () => {
	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled<IBudgetTargetForm>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IBudgetTargetForm>({
				inputFields: inputIds,
				reactElement: dialog,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: dialog,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IBudgetTargetForm>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
