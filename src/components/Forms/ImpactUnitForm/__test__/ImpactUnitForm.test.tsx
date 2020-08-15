import React from "react";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ImpaceUnitForm from "../ImpaceUnitForm";
import { IImpactUnitFormInput } from "../../../../models/impact/impactForm";

const initialValues: IImpactUnitFormInput = {
	name: "",
	description: "desc",
	code: "impc code",
	prefix_label: "prefix data",
	suffix_label: "suffix",
	target_unit: "101",
};

const validate = (values: IImpactUnitFormInput) => {
	let errors: Partial<IImpactUnitFormInput> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Impact Code is required";
	}
	if (!values.prefix_label) {
		errors.prefix_label = "Prefix label is required";
	}
	if (!values.suffix_label) {
		errors.suffix_label = "Suffix label is required";
	}
	if (!values.target_unit) {
		errors.target_unit = "Target unit is required";
	}
	return errors;
};

let createForm: RenderResult<typeof queries>;
const onSubmit = jest.fn();
const onCancel = jest.fn();

beforeEach(() => {
	act(() => {
		createForm = render(
			<ImpaceUnitForm
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
				onCancel={onCancel}
			/>
		);
	});
});

describe("Impact Unit Form", () => {
	test("should have name field", () => {
		let nameField = createForm.getByTestId("createImpactUnitName");
		expect(nameField).toBeInTheDocument();
	});

	test("should have impactUnit code field", () => {
		let impactUnitField = createForm.getByTestId("createImpactUnitCode");
		expect(impactUnitField).toBeInTheDocument();
	});

	test("should have impact unit prefix field", () => {
		let impactUnitField = createForm.getByTestId("createImpactUnitPrefixLabel");
		expect(impactUnitField).toBeInTheDocument();
	});

	test("should have impact unit suffix field", () => {
		let impactUnitField = createForm.getByTestId("createImpactUnitSuffixLabel");
		expect(impactUnitField).toBeInTheDocument();
	});

	test("should have impact unit description field", () => {
		let descriptionField = createForm.getByTestId("createImpactUnitDescriptionInput");
		expect(descriptionField).toBeInTheDocument();
	});

	test("should have impact unit target field", () => {
		let descriptionField = createForm.getByTestId("createImpactUnitTargetUnit");
		expect(descriptionField).toBeInTheDocument();
	});

	test("should have save button", () => {
		let saveButton = createForm.getByTestId("createImpactUnitSaveButton");
		expect(saveButton).toBeInTheDocument();
	});

	test("should have cancel button", () => {
		let saveButton = createForm.getByTestId("createImpactUnitCancelButton");
		expect(saveButton).toBeInTheDocument();
	});

	test("Should have initial values", () => {
		let nameField = createForm.getByTestId("createInpactUnitNameInput") as HTMLInputElement;
		expect(nameField.value).toBe(initialValues.name);

		let impactUnitField = createForm.getByTestId(
			"createImpactUnitCodeInput"
		) as HTMLInputElement;
		expect(impactUnitField.value).toBe(initialValues.code);

		let prefixLabelField = createForm.getByTestId(
			"createImpactUnitPrefixLabelInput"
		) as HTMLInputElement;
		expect(prefixLabelField.value).toBe(initialValues.prefix_label);

		let suffixLabelField = createForm.getByTestId(
			"createImpactUnitSuffixLabelInput"
		) as HTMLInputElement;
    expect(suffixLabelField.value).toBe(initialValues.suffix_label);
    
		let targetUnitField = createForm.getByTestId(
			"createImpactUnitTargetUnitInput"
		) as HTMLInputElement;
		expect(targetUnitField.value).toBe(initialValues.target_unit);

		let descriptionField = createForm.getByTestId(
			"createImpactUnitDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(initialValues.description);
	});

	test("Save Button should be disaled if name field is empty", async () => {
		let nameField = createForm.getByTestId("createInpactUnitNameInput") as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let saveButton = await createForm.findByTestId("createImpactUnitSaveButton");
		expect(saveButton).toBeDisabled();
	});
});
