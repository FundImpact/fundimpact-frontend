import React from "react";
import { renderApollo } from "../../../utils/test.util";
import { waitForElement } from "@testing-library/react";
import SideBar from "../SideBar";
import { GET_ORGANISATIONS } from "../../../graphql";
import { GET_WORKSPACES_BY_ORG } from "../../../graphql/index";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/index";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetail } from "../../../utils/testMock.json";
import { act } from "react-dom/test-utils";

let sidebar: any;

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

const ProjectMockOne = [
	{
		id: "1",
		name: "ARTISTAAN",
		workspace: { __typename: "Workspace", id: "5", name: "INSTAGRAM" },
	},
];
const ProjectMockTwo = [
	{
		id: "2",
		name: "KALAMKAAR",
		workspace: { __typename: "Workspace", id: "13", name: "FACEBOOK" },
	},
];

const mocks = [
	{
		request: { query: GET_ORGANISATIONS },
		result: { data: { organizationList: OrgMock } },
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
			query: GET_PROJECTS_BY_WORKSPACE,
			variables: { filter: { workspace: "5" } },
		},
		result: { data: { orgProject: ProjectMockOne } },
	},
	{
		request: {
			query: GET_PROJECTS_BY_WORKSPACE,
			variables: { filter: { workspace: "13" } },
		},
		result: { data: { orgProject: ProjectMockTwo } },
	},
];

beforeEach(() => {
	act(() => {
		sidebar = renderApollo(
			<DashboardProvider defaultState={{ organization: organizationDetail }}>
				<NotificationProvider>
					<SideBar />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("SideBar Component Graphql Calls and data listing", () => {
	test("renders correctly", async () => {
		await waitForElement(() => sidebar.getByText(/TSERIES/i));
		await waitForElement(() => sidebar.getByText(/INSTAGRAM/i));
		await waitForElement(() => sidebar.getByText(/FACEBOOK/i));
		await waitForElement(() => sidebar.getByText(/ARTISTAAN/i));
		await waitForElement(() => sidebar.getByText(/KALAMKAAR/i));
	});
});