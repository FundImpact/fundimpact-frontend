import React from "react";
import DeliverableForm from "../Deliverable";
import { fireEvent, queries, wait, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DELIVERABLE_ACTIONS } from "../constants";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import {
	CREATE_DELIVERABLE_CATEGORY,
	GET_DELIVERABLE_ORG_CATEGORY,
} from "../../../graphql/Deliverable/category";
import { deliverableCategoryMock } from "./testHelp";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";
let deliverableMutation = false;

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

const mocks = [
	{
		request: {
			query: CREATE_DELIVERABLE_CATEGORY,
			variables: {
				input: { name: "SONG", code: "", description: "", organization: "13" }, // TODO change according to current organization
			},
		},
		result: () => {
			deliverableMutation = true;
			return {};
		},
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
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { impactCategoryOrgList: deliverableCategoryMock } },
	},
];

let handleClose = jest.fn();
let deliverableForm: RenderResult<typeof queries>;

beforeEach(async () => {
	deliverableForm = renderApollo(
		<DashboardProvider>
			<NotificationProvider>
				<DeliverableForm
					type={DELIVERABLE_ACTIONS.CREATE}
					open={true}
					handleClose={handleClose}
					organization={"13"}
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

describe("Create Deliverable Form", () => {
	test("should have a name field", () => {
		let deliverableName = deliverableForm.getByTestId("deliverableFormName");
		expect(deliverableName).toBeInTheDocument();
	});
	test("should have a code field", () => {
		let deliverableCode = deliverableForm.getByTestId("deliverableFormCode");
		expect(deliverableCode).toBeInTheDocument();
	});

	test("should have a description field", () => {
		let deliverableDescription = deliverableForm.getByTestId("deliverableFormDescription");
		expect(deliverableDescription).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let deliverableSubmit = deliverableForm.getByTestId("createSaveButton");
		expect(deliverableSubmit).toBeInTheDocument();
	});

	test("Submit Button should be disabled if name field is empty", async () => {
		let deliverableName = deliverableForm.getByTestId(
			"deliverableFormNameInput"
		) as HTMLInputElement;
		let value = "";
		fireEvent.change(deliverableName, { target: { value } });
		await wait(() => {
			expect(deliverableName.value).toBe(value);
		});
		let deliverableSubmit = deliverableForm.getByTestId(`createSaveButton`);
		await wait(() => {
			expect(deliverableSubmit).toBeDisabled();
		});
	});
	test("Deliverable Categoty GraphQL Call on submit button", async () => {
		let deliverableCategoryName = deliverableForm.getByTestId(
			"deliverableFormNameInput"
		) as HTMLInputElement;
		let value = "SONG";
		fireEvent.change(deliverableCategoryName, { target: { value } });
		await wait(() => {
			expect(deliverableCategoryName).toHaveValue(value);
		});
		let deliverableCategorySubmit = deliverableForm.getByTestId(`createSaveButton`);
		await wait(() => {
			expect(deliverableCategorySubmit).toBeEnabled();
		});
		fireEvent.click(deliverableCategorySubmit);
		await wait(() => {
			expect(deliverableMutation).toBe(true);
		});
	});
});
