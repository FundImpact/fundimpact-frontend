import React from "react";
import { renderApollo } from "../../../utils/test.util";
import { waitForElement } from "@testing-library/react";
import SideBar from "../SideBar";
import { GET_ORGANISATIONS, GET_COUNTRY_LIST, GET_PROJECTS } from "../../../graphql";
import { GET_WORKSPACES_BY_ORG } from "../../../graphql/index";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/index";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetail, mockOrgDonor } from "../../../utils/testMock.json";
import { act } from "react-dom/test-utils";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { BrowserRouter } from "react-router-dom";
import { GET_PROJ_DONORS } from "../../../graphql/project";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { mockCountryList } from "../../../utils/testMock.json";

let sidebar: any;

const OrgMock = {
	id: "13",
	name: "TSERIES",
	short_name: "TS",
	legal_name: "sh legal detective",
	organization_registration_type: {
		id: "1",
		reg_type: "Trusts",
	},
	currency: {
		id: "1",
	},
	country: {
		id: "1",
		name: "India",
	},
	account: {
		id: "2",
		name: "rahul@gmail.com",
	},
	logo: {
		id: "1",
		url: "",
	},
	theme: {},
};
const WSMock = [
	{
		id: "5",
		name: "INSTAGRAM",
		short_name: "INSTA",
		description: "Instagram desc",
		organization: { __typename: "Organization", id: "13", name: "TSERIES" },
	},
	{
		id: "13",
		name: "FACEBOOK",
		short_name: "FB",
		description: "Facebook desc",
		organization: { __typename: "Organization", id: "13", name: "TSERIES" },
	},
];

const ProjectMockOne = [
	{
		id: "1",
		name: "ARTISTAAN",
		short_name: "",
		description: "",
		attachments: [],
		workspace: { __typename: "Workspace", id: "5", name: "INSTAGRAM" },
		deleted: false,
	},
];
const ProjectMockTwo = [
	{
		id: "2",
		name: "KALAMKAAR",
		short_name: "",
		description: "",
		attachments: [],
		workspace: { __typename: "Workspace", id: "13", name: "FACEBOOK" },
		deleted: false,
	},
];

const projDonorsMock = [
	{
		id: "244",
		project: {
			id: "1",
			name: "ARTISTAAN",
		},
		donor: {
			id: "23",
			name: "wer",
			deleted: false,
		},
		deleted: false,
	},
];
const mocks = [
	{
		request: {
			query: GET_WORKSPACES_BY_ORG,
			variables: {
				sort: "name:ASC",
				filter: { organization: "13" },
			},
		},
		result: { data: { orgWorkspaces: WSMock } },
	},
	{
		request: {
			query: GET_WORKSPACES_BY_ORG,
			variables: {
				sort: "name:ASC",
				filter: { organization: "13" },
			},
		},
		result: { data: { orgWorkspaces: WSMock } },
	},
	{
		request: {
			query: GET_WORKSPACES_BY_ORG,
			variables: {
				sort: "name:ASC",
				filter: { organization: "13" },
			},
		},
		result: { data: { orgWorkspaces: WSMock } },
	},
	{
		request: {
			query: GET_WORKSPACES_BY_ORG,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { orgWorkspaces: WSMock } },
	},
	{
		request: { query: GET_ORGANISATIONS, variables: { id: "13" } },
		result: {
			data: {
				organization: OrgMock,
			},
		},
	},
	{
		request: {
			query: GET_PROJECTS,
		},
		result: {
			data: {
				orgProject: [
					{
						id: "1",
						name: "ARTISTAAN",
						workspace: { __typename: "Workspace", id: "5", name: "INSTAGRAM" },
						deleted: false,
					},
				],
			},
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
			query: GET_PROJECTS_BY_WORKSPACE,
			variables: { sort: "name:ASC", filter: { workspace: "5" } },
		},
		result: { data: { orgProject: ProjectMockOne } },
	},
	{
		request: {
			query: GET_PROJECTS_BY_WORKSPACE,
			variables: { sort: "name:ASC", filter: { workspace: "13" } },
		},
		result: { data: { orgProject: ProjectMockOne } },
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
			query: GET_COUNTRY_LIST,
		},
		result: {
			data: {
				countries: mockCountryList,
			},
		},
	},
	{
		request: {
			query: GET_PROJECTS_BY_WORKSPACE,
			variables: { filter: { workspace: "13" } },
		},
		result: { data: { orgProject: ProjectMockTwo } },
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
			query: GET_PROJ_DONORS,
			variables: { filter: { project: "1" } },
		},
		result: { data: { projectDonors: projDonorsMock } },
	},
	{
		request: {
			query: GET_PROJ_DONORS,
			variables: { filter: { project: "2" } },
		},
		result: { data: { projectDonors: projDonorsMock } },
	},
	{
		request: {
			query: GET_ORG_DONOR,
			variables: {
				filter: {
					organization: "13",
				},
			},
		},
		result: {
			data: {
				orgDonors: mockOrgDonor,
			},
		},
	},
];
jest.setTimeout(30000);
beforeEach(() => {
	act(() => {
		sidebar = renderApollo(
			<DashboardProvider
				defaultState={{ organization: organizationDetail, workspace: { id: "13" } }}
			>
				<BrowserRouter>
					<NotificationProvider>
						<SideBar />
					</NotificationProvider>
				</BrowserRouter>
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
		await waitForElement(() => sidebar.getAllByText(/ARTISTAAN/i));
	});
});
