import React from "react";
import DeliverableUnit from "../DeliverableUnit";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IDeliverableUnit } from "../../../models/deliverable/deliverableUnit";
import { DELIVERABLE_ACTIONS } from "../constants";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../graphql/Deliverable/category";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetail } from "../../../utils/testMock.json";
import { deliverableCategoryMock } from "./testHelp";
import { mockUserRoles } from "../../../utils/testMockUserRoles";
import { GET_USER_ROLES } from "../../../graphql/User/query";

const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: { filter: {} },
		},
		result: { data: { deliverableCategory: [] } },
	},
	{
    request: {
      query: GET_USER_ROLES,
      variables: {
        id: "1",
      },
    },
    result: { data: mockUserRoles },
  },
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
	},
];
let handleClose = jest.fn();
let deliverableUnit: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		deliverableUnit = renderApollo(
			<DashboardProvider defaultState={{ organization: organizationDetail }}>
				<NotificationProvider>
					<DeliverableUnit
						type={DELIVERABLE_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
						organization={2}
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

describe("Deliverable Target Form", () => {
	test("should have a name field", () => {
		let deliverableUnitName = deliverableUnit.getByTestId("deliverableUnitName");
		expect(deliverableUnitName).toBeInTheDocument();
	});
	test("should have a code field", () => {
		let deliverableUnitCode = deliverableUnit.getByTestId("deliverableUnitCode");
		expect(deliverableUnitCode).toBeInTheDocument();
	});

	// test("should have a unit type field", () => {
	// 	let deliverableUnitUnitType = deliverableUnit.getByTestId("deliverableUnitUnitType");
	// 	expect(deliverableUnitUnitType).toBeInTheDocument();
	// });

	test("should have a category field", () => {
		let deliverableUnitCategory = deliverableUnit.getByTestId("deliverableUnitCategory");
		expect(deliverableUnitCategory).toBeInTheDocument();
	});

	// test("should have a prefix label field", () => {
	// 	let deliverableUnitprefixLabel = deliverableUnit.getByTestId("deliverableUnitPrefixLabel");
	// 	expect(deliverableUnitprefixLabel).toBeInTheDocument();
	// });

	// test("should have a suffix label field", () => {
	// 	let deliverableUnitsuffixLabel = deliverableUnit.getByTestId("deliverableUnitSuffixLabel");
	// 	expect(deliverableUnitsuffixLabel).toBeInTheDocument();
	// });

	test("should have a description field", () => {
		let deliverableUnitDescription = deliverableUnit.getByTestId("deliverableUnitDescription");
		expect(deliverableUnitDescription).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let deliverableUnitSubmit = deliverableUnit.getByTestId("createSaveButton");
		expect(deliverableUnitSubmit).toBeInTheDocument();
	});

	// test("should have initial values", () => {
	// 	let deliverableUnitName = deliverableUnit.getByTestId(
	// 		"deliverableUnitNameInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableUnitName.value).toBe(intialFormValue.name);

	// 	let deliverableUnitCode = deliverableUnit.getByTestId(
	// 		"deliverableUnitCodeInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableUnitCode.value).toBe(intialFormValue.code);

	// 	let deliverableUnitCategory = deliverableUnit.getByTestId(
	// 		"deliverableUnitCategoryInput"
	// 	) as HTMLInputElement;
	// 	expect(Number(deliverableUnitCategory.value)).toBe(intialFormValue.deliverableCategory);

	// 	let deliverableUnitUnitType = deliverableUnit.getByTestId(
	// 		"deliverableUnitUnitTypeInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableUnitUnitType.value).toBe(intialFormValue.unit_type);

	// 	let deliverableUnitprefixLabel = deliverableUnit.getByTestId(
	// 		"deliverableUnitPrefixLabelInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableUnitprefixLabel.value).toBe(intialFormValue.prefix_label);

	// 	let deliverableUnitsuffixLabel = deliverableUnit.getByTestId(
	// 		"deliverableUnitSuffixLabelInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableUnitsuffixLabel.value).toBe(intialFormValue.suffix_label);

	// 	let deliverableUnitDescription = deliverableUnit.getByTestId(
	// 		"deliverableUnitDescriptionInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableUnitDescription.value).toBe(intialFormValue.description);
	// });

	test("Submit Button should be disabled if either of name,targetValue,category,unit fields is empty", async () => {
		let deliverableUnitName = deliverableUnit.getByTestId(
			"deliverableUnitNameInput"
		) as HTMLInputElement;

		// let deliverableUnitUnitType = deliverableUnit.getByTestId(
		// 	"deliverableUnitUnitTypeInput"
		// ) as HTMLInputElement;

		let deliverableUnitCategory = deliverableUnit.getByTestId(
			"deliverableUnitCategoryInput"
		) as HTMLInputElement;

		// let deliverableUnitprefixLabel = deliverableUnit.getByTestId(
		// 	"deliverableUnitPrefixLabelInput"
		// ) as HTMLInputElement;

		// let deliverableUnitsuffixLabel = deliverableUnit.getByTestId(
		// 	"deliverableUnitSuffixLabelInput"
		// ) as HTMLInputElement;

		let value = "";

		act(() => {
			fireEvent.change(deliverableUnitName, { target: { value } });
		});
		expect(deliverableUnitName.value).toBe(value);

		// act(() => {
		// 	fireEvent.change(deliverableUnitUnitType, { target: { value } });
		// });
		// expect(deliverableUnitUnitType.value).toBe(value);

		// act(() => {
		// 	fireEvent.change(deliverableUnitprefixLabel, { target: { value } });
		// });
		// expect(deliverableUnitprefixLabel.value).toBe(value);

		// act(() => {
		// 	fireEvent.change(deliverableUnitsuffixLabel, { target: { value } });
		// });
		// expect(deliverableUnitsuffixLabel.value).toBe(value);

		let deliverableUnitSubmit = await deliverableUnit.findByTestId(`createSaveButton`);
		expect(deliverableUnitSubmit).toBeDisabled();
	});
});
