import React from "react";
import DeliverableTarget from "../DeliverableTarget";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IDeliverableTarget } from "../../../../models/deliverable/deliverableTarget";
import { DELIVERABLE_ACTIONS } from "../../../Deliverable/constants";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../../graphql/queries/Deliverable/category";
import { renderApollo } from "../../../../utils/test.util";
const intialFormValue: IDeliverableTarget = {
	name: "Test Deliverable Target",
	description: "This is a sample deliverable",
	target_value: "2500",
	deliverableCategory: "",
	deliverableUnit: "",
	deliverable_category_unit: -1,
	project: 4,
};
const onCreateMock = jest.fn();
const onUpdateMock = jest.fn();
const clearErrors = jest.fn();
const handleFormOpen = jest.fn();
const formIsOpen = true;
const validate = jest.fn((values: IDeliverableTarget) => {
	let errors: Partial<IDeliverableTarget> = {};
	if (!values.name && !values.name.length) {
		errors.name = "Name is required";
	}
	if (!values.project) {
		errors.project = "Project is required";
	}
	if (!values.deliverableCategory) {
		errors.deliverableCategory = "Deliverable Category is required";
	}
	if (!values.deliverableUnit) {
		errors.deliverableUnit = "Deliverable Unit is required";
	}
	if (!values.target_value) {
		errors.name = "Target value is required";
	}
	return errors;
});

const formState = DELIVERABLE_ACTIONS.CREATE;

const categoryMock = [
	{ id: 1, name: "SONG" },
	{ id: 1, name: "SONG" },
];
const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
		},
		result: { data: { deliverableCategory: categoryMock } },
	},
];

let deliverableTarget: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		deliverableTarget = renderApollo(
			<DeliverableTarget
				clearErrors={clearErrors}
				initialValues={intialFormValue}
				validate={validate}
				formState={DELIVERABLE_ACTIONS.CREATE}
				onCreate={onCreateMock}
				onUpdate={onUpdateMock}
				handleFormOpen={handleFormOpen}
				formIsOpen={formIsOpen}
			/>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Deliverable Target Form", () => {
	test("should have a name field", () => {
		let nameField = deliverableTarget.getByTestId("deliverableTargetName");
		expect(nameField).toBeInTheDocument();
	});
	test("should have a target Value field", () => {
		let targetValueField = deliverableTarget.getByTestId("deliverableTargetTargetValue");
		expect(targetValueField).toBeInTheDocument();
	});
	test("should have a category field", () => {
		let categoryField = deliverableTarget.getByTestId("deliverableTargetCategory");
		expect(categoryField).toBeInTheDocument();
	});
	test("should have a unit field", () => {
		let unitField = deliverableTarget.getByTestId("deliverableTargetUnit");
		expect(unitField).toBeInTheDocument();
	});
	test("should have a description field", () => {
		let descriptionField = deliverableTarget.getByTestId("deliverableTargetDescription");
		expect(descriptionField).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let submitButton = deliverableTarget.getByTestId("deliverableTargetSubmit");
		expect(submitButton).toBeInTheDocument();
	});

	test("should have initial values", () => {
		let nameField = deliverableTarget.getByTestId(
			"deliverableTargetNameInput"
		) as HTMLInputElement;
		expect(nameField.value).toBe(intialFormValue.name);

		let targetValueField = deliverableTarget.getByTestId(
			"deliverableTargetTargetValueInput"
		) as HTMLInputElement;
		expect(targetValueField.value).toBe(intialFormValue.target_value);

		let categoryField = deliverableTarget.getByTestId(
			"deliverableTargetCategoryInput"
		) as HTMLInputElement;
		expect(categoryField.value).toBe(intialFormValue.deliverableCategory);

		let unitField = deliverableTarget.getByTestId(
			"deliverableTargetUnitInput"
		) as HTMLInputElement;
		expect(unitField.value).toBe(intialFormValue.deliverableUnit);

		let descriptionField = deliverableTarget.getByTestId(
			"deliverableTargetDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(intialFormValue.description);
	});

	test("Submit Button should be disabled if either of name,targetValue,category,unit fields is empty", async () => {
		let nameField = deliverableTarget.getByTestId(
			"deliverableTargetNameInput"
		) as HTMLInputElement;

		let targetValueField = deliverableTarget.getByTestId(
			"deliverableTargetTargetValueInput"
		) as HTMLInputElement;

		let categoryField = deliverableTarget.getByTestId(
			"deliverableTargetCategoryInput"
		) as HTMLInputElement;

		let unitField = deliverableTarget.getByTestId(
			"deliverableTargetUnitInput"
		) as HTMLInputElement;

		let value = "";

		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);

		act(() => {
			fireEvent.change(targetValueField, { target: { value } });
		});
		expect(targetValueField.value).toBe(value);

		act(() => {
			fireEvent.change(categoryField, { target: { value } });
		});
		expect(categoryField.value).toBe(value);

		act(() => {
			fireEvent.change(unitField, { target: { value } });
		});

		expect(unitField.value).toBe(value);

		let submitButton = await deliverableTarget.findByTestId(`deliverableTargetSubmit`);
		expect(submitButton).toBeDisabled();
	});
});
