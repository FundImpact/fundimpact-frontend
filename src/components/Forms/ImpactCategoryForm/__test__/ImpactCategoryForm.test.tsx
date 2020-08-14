import React from "react";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ImpactCategoryForm from "../ImpactCategoryForm";
import { IImpactCategory } from "../../../../models/impact/impact";

const initialValues: IImpactCategory = {
	name: "",
	description: "",
	code: "",
	shortname: "",
};

const validate = (values: IImpactCategory) => {
	let errors: Partial<IImpactCategory> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Impact Code is required";
	}
	if (!values.shortname) {
		errors.shortname = "Shortname is required";
	}
	return errors;
};

let createForm: RenderResult<typeof queries>;
const onSubmit = jest.fn();
const onCancel = jest.fn();

beforeEach(() => {
	act(() => {
		createForm = render(
			<ImpactCategoryForm
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				onCancel={onCancel}
			/>
		);
	});
});

describe("Impact Category Form", () => {
	test("should have name field", () => {
		let nameField = createForm.getByTestId("createImpactName");
		expect(nameField).toBeInTheDocument();
	});

	test("should have short name field", () => {
		let shortNameField = createForm.getByTestId("createImpactShortName");
		expect(shortNameField).toBeInTheDocument();
	});

	test("should have impact code field", () => {
		let impactCategoryCodeField = createForm.getByTestId("createImpactCode");
		expect(impactCategoryCodeField).toBeInTheDocument();
	});

	test("should have impact category description field", () => {
		let descriptionField = createForm.getByTestId("createImpactCategoryDescription");
		expect(descriptionField).toBeInTheDocument();
	});

	test("should have save button", () => {
		let saveButton = createForm.getByTestId("createImpactCategorySaveButton");
		expect(saveButton).toBeInTheDocument();
	});

	test("should have cancel button", () => {
		let cancelButton = createForm.getByTestId("createImpactCategoryCancelButton");
		expect(cancelButton).toBeInTheDocument();
	});

	test("Should have initial values", () => {
		let nameField = createForm.getByTestId("createImpactNameInput") as HTMLInputElement;
		expect(nameField.value).toBe(initialValues.name);

		let impactCategoryField = createForm.getByTestId("createImpactCodeInput") as HTMLInputElement;
		expect(impactCategoryField.value).toBe(initialValues.code);

		let impactShortNameField = createForm.getByTestId("createImpactShortNameInput") as HTMLInputElement;
		expect(impactShortNameField.value).toBe(initialValues.code);

		let descriptionField = createForm.getByTestId(
			"createImpactCategoryDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(initialValues.description);
	});

	test("Save Button should be disaled if name field is empty", async () => {
		let nameField = createForm.getByTestId("createImpactNameInput") as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let saveButton = await createForm.findByTestId("createImpactCategorySaveButton");
		expect(saveButton).toBeDisabled();
	});
});
