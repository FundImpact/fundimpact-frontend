import React from "react";
import DeliverableTarget from "../DeliverableTarget";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IDeliverableTarget } from "../../../models/deliverable/deliverableTarget";
import { DELIVERABLE_ACTIONS } from "../constants";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../graphql/queries/Deliverable/category";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetails } from "../../../utils/testMock.json";

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
let handleClose = jest.fn();
let deliverableTarget: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		deliverableTarget = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<DeliverableTarget
						type={DELIVERABLE_ACTIONS.CREATE}
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

describe("Deliverable Target Form", () => {
	test("should have a name field", () => {
		let deliverableTargetName = deliverableTarget.getByTestId("deliverableTargetName");
		expect(deliverableTargetName).toBeInTheDocument();
	});
	test("should have a target Value field", () => {
		let deliverableTargetTargetValue = deliverableTarget.getByTestId(
			"deliverableTargetTargetValue"
		);
		expect(deliverableTargetTargetValue).toBeInTheDocument();
	});
	test("should have a category field", () => {
		let deliverableTargetCategory = deliverableTarget.getByTestId("deliverableTargetCategory");
		expect(deliverableTargetCategory).toBeInTheDocument();
	});
	test("should have a unit field", () => {
		let deliverableTargetUnit = deliverableTarget.getByTestId("deliverableTargetUnit");
		expect(deliverableTargetUnit).toBeInTheDocument();
	});
	test("should have a description field", () => {
		let deliverableTargetDescription = deliverableTarget.getByTestId(
			"deliverableTargetDescription"
		);
		expect(deliverableTargetDescription).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let deliverableTargetSubmit = deliverableTarget.getByTestId("createSaveButton");
		expect(deliverableTargetSubmit).toBeInTheDocument();
	});

	// test("should have initial values", () => {
	// 	let deliverableTargetName = deliverableTarget.getByTestId(
	// 		"deliverableTargetNameInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableTargetName.value).toBe(intialFormValue.name);

	// 	let deliverableTargetTargetValue = deliverableTarget.getByTestId(
	// 		"deliverableTargetTargetValueInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableTargetTargetValue.value).toBe(intialFormValue.target_value);

	// 	let deliverableTargetCategory = deliverableTarget.getByTestId(
	// 		"deliverableTargetCategoryInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableTargetCategory.value).toBe(intialFormValue.deliverableCategory);

	// 	let deliverableTargetUnit = deliverableTarget.getByTestId(
	// 		"deliverableTargetUnitInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableTargetUnit.value).toBe(intialFormValue.deliverableUnit);

	// 	let deliverableTargetDescription = deliverableTarget.getByTestId(
	// 		"deliverableTargetDescriptionInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableTargetDescription.value).toBe(intialFormValue.description);
	// });

	test("Submit Button should be disabled if either of name,targetValue,category,unit fields is empty", async () => {
		let deliverableTargetName = deliverableTarget.getByTestId(
			"deliverableTargetNameInput"
		) as HTMLInputElement;

		let deliverableTargetTargetValue = deliverableTarget.getByTestId(
			"deliverableTargetTargetValueInput"
		) as HTMLInputElement;

		let deliverableTargetCategory = deliverableTarget.getByTestId(
			"deliverableTargetCategoryInput"
		) as HTMLInputElement;

		let deliverableTargetUnit = deliverableTarget.getByTestId(
			"deliverableTargetUnitInput"
		) as HTMLInputElement;

		let value = "";

		act(() => {
			fireEvent.change(deliverableTargetName, { target: { value } });
		});
		expect(deliverableTargetName.value).toBe(value);

		act(() => {
			fireEvent.change(deliverableTargetTargetValue, { target: { value } });
		});
		expect(deliverableTargetTargetValue.value).toBe(value);

		act(() => {
			fireEvent.change(deliverableTargetCategory, { target: { value } });
		});
		expect(deliverableTargetCategory.value).toBe(value);

		act(() => {
			fireEvent.change(deliverableTargetUnit, { target: { value } });
		});

		expect(deliverableTargetUnit.value).toBe(value);

		let deliverableTargetSubmit = await deliverableTarget.findByTestId(`createSaveButton`);
		expect(deliverableTargetSubmit).toBeDisabled();
	});
});
