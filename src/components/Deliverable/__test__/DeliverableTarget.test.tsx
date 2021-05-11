import "@testing-library/jest-dom/extend-expect";

import { act, fireEvent, wait } from "@testing-library/react";
import React from "react";

import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../graphql/Deliverable/category";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import {
	CREATE_DELIVERABLE_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
} from "../../../graphql/Deliverable/target";
import { renderApollo } from "../../../utils/test.util";
import { organizationDetail } from "../../../utils/testMock.json";
import { DELIVERABLE_ACTIONS } from "../constants";
import DeliverableTarget from "../DeliverableTarget";
import {
	deliverableCategoryMock,
	deliverableCategoryUnitListMock,
	projectsMock,
	deliverableUnitMock,
} from "./testHelp";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { GET_DELIVERABLE_UNIT_BY_ORG } from "../../../graphql/Deliverable/unit";

let consoleWarnSpy: undefined | jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

beforeAll(() => {
	consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation((msg) => {
		!msg.includes(
			"isInitialValid has been deprecated and will be removed in future versions of Formik."
		) && console.warn(msg);
	});
});

afterAll(() => {
	consoleWarnSpy?.mockRestore();
});

let createDeliverableTargetMutation = false;
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
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_UNIT_BY_ORG,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { deliverableUnitOrg: deliverableUnitMock } },
	},
	{
		request: {
			query: GET_CATEGORY_UNIT,
			variables: { deliverable_category_org: "1" },
		},
		result: { data: { deliverableCategoryUnitList: deliverableCategoryUnitListMock } },
	},
	{
		request: {
			query: GET_USER_ROLES,
			variables: {
				filter: {
					role: "1",
				},
			},
		},
		result: { data: mockUserRoles },
	},
	{
		request: {
			query: GET_CATEGORY_UNIT,
			variables: { deliverable_category_org: "1", deliverable_units_org: "1" },
		},
		result: { data: { deliverableCategoryUnitList: deliverableCategoryUnitListMock } },
	},
	{
		request: {
			query: CREATE_DELIVERABLE_TARGET,
			variables: {
				input: {
					name: "DeliverableTarget",
					description: "note",
					target_value: 5000,
					deliverable_category_org: "1",
					deliverable_unit_org: "1",
					project: 2,
				},
			},
		},
		result: () => {
			createDeliverableTargetMutation = true;
			return {};
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: { filter: { project: 2 } },
		},
	},
];
let handleClose = jest.fn();
let deliverableTarget: any;

beforeEach(async () => {
	deliverableTarget = renderApollo(
		<DashboardProvider
			defaultState={{ organization: organizationDetail, project: projectsMock }}
		>
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
	await wait();
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

		fireEvent.change(deliverableTargetName, { target: { value } });
		await wait(() => {
			expect(deliverableTargetName.value).toBe(value);
		});

		fireEvent.change(deliverableTargetTargetValue, { target: { value } });
		await wait(() => {
			expect(deliverableTargetTargetValue.value).toBe(value);
		});

		fireEvent.change(deliverableTargetCategory, { target: { value } });
		await wait(() => {
			expect(deliverableTargetCategory.value).toBe(value);
		});

		fireEvent.change(deliverableTargetUnit, { target: { value } });
		await wait(() => {
			expect(deliverableTargetUnit.value).toBe(value);
		});

		let deliverableTargetSubmit = await deliverableTarget.findByTestId(`createSaveButton`);
		await wait(() => {
			expect(deliverableTargetSubmit).toBeDisabled();
		});
	});

	// test("Deliverable Target GraphQL Call on submit button", async () => {
	// 	let deliverableTargetName = deliverableTarget.getByTestId(
	// 		"deliverableTargetNameInput"
	// 	) as HTMLInputElement;

	// 	let deliverableTargetTargetValue = deliverableTarget.getByTestId(
	// 		"deliverableTargetTargetValueInput"
	// 	) as HTMLInputElement;

	// 	let deliverableTargetCategory = deliverableTarget.getByTestId(
	// 		"deliverableTargetCategoryInput"
	// 	) as HTMLInputElement;

	// 	let deliverableTargetUnit = deliverableTarget.getByTestId(
	// 		"deliverableTargetUnitInput"
	// 	) as HTMLInputElement;

	// 	let deliverableTargetDescription = deliverableTarget.getByTestId(
	// 		"deliverableTargetDescriptionInput"
	// 	) as HTMLInputElement;

	// 	act(() => {
	// 		fireEvent.change(deliverableTargetName, {
	// 			target: { value: "DeliverableTarget" },
	// 		});
	// 	});
	// 	expect(deliverableTargetName.value).toBe("DeliverableTarget");

	// 	act(() => {
	// 		fireEvent.change(deliverableTargetTargetValue, { target: { value: "5000" } });
	// 	});
	// 	expect(deliverableTargetTargetValue.value).toBe("5000");

	// 	act(() => {
	// 		fireEvent.change(deliverableTargetDescription, { target: { value: "note" } });
	// 	});
	// 	expect(deliverableTargetDescription.value).toBe("note");

	// 	act(() => {
	// 		deliverableTarget.instance().setCurrentCategory(deliverableCategoryMock[0].id);
	// 		fireEvent.change(deliverableTargetCategory, {
	// 			target: { value: deliverableCategoryMock[0].id },
	// 		});
	// 	});
	// 	expect(deliverableTargetCategory.value).toBe(deliverableCategoryMock[0].id);
	// 	await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response for units
	// 	act(() => {
	// 		fireEvent.change(deliverableTargetUnit, {
	// 			target: { value: deliverableCategoryUnitListMock[0].deliverable_units_org.id },
	// 		});
	// 	});
	// 	expect(deliverableTargetUnit.value).toBe(
	// 		deliverableCategoryUnitListMock[0].deliverable_units_org.id
	// 	);
	// 	let deliverableTracklineSubmit = await deliverableTarget.findByTestId(`createSaveButton`);
	// 	expect(deliverableTracklineSubmit).toBeEnabled();
	// 	act(() => {
	// 		fireEvent.click(deliverableTracklineSubmit);
	// 	});
	// 	await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
	// 	expect(createDeliverableTargetMutation).toBe(true);
	// });
});
