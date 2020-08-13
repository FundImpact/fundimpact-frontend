import React from "react";
import DeliverableForm from "../Deliverable";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IDeliverable } from "../../../../models/deliverable/deliverable";
import { DELIVERABLE_ACTIONS } from "../../../Deliverable/constants";
import Deliverable from "../../../Deliverable/Deliverable";

const intialFormValue: IDeliverable = {
	name: "Deliverable",
	code: "D1",
	description: "",
	organization: 2,
};
const onCreateMock = jest.fn();
const onUpdateMock = jest.fn();
const clearErrors = jest.fn();
const handleFormOpen = jest.fn();
const formIsOpen = true;
const validate = jest.fn((values: IDeliverable) => {
	let errors: Partial<IDeliverable> = {};
	if (!values.name && !values.name.length) {
		errors.name = "Name is required";
	}
	if (!values.organization) {
		errors.organization = "Organization is required";
	}
	return errors;
});

const formState = DELIVERABLE_ACTIONS.CREATE;

let deliverableForm: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		deliverableForm = render(
			<DeliverableForm
				clearErrors={clearErrors}
				initialValues={intialFormValue}
				validate={validate}
				formState={DELIVERABLE_ACTIONS.CREATE}
				onCreate={onCreateMock}
				onUpdate={onUpdateMock}
				handleFormOpen={handleFormOpen}
				formIsOpen={formIsOpen}
			/>
		);
	});
});

describe("Create Deliverable Form", () => {
	test("should have a name field", () => {
		let nameField = deliverableForm.getByTestId("deliverableFormName");
		expect(nameField).toBeInTheDocument();
	});
	test("should have a code field", () => {
		let codeField = deliverableForm.getByTestId("deliverableFormCode");
		expect(codeField).toBeInTheDocument();
	});

	test("should have a description field", () => {
		let descriptionField = deliverableForm.getByTestId("deliverableFormDescription");
		expect(descriptionField).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let submitButton = deliverableForm.getByTestId("deliverableFormSubmit");
		expect(submitButton).toBeInTheDocument();
	});

	test("should have initial values", () => {
		let nameField = deliverableForm.getByTestId("deliverableFormNameInput") as HTMLInputElement;
		expect(nameField.value).toBe(intialFormValue.name);

		let codeField = deliverableForm.getByTestId("deliverableFormCodeInput") as HTMLInputElement;
		expect(codeField.value).toBe(intialFormValue.code);

		let descriptionField = deliverableForm.getByTestId(
			"deliverableFormDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(intialFormValue.description);
	});

	test("Submit Button should be disabled if name field is empty", async () => {
		let nameField = deliverableForm.getByTestId("deliverableFormNameInput") as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let submitButton = await deliverableForm.findByTestId(`deliverableFormSubmit`);
		expect(submitButton).toBeDisabled();
	});
});
