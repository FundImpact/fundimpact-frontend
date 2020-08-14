import React from "react";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateBudgetTargetForm from "../CreateBudgetTargetForm";
import { IBudgetTargetForm } from "../../../../models/budget/budgetForm";
import { BUDGET_ACTIONS } from "../../../../models/budget/constants";
import { IOrganizationCurrency } from "../../../../models/";
import { IBudget } from "../../../../models/budget/budget";

const intialFormValue: any = {
	organization_currency: "24",
	description: "budget description",
	name: "budget 1",
	budget_category_organization: "22",
	conversion_factor: "1233",
	total_target_amount: "123",
};

const mockOrgCurrencies: IOrganizationCurrency[] = [
	{
		id: "24",
		currency: {
			name: "Indian Rupee",
		},
	},
	{
		id: "20",
		currency: {
			name: "Indian Rupee",
		},
	},
];
const mockBudgetCategories: IBudget[] = [
	{
		id: "22",
		name: "qwd",
		code: "qwd",
	},
	{
		id: "29",
		name: "qwd",
		code: "wqd",
	},
];

const validate = (values: IBudgetTargetForm) => {
	let errors: Partial<IBudgetTargetForm> = {};

	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.total_target_amount) {
		errors.total_target_amount = "Total target amount is required";
	}
	if (!values.conversion_factor) {
		errors.conversion_factor = "Conversion factor is required";
	}
	if (!values.budget_category_organization) {
		errors.budget_category_organization = "Budget Category is required";
	}
	if (!values.organization_currency) {
		errors.organization_currency = "Organization Currency is required";
	}
	return errors;
};

let createForm: RenderResult<typeof queries>;
const onCancel = jest.fn();
const onCreate = jest.fn();
const onUpdate = jest.fn();

beforeEach(() => {
	act(() => {
		createForm = render(
			<CreateBudgetTargetForm
				initialValues={intialFormValue}
				validate={validate}
				onCancel={onCancel}
				onCreate={onCreate}
				onUpdate={onUpdate}
				formAction={BUDGET_ACTIONS.CREATE}
				organizationCurrencies={mockOrgCurrencies}
				budgetCategory={mockBudgetCategories}
			/>
		);
	});
});

let inputFieldsId = [
	{ id: "createBudgetTargetName", name: "name" },
	{ id: "createBudgetTargetTotalTargetAmount", name: "target amount" },
	{ id: "createBudgetTargetOrganizationCurrency", name: "total org currency" },
	{ id: "createBudgetTargetBudgetCategory", name: "total budget category" },
	{ id: "createBudgetTargetConversionFactor", name: "target conversion factor" },
	{ id: "createBudgetTargetDescription", name: "target description" },
	{ id: "createBudgetTargetSaveButton", name: "save button" },
	{ id: "createBudgetTargetCancelButton", name: "cancel button" },
];

let inputPropsId = [
	{ id: "createBudgetTargetNameInput", key: "name" },
	{ id: "createBudgetTargetTotalTargetAmountInput", key: "total_target_amount" },
	{ id: "createBudgetTargetOrganizationCurrencyOption", key: "organization_currency" },
	{ id: "createBudgetTargetBudgetCategoryOption", key: "budget_category_organization" },
	{ id: "createBudgetTargetConversionFactorInput", key: "conversion_factor" },
	{ id: "createBudgetTargetDescriptionInput", key: "description" },
];

describe("Create Budget Target Form", () => {
	for (let i = 0; i < inputFieldsId.length; i++) {
		test(`should have ${inputFieldsId[i].name}`, () => {
			let nameField = createForm.getByTestId(inputFieldsId[i].id);
			expect(nameField).toBeInTheDocument();
		});
	}

	for (let i = 0; i < inputPropsId.length; i++) {
		test(`${inputPropsId[i].key} Should have correct initial value`, () => {
			let nameField = createForm.getByTestId(`${inputPropsId[i].id}`) as HTMLInputElement;
			expect(nameField.value).toBe(intialFormValue[inputPropsId[i].key]);
		});
	}

	test("Save Button should be disaled if name field is empty", async () => {
		let nameField = createForm.getByTestId("createBudgetTargetNameInput") as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let saveButton = await createForm.findByTestId("createBudgetTargetSaveButton");
		expect(saveButton).toBeDisabled();
	});
});
