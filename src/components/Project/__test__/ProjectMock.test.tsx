import React from "react";
import { renderApollo } from "../../../utils/test.util";
import { fireEvent } from "@testing-library/react";
import Project from "../Project";
import { CREATE_PROJECT } from "../../../graphql/queries/project/";
import { GET_ORGANISATIONS } from "../../../graphql/queries/index";
import { act } from "react-dom/test-utils";
import { PROJECT_ACTIONS } from "../constants";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";

let ProjectMutation = false;
const OrgMock = [
	{
		__typename: "OrganizationList",
		id: "13",
		name: "TSERIES",
		short_name: "TS",
		organization_registration_type: {
			__typename: "OrganizationRegistrationType",
			id: "1",
			reg_type: "Trusts",
		},
		account: { __typename: "Account", id: "2", name: "rahul@gmail.com" },
	},
];

const mocks = [
	{
		request: {
			query: CREATE_PROJECT,
			variables: {
				input: { name: "ARTISTAAN", short_name: "", description: "", workspace: "1" },
			},
		},
		result: () => {
			ProjectMutation = true;
			return {};
		},
	},
	{
		request: { query: GET_ORGANISATIONS },
		result: { data: { organizationList: OrgMock } },
	},
];

let handleClose = jest.fn();
let project: any;

beforeEach(() => {
	act(() => {
		project = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<Project
						type={PROJECT_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
						workspaces={[{ id: "1", name: "XYZ" }]}
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

describe("Project Component", () => {
	test("should have a name field", () => {
		let nameField = project.getByTestId("createProjectName");
		expect(nameField).toBeInTheDocument();
	});
	test("should have a short-name field", () => {
		let shortNameField = project.getByTestId("createProjectShortName");
		expect(shortNameField).toBeInTheDocument();
	});
	test("should have a workspace field", () => {
		let workspacefield = project.getByTestId("createProjectWorkspace");
		expect(workspacefield).toBeInTheDocument();
	});

	test("should have a description field", () => {
		let descriptionField = project.getByTestId("createProjectDescription");
		expect(descriptionField).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let submitButton = project.getByTestId("createSaveButton");
		expect(submitButton).toBeInTheDocument();
	});

	test("Submit Button should be disabled if name field is empty", async () => {
		let nameField = project.getByTestId("createProjectNameInput") as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let submitButton = await project.findByTestId(`createSaveButton`);
		expect(submitButton).toBeDisabled();
	});
	test("GraphQL Call on submit button", async () => {
		let nameField = project.getByTestId("createProjectNameInput") as HTMLInputElement;
		let value = "ARTISTAAN";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let submitButton = await project.findByTestId(`createSaveButton`);
		expect(submitButton).toBeEnabled();

		act(() => {
			fireEvent.click(submitButton);
		});

		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(ProjectMutation).toBe(true);
	});
});
