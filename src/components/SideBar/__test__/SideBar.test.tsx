import React from "react";
import { renderApollo } from "../../../utils/test.util";
import { waitForElement } from "@testing-library/react";
import SideBar from "../SideBar";
import { GET_ORGANISATIONS } from "../../../graphql/queries";
import { GET_WORKSPACES_BY_ORG } from "../../../graphql/queries/index";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/queries/index";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";

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
describe("SideBar Component Graphql Calls and data listing", () => {
	test("renders correctly", async () => {
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
		const { getByText } = await renderApollo(
			<NotificationProvider>
				<DashboardProvider>
					<SideBar />
				</DashboardProvider>
			</NotificationProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
		await waitForElement(() => getByText(/TSERIES/i));
		await waitForElement(() => getByText(/INSTAGRAM/i));
		await waitForElement(() => getByText(/FACEBOOK/i));
		await waitForElement(() => getByText(/ARTISTAAN/i));
		await waitForElement(() => getByText(/KALAMKAAR/i));
	});
});
