import React from "react";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateBudgetForm from "../CreateBudgetForm";
import { IBudget } from "../../../../models/budget/budget";

const intialFormValue: IBudget = {
	code: "code 1",
	description: "budget description",
	name: "budget 1",
};

const validate = (values: IBudget) => {
	let errors: Partial<IBudget> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Budget code is required";
	}
	return errors;
};

let createForm: RenderResult<typeof queries>;
const onSubmit = jest.fn();
const onCancel = jest.fn();

beforeEach(() => {
	act(() => {
		createForm = render(
			<CreateBudgetForm
				initialValues={intialFormValue}
				onSubmit={onSubmit}
				validate={validate}
				onCancel={onCancel}
			/>
		);
	});
});

describe("Create Budget Form", () => {
	test("should have name field", () => {
		let nameField = createForm.getByTestId("createBudgetName");
		expect(nameField).toBeInTheDocument();
	});

	test("should have budget code field", () => {
		let budgetCodeField = createForm.getByTestId("createBudgetCode");
		expect(budgetCodeField).toBeInTheDocument();
	});

	test("should have description field", () => {
		let descriptionField = createForm.getByTestId("createBudgetDescription");
		expect(descriptionField).toBeInTheDocument();
	});

	test("should have save button", () => {
		let saveButton = createForm.getByTestId("createBudgetSaveButton");
		expect(saveButton).toBeInTheDocument();
	});

	test("should have cancel button", () => {
		let saveButton = createForm.getByTestId("createBudgetCancelButton");
		expect(saveButton).toBeInTheDocument();
	});

	test("Should have initial values", () => {
		let nameField = createForm.getByTestId("createBudgetNameInput") as HTMLInputElement;
		expect(nameField.value).toBe(intialFormValue.name);

		let budgetCodeField = createForm.getByTestId("createBudgetCodeInput") as HTMLInputElement;
		expect(budgetCodeField.value).toBe(intialFormValue.code);

		let descriptionField = createForm.getByTestId(
			"createBudgetDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(intialFormValue.description);
	});

	test("Save Button should be disaled if name field is empty", async () => {
		let nameField = createForm.getByTestId("createBudgetNameInput") as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let saveButton = await createForm.findByTestId("createBudgetSaveButton");
		expect(saveButton).toBeDisabled();
	});
});
