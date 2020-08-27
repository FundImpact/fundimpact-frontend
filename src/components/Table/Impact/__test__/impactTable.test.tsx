import { act, fireEvent, waitForElement } from "@testing-library/react";
import React from "react";

import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
} from "../../../../graphql/Impact/target";
import { GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET } from "../../../../graphql/Impact/trackline";
import { renderApollo } from "../../../../utils/test.util";
import {
	achieveValueMock,
	impactTargetMock,
	impactTracklineByTargetMock,
	projectMock,
} from "../../../Impact/__test__/testHelp";
import {
	deliverableAndImpactHeadings,
	deliverableAndimpactTracklineHeading,
} from "../../constants";
import ImpactTable from "../Impacts";

const mocks = [
	{
		request: {
			query: GET_IMPACT_TARGET_BY_PROJECT,
			variables: { filter: { project: 2 } },
		},
		result: { data: { impactTargetProjectList: impactTargetMock } },
	},
	{
		request: {
			query: GET_ACHIEVED_VALLUE_BY_TARGET,
			variables: { filter: { impactTargetProject: "14" } },
		},
		result: { data: { impactTrackingSpendValue: achieveValueMock } },
	},
	{
		request: {
			query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
			variables: { filter: { impact_target_project: "14" } },
		},
		result: { data: { impactTrackingLineitemList: impactTracklineByTargetMock } },
	},
];

let impactTable: any;

beforeEach(() => {
	act(() => {
		impactTable = renderApollo(
			<DashboardProvider defaultState={{ project: projectMock }}>
				<NotificationProvider>
					<ImpactTable />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Impact Table and impact trackline table Graphql Calls and data listing", () => {
	test("Table Headings for Impact Table", async () => {
		const { getAllByText } = impactTable;
		for (let i = 0; i < deliverableAndImpactHeadings.length; i++) {
			await waitForElement(() => getAllByText(deliverableAndImpactHeadings[i].label));
		}
	});

	test("Data listing of impact table", async () => {
		const { getByText } = impactTable;
		await waitForElement(() => getByText(/Impact TARGETcc/i)); // name of target
		await waitForElement(() => getByText(/SONG/i)); // Category of target
		await waitForElement(() => getByText(/2500000000 units/i)); // Target Value of target
		await waitForElement(() => getByText(/630000 units/i)); // achievd value of target
		await waitForElement(() => getByText(/0.03 %/i)); // calculated percentage of target
	});

	test("Data listing of impact trackline table", async () => {
		let collaspeButton = await impactTable.findByTestId(`collaspeButton${0}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		const { getByText, getAllByText } = impactTable;

		for (let i = 0; i < deliverableAndimpactTracklineHeading.length; i++) {
			await waitForElement(() => getAllByText(deliverableAndimpactTracklineHeading[i].label));
		}

		await waitForElement(() => getByText(/2020-08-25/i)); // date of target trackline
		await waitForElement(() => getByText(/this is a note/i)); // Category of target trackline
		await waitForElement(() => getAllByText(/630000/i)); // Target Value of target trackline
	});
});
