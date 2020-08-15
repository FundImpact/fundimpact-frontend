import React from "react";
import { renderApollo } from "../../../utils/test.util";
import { fireEvent } from "@testing-library/react";
import Deliverable from "../Deliverable";
import { CREATE_DELIVERABLE_CATEGORY } from "../../../graphql/queries/Deliverable/category";
import { act } from "react-dom/test-utils";
import { DELIVERABLE_ACTIONS } from "../constants";

let Mutation = false;
const mocks = [
	{
		request: {
			query: CREATE_DELIVERABLE_CATEGORY,
			variables: {
				input: { name: "SONG", code: "", description: "", organization: 2 }, // TODO change according to current organization
			},
		},
		result: () => {
			Mutation = true;
			return {};
		},
	},
];

let handleClose = jest.fn();
let project: any;

beforeEach(() => {
	act(() => {
		project = renderApollo(
			<Deliverable type={DELIVERABLE_ACTIONS.CREATE} open={true} handleClose={handleClose} />,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Deliverable Component", () => {
	test("GraphQL Call on submit button", async () => {
		let nameField = project.getByTestId("deliverableFormNameInput") as HTMLInputElement;
		let value = "SONG";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let submitButton = await project.findByTestId(`deliverableFormSubmit`);
		expect(submitButton).toBeEnabled();
		act(() => {
			fireEvent.click(submitButton);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(Mutation).toBe(true);
	});
});
