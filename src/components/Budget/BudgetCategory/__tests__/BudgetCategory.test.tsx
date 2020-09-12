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
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { IBudgetCategory } from "../../../../models/budget";
import { FORM_ACTIONS } from "../../../../models/budget/constants";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const intialFormValue: IBudgetCategory = {
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
			creationOccured = true;
			return {
				data: {
					createOrgBudgetCategory: {
						id: "1",
						name: "new name",
						description: "new desc",
						code: "new code",
					},
				},
			};
		},
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider defaultState={{ organization: orgDetails }}>
				<NotificationProvider>
					<BudgetCategory
						open={true}
						handleClose={handleClose}
						formAction={FORM_ACTIONS.CREATE}
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

let inputIds = budgetCategoryFormInputFields;

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Budget Category Dialog tests", () => {
	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: dialog,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled<IBudgetCategory>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IBudgetCategory>({
				inputFields: inputIds,
				reactElement: dialog,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IBudgetCategory>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
