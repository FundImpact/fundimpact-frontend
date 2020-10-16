import React from "react";
import { renderApollo } from "../../../../utils/test.util";
import { waitForElement, fireEvent, wait } from "@testing-library/react";
import ProjectName from "../ProjectName";
import { GET_PROJECT_BY_ID, UPDATE_PROJECT } from "../../../../graphql/project";
import { act } from "react-dom/test-utils";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { projectDetails } from "../../../../utils/testMock.json";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";

const getProjectMock = {
	__typename: "Project",
	id: "1",
	name: "KALAMKAAR",
	short_name: "KMK",
	description: "",
};

let updateProjectMutation = false;

const mocks = [
	{
		request: {
			query: GET_PROJECT_BY_ID,
			variables: { id: 3 },
		},
		result: { data: { project: getProjectMock } },
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
			query: UPDATE_PROJECT,
			variables: {
				id: 3,
				input: { name: "ARTISTAAN", short_name: "KMK", description: "" },
			},
		},
		result: () => {
			updateProjectMutation = true;
			return {};
		},
	},
];
let projectName: any;
beforeEach(() => {
	act(() => {
		projectName = renderApollo(
			<DashboardProvider defaultState={{ project: projectDetails }}>
				<NotificationProvider>
					<ProjectName />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Update Project text display and update", () => {
	test("Get Project query call and text match with fetched project name", async () => {
		await waitForElement(() => projectName.getByText(/KALAMKAAR/i));
	});

	test("Edit and Save Button Calls and Update Query Call", async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		const editButton = projectName.getByTestId("editable-edit");
		fireEvent.click(editButton);

		let inputField = projectName.getByTestId("editable-input") as HTMLInputElement;
		let value = "ARTISTAAN";
		act(() => {
			fireEvent.change(inputField, { target: { value } });
		});

		const saveButton = projectName.getByTestId("editable-save");
		fireEvent.click(saveButton);

		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(updateProjectMutation).toBe(true);
	});
});
