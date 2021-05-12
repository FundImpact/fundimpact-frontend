import React from "react";
import {
	GET_ORG_CURRENCIES_BY_ORG,
	GET_CURRENCY_LIST,
	GET_COUNTRY_LIST,
} from "../../../../graphql";
import { GET_ORGANIZATION_BUDGET_CATEGORY } from "../../../../graphql/Budget";
import { CREATE_PROJECT_BUDGET_TARGET } from "../../../../graphql/Budget/mutation";
import { GET_PROJECT_BUDGET_AMOUNT, GET_PROJ_DONORS } from "../../../../graphql/project";
import { mockCurrencyList } from "../../../../utils/testMock.json";
import {
	organizationDetails,
	projectDetails,
	mockOrgBudgetCategory,
	mockProjectDonors,
	mockCountryList,
	mockOrgDonor,
} from "../../../../utils/testMock.json";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../../utils/test.util";
import BudgetTarget from "../BudgetTarget";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { FORM_ACTIONS } from "../../../../models/constants";
import { budgetTargetFormInputFields } from "../inputFields.json";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { IBudgetTargetForm } from "../../../../models/budget/budgetForm";
import { fireEvent, wait } from "@testing-library/dom";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import { GET_ORG_DONOR } from "../../../../graphql/donor";

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

const mocks = [
	{
		request: {
			query: GET_COUNTRY_LIST,
		},
		result: {
			data: {
				countries: mockCountryList,
			},
		},
	},
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
			query: GET_USER_ROLES,
			variables: {
				filter: {
					role: "1",
				},
			},
		},
		result: { data: mockUserRoles },
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
				projectDonors: mockProjectDonors,
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
			query: GET_ORG_DONOR,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: {
				orgDonors: mockOrgDonor,
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
	{
		request: {
			query: GET_PROJECT_BUDGET_AMOUNT,
			variables: { filter: { project: 3 } },
		},
		result: { data: { projectBudgetTargetAmountSum: 0 } },
	},
];

let consoleWarnSpy: undefined | jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

afterAll(() => {
	consoleWarnSpy?.mockRestore();
});

beforeEach(async () => {
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
	await wait();
});

beforeAll(() => {
	consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation((msg) => {
		!msg.includes(
			"isInitialValid has been deprecated and will be removed in future versions of Formik."
		) && console.warn(msg);
	});
});

const inputIds = [...budgetTargetFormInputFields];

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
		await wait(() => {
			expect(creationOccured).toBe(true);
		});
	});
});
