import { act, fireEvent, RenderResult, waitForElement } from "@testing-library/react";
import { debug } from "console";
import React from "react";

import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
} from "../../../../graphql/Deliverable/target";
import { GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET } from "../../../../graphql/Deliverable/trackline";
import { renderApollo } from "../../../../utils/test.util";
import {
	achieveValueMock,
	DeliverableTargetMock,
	DeliverableTracklineByTargetMock,
	projectsMock,
} from "../../../Deliverable/__test__/testHelp";
import {
	deliverableAndImpactHeadings,
	deliverableAndimpactTracklineHeading,
} from "../../constants";
import DeliverableTable from "../Deliverable";

const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: { filter: { project: 2 } },
		},
		result: { data: { deliverableTargetList: DeliverableTargetMock } },
	},
	{
		request: {
			query: GET_ACHIEVED_VALLUE_BY_TARGET,
			variables: { filter: { deliverableTargetProject: "1" } },
		},
		result: { data: { deliverableTrackingTotalValue: achieveValueMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
			variables: { filter: { deliverable_target_project: "1" } },
		},
		result: { data: { deliverableTrackingLineitemList: DeliverableTracklineByTargetMock } },
	},
];

let deliverableTable: RenderResult;

beforeEach(() => {
	act(() => {
		deliverableTable = renderApollo(
			<DashboardProvider defaultState={{ project: projectsMock }}>
				<NotificationProvider>
					<DeliverableTable />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Deliverable Table and Deliverable trackline table Graphql Calls and data listing", () => {
	test("Table Headings for Deliverable Table", async () => {
		const { getAllByText } = deliverableTable;
		for (let i = 0; i < deliverableAndImpactHeadings.length; i++) {
			await waitForElement(() => getAllByText(deliverableAndImpactHeadings[i].label));
		}
	});
	test("Data listing of Deliverable table", async () => {
		const { getByText } = deliverableTable;
		debug(deliverableTable.container);
		await waitForElement(() => getByText(/Test Deliverable Target/i)); // name of target
		await waitForElement(() => getByText(/JUKEBOX/i)); // Category of target
		await waitForElement(() => getByText(/50000 unit/i)); // Target Value of target
		await waitForElement(() => getByText(/25000 unit/i)); // achievd value of target
		await waitForElement(() => getByText(/50.00 %/i)); // calculated percentage of target
	});

	test("Table Headings and Data listing of Deliverable trackline table", async () => {
		let collaspeButton = await deliverableTable.findByTestId(`collaspeButton${0}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		const { getByText, getAllByText, findAllByText } = deliverableTable;

		await waitForElement(() => getByText(/2020-08-25/i)); // date of target trackline
		await waitForElement(() => getByText(/this is a note/i)); // Category of target trackline
		await waitForElement(() => getAllByText(/25000/i)); // Target Value of target trackline

		for (let i = 0; i < deliverableAndimpactTracklineHeading.length; i++) {
			await waitForElement(() =>
				findAllByText(deliverableAndimpactTracklineHeading[i].label)
			);
		}
	});
});
