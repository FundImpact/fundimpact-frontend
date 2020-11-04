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
import { GET_PROJECTS_BY_WORKSPACE, GET_WORKSPACES_BY_ORG } from "../../../../graphql";
import { organizationDetail } from "../../../../utils/testMock.json";

const getProjectMock = {
	id: "1",
	name: "KALAMKAAR",
	short_name: "KMK",
	description: "",
	workspace: {
		id: "1",
		name: "my workspace",
	},
	attachments: [],
};

const ProjectMockData = [
	{
		id: "1",
		name: "ARTISTAAN",
		workspace: { __typename: "Workspace", id: "5", name: "INSTAGRAM" },
	},
];

const WSMock = [
	{
		id: "5",
		name: "INSTAGRAM",
		short_name: "INSTA",
		description: "Instagram desc",
		organization: { __typename: "Organisation", id: "13", name: "TSERIES" },
	},
	{
		id: "13",
		name: "FACEBOOK",
		short_name: "FB",
		description: "Facebook desc",
		organization: { __typename: "Organisation", id: "13", name: "TSERIES" },
	},
];

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
			query: GET_PROJECTS_BY_WORKSPACE,
			variables: { filter: { workspace: "1" } },
		},
		result: { data: { orgProject: ProjectMockData } },
	},
	{
		request: {
			query: GET_WORKSPACES_BY_ORG,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { orgWorkspaces: WSMock } },
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
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetail }}
			>
				<NotificationProvider>
					<ProjectName />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
				addTypename: false,
			}
		);
	});
});

describe("Update Project text display and update", () => {
	test("Get Project query call and text match with fetched project name", async () => {
		await waitForElement(() => projectName.getByText(/KALAMKAAR/i));
	});
});
