import React from "react";
import { renderApollo } from "../../../../utils/test.util";
import { waitForElement, act, queries, RenderResult } from "@testing-library/react";
import ProjectDocumentTable from "../";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { documentsHeadings } from "../../constants";
import { projectsMock } from "../../../Deliverable/__test__/testHelp";
import { organizationDetail } from "../../../../utils/testMock.json";
import { rolesMock } from "../../../Forms/UserRole/__test__/testHelp";
import { GET_PROJECT_DOCUMENTS } from "../../../../graphql";
import { getTodaysDate } from "../../../../utils";

let projectDocumnetMock = [
	{
		id: "1",
		name: "Project",
		attachments: [
			{
				id: "37",
				name: "Annotation 2020-03-13 114110",
				size: 510.97,
				caption: "skdvjhsdv kDVKjADJKVkjdABVJK",
				url:
					"https://fundimpact-stg.s3.ap-south-1.amazonaws.com/org-1/deliverable-target-27/deliverable-tracking-item/Annotation_2020_03_13_114110_df85a86d1e.png",
				ext: ".png",
				created_at: "2020-10-14T12:42:11.962Z",
			},
		],
	},
];

const mocks = [
	{
		request: {
			query: GET_PROJECT_DOCUMENTS,
			variables: {
				filter: { id: 2 },
			},
		},
		result: { data: { orgProject: projectDocumnetMock } },
	},
];

let projectDocumentTable: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		projectDocumentTable = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectsMock, organization: organizationDetail }}
			>
				<NotificationProvider>
					<ProjectDocumentTable />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Project documents Table Graphql Calls and data listing", () => {
	test("Table Headings for Project documents Table ", async () => {
		const { getAllByText, findAllByText } = projectDocumentTable;
		for (let i = 0; i < documentsHeadings.length; i++) {
			await waitForElement(() =>
				findAllByText(new RegExp("" + documentsHeadings[i].label, "i"))
			);
		}
	});
	test("Data listing of Project documents Table ", async () => {
		const { getByText } = projectDocumentTable;
		await waitForElement(() =>
			getByText(new RegExp("" + projectDocumnetMock[0].attachments[0].name, "i"))
		);
		await waitForElement(() =>
			getByText(new RegExp("" + projectDocumnetMock[0].attachments[0].size, "i"))
		);
		await waitForElement(() =>
			getByText(new RegExp("" + projectDocumnetMock[0].attachments[0].caption, "i"))
		);
		await waitForElement(() =>
			getByText(new RegExp("" + projectDocumnetMock[0].attachments[0].ext, "i"))
		);

		await waitForElement(() =>
			getByText(
				new RegExp(
					"" + getTodaysDate(new Date(projectDocumnetMock[0].attachments[0].created_at)),
					"i"
				)
			)
		);
	});
});
