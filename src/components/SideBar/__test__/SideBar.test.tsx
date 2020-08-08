import React from "react";
import { renderApollo } from "../../../utils/test.util";
import { waitForElement } from "@testing-library/react";
import SideBar from "../SideBar";
import { GET_ORGANISATIONS } from "../../../graphql/queries";
import { GET_WORKSPACES_BY_ORG } from "../../../graphql/queries/index";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/queries/index";

const OrgMock = [
	{
		__typename: "Organisation",
		id: "13",
		name: "TSERIES",
		short_name: null,
	},
];

const WSMock = [
	{
		id: "5",
		name: "INSTAGRAM",
		organisation: { __typename: "Organisation", id: "13", name: "TSERIES" },
	},
	{
		id: "13",
		name: "FACEBOOK",
		organisation: { __typename: "Organisation", id: "13", name: "TSERIES" },
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
				result: { data: { organisationList: OrgMock } },
			},
			{
				request: {
					query: GET_WORKSPACES_BY_ORG,
					variables: { filter: { organisation: "13" } },
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
		const { getByText } = await renderApollo(<SideBar />, {
			mocks,
			resolvers: {},
		});
		await waitForElement(() => getByText(/TSERIES/i));
		await waitForElement(() => getByText(/INSTAGRAM/i));
		await waitForElement(() => getByText(/FACEBOOK/i));
		await waitForElement(() => getByText(/ARTISTAAN/i));
		await waitForElement(() => getByText(/KALAMKAAR/i));
	});
});
