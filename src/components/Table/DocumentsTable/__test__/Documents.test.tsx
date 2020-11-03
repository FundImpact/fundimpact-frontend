import React from "react";
import { renderApollo } from "../../../../utils/test.util";
import { waitForElement, act, queries, RenderResult } from "@testing-library/react";
import DocumentsTable from "../";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { documentsHeadings } from "../../constants";
import { projectsMock } from "../../../Deliverable/__test__/testHelp";
import { organizationDetail } from "../../../../utils/testMock.json";
import { getTodaysDate } from "../../../../utils";

let documnetMock: any = [
	{
		id: "1",
		name: "Document",
		short_name: "Document",
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

const mocks: any = [];

let documentTable: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		documentTable = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectsMock, organization: organizationDetail }}
			>
				<NotificationProvider>
					<DocumentsTable data={{ organizations: documnetMock }} loading={false} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Documents Table Graphql Calls and data listing", () => {
	test("Table Headings for documents Table ", async () => {
		const { getAllByText, findAllByText } = documentTable;
		for (let i = 0; i < documentsHeadings.length; i++) {
			await waitForElement(() =>
				findAllByText(new RegExp("" + documentsHeadings[i].label, "i"))
			);
		}
	});
	test("Data listing of documents Table ", async () => {
		const { getByText } = documentTable;
		await waitForElement(() =>
			getByText(new RegExp("" + documnetMock[0].attachments[0].name, "i"))
		);
		await waitForElement(() =>
			getByText(new RegExp("" + documnetMock[0].attachments[0].size, "i"))
		);
		await waitForElement(() =>
			getByText(new RegExp("" + documnetMock[0].attachments[0].caption, "i"))
		);
		await waitForElement(() =>
			getByText(new RegExp("" + documnetMock[0].attachments[0].ext, "i"))
		);

		await waitForElement(() =>
			getByText(
				new RegExp(
					"" + getTodaysDate(new Date(documnetMock[0].attachments[0].created_at)),
					"i"
				)
			)
		);
	});
});
