import React from "react";
import { waitForElement, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { projectDetails, organizationDetails } from "../../../../utils/testMock.json";
import DeliverableUnitTable from "../DeliverableUnitTableGraphql";
import { deliverableUnitTableHeadings } from "../../constants";
import { deliverableUnitMock } from "../../../Deliverable/__test__/testHelp";
import {
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_PROJECT_COUNT,
} from "../../../../graphql/Deliverable/unit";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";

let table: any;

const mocks = [
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
			query: GET_DELIVERABLE_UNIT_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_unit_org: "1",
				},
			},
		},
		result: {
			data: { projectCountDelUnit: [{ count: 1 }] },
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_UNIT_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_unit_org: "2",
				},
			},
		},
		result: {
			data: { projectCountDelUnit: [{ count: 1 }] },
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_UNIT_BY_ORG,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { deliverableUnitOrg: deliverableUnitMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_UNIT_BY_ORG,
			variables: {
				filter: { organization: "3" },
				limit: deliverableUnitMock.length,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { deliverableUnitOrg: deliverableUnitMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { deliverableUnitOrgCount: deliverableUnitMock.length } },
	},
];

beforeEach(async () => {
	table = renderApollo(
		<DashboardProvider
			defaultState={{ project: projectDetails, organization: organizationDetails }}
		>
			<NotificationProvider>
				<DeliverableUnitTable />
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

describe("Deliverable Unit Table tests", () => {
	for (let i = 0; i < deliverableUnitTableHeadings.length; i++) {
		test(`Table Headings ${deliverableUnitTableHeadings[i].label} for Deliverable Unit Table`, async () => {
			await waitForElement(() => table.getAllByText(deliverableUnitTableHeadings[i].label));
		});
	}

	test("Deliverable Unit Table renders correctly", async () => {
		for (let i = 0; i < deliverableUnitMock.length; i++) {
			await waitForElement(() =>
				table.getAllByText(new RegExp(deliverableUnitMock[i].name, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp(deliverableUnitMock[i].description, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp("" + deliverableUnitMock[i].code, "i"))
			);
		}
	});
});
