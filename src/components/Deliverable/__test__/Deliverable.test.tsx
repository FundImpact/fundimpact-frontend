import React from "react";
import DeliverableForm from "../Deliverable";
import { act, fireEvent, queries, wait, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DELIVERABLE_ACTIONS } from "../constants";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetail } from "../../../utils/testMock.json";
import {
	CREATE_DELIVERABLE_CATEGORY,
	GET_DELIVERABLE_ORG_CATEGORY,
} from "../../../graphql/Deliverable/category";
import { deliverableCategoryMock } from "./testHelp";
import { mockUserRoles } from "../../../utils/testMockUserRoles";
import { GET_USER_ROLES } from "../../../graphql/User/query";
let deliverableMutation = false;

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
		result: { data: { impactCategoryOrgList: deliverableCategoryMock } },
	},
];

// const intialFormValue: IDeliverable = {
// 	name: "",
// 	code: "",
// 	description: "",
// 	organization: 2,
// };

let handleClose = jest.fn();
let deliverableForm: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
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
	});
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

	// test("should have initial values", () => {
	// 	let deliverableName = deliverableForm.getByTestId(
	// 		"deliverableFormNameInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableName.value).toBe(intialFormValue.name);

	// 	let deliverableCode = deliverableForm.getByTestId(
	// 		"deliverableFormCodeInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableCode.value).toBe(intialFormValue.code);

	// 	let deliverableDescription = deliverableForm.getByTestId(
	// 		"deliverableFormDescriptionInput"
	// 	) as HTMLInputElement;
	// 	expect(deliverableDescription.value).toBe(intialFormValue.description);
	// });

	test("Submit Button should be disabled if name field is empty", async () => {
		let deliverableName = deliverableForm.getByTestId(
			"deliverableFormNameInput"
		) as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(deliverableName, { target: { value } });
		});
		expect(deliverableName.value).toBe(value);
		let deliverableSubmit = await deliverableForm.findByTestId(`createSaveButton`);
		expect(deliverableSubmit).toBeDisabled();
	});
	test("Deliverable Categoty GraphQL Call on submit button", async () => {
		let deliverableCategoryName = deliverableForm.getByTestId(
			"deliverableFormNameInput"
		) as HTMLInputElement;
		let value = "SONG";
		act(() => {
			fireEvent.change(deliverableCategoryName, { target: { value } });
		});
		expect(deliverableCategoryName.value).toBe(value);
		let deliverableCategorySubmit = await deliverableForm.findByTestId(`createSaveButton`);
		expect(deliverableCategorySubmit).toBeEnabled();
		act(() => {
			fireEvent.click(deliverableCategorySubmit);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(deliverableMutation).toBe(true);
	});
});
