import React from "react";
import DeliverableUnit from "../DeliverableUnit";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IDeliverableUnit } from "../../../../models/deliverable/deliverableUnit";
import { DELIVERABLE_ACTIONS } from "../../../Deliverable/constants";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../../graphql/queries/Deliverable/category";
import { renderApollo } from "../../../../utils/test.util";
const intialFormValue: IDeliverableUnit = {
	name: "Test Deliverable",
	code: "",
	description: "This is a sample deliverable",
	unit_type: "",
	prefix_label: "XX",
	suffix_label: "YY",
	deliverableCategory: -1,
	organization: 2,
};
const onCreateMock = jest.fn();
const onUpdateMock = jest.fn();
const clearErrors = jest.fn();
const handleFormOpen = jest.fn();
const formIsOpen = true;
const validate = jest.fn((values: IDeliverableUnit) => {
	let errors: Partial<IDeliverableUnit> = {};
	if (!values.name && !values.name.length) {
		errors.name = "Name is required";
	}
	if (!values.prefix_label) {
		errors.prefix_label = "prefix label is required";
	}
	if (!values.suffix_label) {
		errors.suffix_label = "Project is required";
	}
	if (!values.deliverableCategory) {
		errors.deliverableCategory = "Name is required";
	}
	if (!values.organization) {
		errors.organization = "Project is required";
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

let deliverableUnit: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		deliverableUnit = renderApollo(
			<DeliverableUnit
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
		let nameField = deliverableUnit.getByTestId("deliverableUnitName");
		expect(nameField).toBeInTheDocument();
	});
	test("should have a code field", () => {
		let codeField = deliverableUnit.getByTestId("deliverableUnitCode");
		expect(codeField).toBeInTheDocument();
	});

	test("should have a unit type field", () => {
		let unitTypeField = deliverableUnit.getByTestId("deliverableUnitUnitType");
		expect(unitTypeField).toBeInTheDocument();
	});

	test("should have a category field", () => {
		let categoryField = deliverableUnit.getByTestId("deliverableUnitCategory");
		expect(categoryField).toBeInTheDocument();
	});

	test("should have a prefix label field", () => {
		let prefixLabelField = deliverableUnit.getByTestId("deliverableUnitPrefixLabel");
		expect(prefixLabelField).toBeInTheDocument();
	});

	test("should have a suffix label field", () => {
		let suffixLabelField = deliverableUnit.getByTestId("deliverableUnitSuffixLabel");
		expect(suffixLabelField).toBeInTheDocument();
	});

	test("should have a description field", () => {
		let descriptionField = deliverableUnit.getByTestId("deliverableUnitDescription");
		expect(descriptionField).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let submitButton = deliverableUnit.getByTestId("deliverableUnitSubmit");
		expect(submitButton).toBeInTheDocument();
	});

	test("should have initial values", () => {
		let nameField = deliverableUnit.getByTestId("deliverableUnitNameInput") as HTMLInputElement;
		expect(nameField.value).toBe(intialFormValue.name);

		let codeField = deliverableUnit.getByTestId("deliverableUnitCodeInput") as HTMLInputElement;
		expect(codeField.value).toBe(intialFormValue.code);

		let categoryField = deliverableUnit.getByTestId(
			"deliverableUnitCategoryInput"
		) as HTMLInputElement;
		expect(Number(categoryField.value)).toBe(intialFormValue.deliverableCategory);

		let unitTypeField = deliverableUnit.getByTestId(
			"deliverableUnitUnitTypeInput"
		) as HTMLInputElement;
		expect(unitTypeField.value).toBe(intialFormValue.unit_type);

		let prefixLabelField = deliverableUnit.getByTestId(
			"deliverableUnitPrefixLabelInput"
		) as HTMLInputElement;
		expect(prefixLabelField.value).toBe(intialFormValue.prefix_label);

		let suffixLabelField = deliverableUnit.getByTestId(
			"deliverableUnitSuffixLabelInput"
		) as HTMLInputElement;
		expect(suffixLabelField.value).toBe(intialFormValue.suffix_label);

		let descriptionField = deliverableUnit.getByTestId(
			"deliverableUnitDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(intialFormValue.description);
	});

	test("Submit Button should be disabled if either of name,targetValue,category,unit fields is empty", async () => {
		let nameField = deliverableUnit.getByTestId("deliverableUnitNameInput") as HTMLInputElement;

		let unitTypeField = deliverableUnit.getByTestId(
			"deliverableUnitUnitTypeInput"
		) as HTMLInputElement;

		let categoryField = deliverableUnit.getByTestId(
			"deliverableUnitCategoryInput"
		) as HTMLInputElement;

		let prefixLabelField = deliverableUnit.getByTestId(
			"deliverableUnitPrefixLabelInput"
		) as HTMLInputElement;

		let suffixLabelField = deliverableUnit.getByTestId(
			"deliverableUnitSuffixLabelInput"
		) as HTMLInputElement;

		let value = "";

		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);

		act(() => {
			fireEvent.change(unitTypeField, { target: { value } });
		});
		expect(unitTypeField.value).toBe(value);

		act(() => {
			fireEvent.change(prefixLabelField, { target: { value } });
		});
		expect(prefixLabelField.value).toBe(value);

		act(() => {
			fireEvent.change(suffixLabelField, { target: { value } });
		});
		expect(suffixLabelField.value).toBe(value);

		let submitButton = await deliverableUnit.findByTestId(`deliverableUnitSubmit`);
		expect(submitButton).toBeDisabled();
	});
});
