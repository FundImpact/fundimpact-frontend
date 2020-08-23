import React from "react";
import ImpactTarget from "../impactTarget";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import { IImpactTarget } from "../../../models/impact/impactTarget";
import { IMPACT_ACTIONS } from "../constants";
import { GET_IMPACT_CATEGORY } from "../../../graphql/queries/Impact/category";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetails } from "../../../utils/testMock.json";

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
			<DashboardProvider defaultState={{ organization: organizationDetails }}>
				<NotificationProvider>
					<ImpactTarget
						type={IMPACT_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
						project={1}
					/>
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Impact Target Form", () => {
	test("should have a name field", () => {
		let impactTargetName = impactTarget.getByTestId("impactTargetName");
		expect(impactTargetName).toBeInTheDocument();
	});
	test("should have a target Value field", () => {
		let impactTargetTargetValue = impactTarget.getByTestId("impactTargetTargetValue");
		expect(impactTargetTargetValue).toBeInTheDocument();
	});
	test("should have a category field", () => {
		let impactTargetCategory = impactTarget.getByTestId("impactTargetCategory");
		expect(impactTargetCategory).toBeInTheDocument();
	});
	test("should have a unit field", () => {
		let impactTargetUnit = impactTarget.getByTestId("impactTargetUnit");
		expect(impactTargetUnit).toBeInTheDocument();
	});
	test("should have a description field", () => {
		let impacttargetDescription = impactTarget.getByTestId("impactTargetDescription");
		expect(impacttargetDescription).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let submitButton = impactTarget.getByTestId("createSaveButton");
		expect(submitButton).toBeInTheDocument();
	});

	test("should have initial values", () => {
		let impactTargetName = impactTarget.getByTestId(
			"impactTargetNameInput"
		) as HTMLInputElement;
		expect(impactTargetName.value).toBe(intialFormValue.name);

		let impactTargetTargetValue = impactTarget.getByTestId(
			"impactTargetTargetValueInput"
		) as HTMLInputElement;
		expect(impactTargetTargetValue.value).toBe(intialFormValue.target_value);

		let impactTargetCategory = impactTarget.getByTestId(
			"impactTargetCategoryInput"
		) as HTMLInputElement;
		expect(impactTargetCategory.value).toBe(intialFormValue.impactCategory);

		let impactTargetUnit = impactTarget.getByTestId(
			"impactTargetUnitInput"
		) as HTMLInputElement;
		expect(impactTargetUnit.value).toBe(intialFormValue.impactUnit);

		let impacttargetDescription = impactTarget.getByTestId(
			"impactTargetDescriptionInput"
		) as HTMLInputElement;
		expect(impacttargetDescription.value).toBe(intialFormValue.description);
	});

	test("Submit Button should be disabled if either of name,targetValue,category,unit fields is empty", async () => {
		let impactTargetName = impactTarget.getByTestId(
			"impactTargetNameInput"
		) as HTMLInputElement;

		let impactTargetTargetValue = impactTarget.getByTestId(
			"impactTargetTargetValueInput"
		) as HTMLInputElement;

		let impactTargetCategory = impactTarget.getByTestId(
			"impactTargetCategoryInput"
		) as HTMLInputElement;

		let impactTargetUnit = impactTarget.getByTestId(
			"impactTargetUnitInput"
		) as HTMLInputElement;

		let value = "";

		act(() => {
			fireEvent.change(impactTargetName, { target: { value } });
		});
		expect(impactTargetName.value).toBe(value);

		act(() => {
			fireEvent.change(impactTargetTargetValue, { target: { value } });
		});
		expect(impactTargetTargetValue.value).toBe(value);

		act(() => {
			fireEvent.change(impactTargetCategory, { target: { value } });
		});
		expect(impactTargetCategory.value).toBe(value);

		act(() => {
			fireEvent.change(impactTargetUnit, { target: { value } });
		});

		expect(impactTargetUnit.value).toBe(value);

		let submitButton = await impactTarget.findByTestId(`createSaveButton`);
		expect(submitButton).toBeDisabled();
	});
});