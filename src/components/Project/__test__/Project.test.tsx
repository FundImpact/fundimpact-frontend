import React from "react";
import { renderApollo } from "../../../utils/test.util";
import { fireEvent } from "@testing-library/react";
import Project from "../Project";
import { CREATE_PROJECT } from "../../../graphql/queries/project";
import { act } from "react-dom/test-utils";
import { PROJECT_ACTIONS } from "../constants";

let ProjectMutation = false;
const mocks = [
	{
		request: {
			query: CREATE_PROJECT,
			variables: {
				input: { name: "ARTISTAAN", short_name: "", description: "", workspace: 1 },
			},
		},
		result: () => {
			ProjectMutation = true;
			return {};
		},
	},
];

let handleClose = jest.fn();
let project: any;

beforeEach(() => {
	act(() => {
		project = renderApollo(
			<Project
				type={PROJECT_ACTIONS.CREATE}
				open={true}
				handleClose={handleClose}
				workspaces={[{ id: 1, name: "XYZ" }]}
			/>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Project Component", () => {
	test("GraphQL Call on submit button", async () => {
		let nameField = project.getByTestId("createProjectNameInput") as HTMLInputElement;
		let value = "ARTISTAAN";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let submitButton = await project.findByTestId(`createProjectSubmit`);
		expect(submitButton).toBeEnabled();

		act(() => {
			fireEvent.click(submitButton);
		});

		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(ProjectMutation).toBe(true);
	});
});
