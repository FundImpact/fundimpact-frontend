import React from "react";
import ImpactTarget from "../impactTarget";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "../../../Deliverable/__test__/__test__/node_modules/@testing-library/jest-dom/extend-expect";
import { IImpactTarget } from "../../../models/impact/impactTarget";
import { IMPACT_ACTIONS } from "../constants";
import { GET_IMPACT_CATEGORY } from "../../../graphql/queries/Impact/category";
import { renderApollo } from "../../../utils/test.util";
const intialFormValue: IImpactTarget = {
	name: "Impact TARGET",
	description: "This is a sample Impact TARGET",
	target_value: "",
	impactCategory: "",
	impactUnit: "",
	impact_category_unit: "",
	project: 4,
};
const onCreateMock = jest.fn();
const onUpdateMock = jest.fn();
const clearErrors = jest.fn();
const handleFormOpen = jest.fn();
const formIsOpen = true;
const validate = jest.fn((values: IImpactTarget) => {
	let errors: Partial<IImpactTarget> = {};
	if (!values.name && !values.name.length) {
		errors.name = "Name is required";
	}
	if (!values.project) {
		errors.project = "Project is required";
	}
	if (!values.impactCategory) {
		errors.impactCategory = "impact Category is required";
	}
	if (!values.impactUnit) {
		errors.impactUnit = "impact Unit is required";
	}
	if (!values.target_value) {
		errors.name = "Target value is required";
	}
	return errors;
});

const formState = IMPACT_ACTIONS.CREATE;

const categoryMock = [
	{ id: 1, name: "SONG" },
	{ id: 2, name: "SONG" },
];
const mocks = [
	{
		request: {
			query: GET_IMPACT_CATEGORY,
		},
		result: { data: { impactCategoryOrgList: categoryMock } },
	},
];

let impactTarget: RenderResult<typeof queries>;
let handleClose = jest.fn();

beforeEach(() => {
	act(() => {
		impactTarget = renderApollo(
			<ImpactTarget type={IMPACT_ACTIONS.CREATE} open={true} handleClose={handleClose} />,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Impact Target Form", () => {
	test("should have a name field", () => {
		let nameField = impactTarget.getByTestId("impactTargetName");
		expect(nameField).toBeInTheDocument();
	});
	test("should have a target Value field", () => {
		let targetValueField = impactTarget.getByTestId("impactTargetTargetValue");
		expect(targetValueField).toBeInTheDocument();
	});
	test("should have a category field", () => {
		let categoryField = impactTarget.getByTestId("impactTargetCategory");
		expect(categoryField).toBeInTheDocument();
	});
	test("should have a unit field", () => {
		let unitField = impactTarget.getByTestId("impactTargetUnit");
		expect(unitField).toBeInTheDocument();
	});
	test("should have a description field", () => {
		let descriptionField = impactTarget.getByTestId("impactTargetDescription");
		expect(descriptionField).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let submitButton = impactTarget.getByTestId("impactTargetSubmit");
		expect(submitButton).toBeInTheDocument();
	});

	test("should have initial values", () => {
		let nameField = impactTarget.getByTestId("impactTargetNameInput") as HTMLInputElement;
		expect(nameField.value).toBe(intialFormValue.name);

		let targetValueField = impactTarget.getByTestId(
			"impactTargetTargetValueInput"
		) as HTMLInputElement;
		expect(targetValueField.value).toBe(intialFormValue.target_value);

		let categoryField = impactTarget.getByTestId(
			"impactTargetCategoryInput"
		) as HTMLInputElement;
		expect(categoryField.value).toBe(intialFormValue.impactCategory);

		let unitField = impactTarget.getByTestId("impactTargetUnitInput") as HTMLInputElement;
		expect(unitField.value).toBe(intialFormValue.impactUnit);

		let descriptionField = impactTarget.getByTestId(
			"impactTargetDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(intialFormValue.description);
	});

	test("Submit Button should be disabled if either of name,targetValue,category,unit fields is empty", async () => {
		let nameField = impactTarget.getByTestId("impactTargetNameInput") as HTMLInputElement;

		let targetValueField = impactTarget.getByTestId(
			"impactTargetTargetValueInput"
		) as HTMLInputElement;

		let categoryField = impactTarget.getByTestId(
			"impactTargetCategoryInput"
		) as HTMLInputElement;

		let unitField = impactTarget.getByTestId("impactTargetUnitInput") as HTMLInputElement;

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

		let submitButton = await impactTarget.findByTestId(`impactTargetSubmit`);
		expect(submitButton).toBeDisabled();
	});
});
