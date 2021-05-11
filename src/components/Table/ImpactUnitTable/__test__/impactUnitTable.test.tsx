import React from "react";
import { waitForElement, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { projectDetails, organizationDetails } from "../../../../utils/testMock.json";
import { impactUnitTableHeadings } from "../../constants";
import ImpactUnitTable from "../ImpactUnitTableGraphql";
import {
	GET_IMPACT_UNIT_COUNT_BY_ORG,
	GET_IMPACT_UNIT_BY_ORG,
	GET_IMPACT_UNIT_PROJECT_COUNT,
} from "../../../../graphql/Impact/query";
import { impactUnitMock } from "../../../Impact/__test__/testHelp";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";

let table: any;

const mocks = [
	{
		request: {
			query: GET_IMPACT_UNIT_PROJECT_COUNT,
			variables: {
				filter: {
					impact_unit_org: "1",
				},
			},
		},
		result: {
			data: { projectCountImpUnit: [{ count: 1 }] },
		},
	},
	{
		request: {
			query: GET_IMPACT_UNIT_PROJECT_COUNT,
			variables: {
				filter: {
					impact_unit_org: "2",
				},
			},
		},
		result: {
			data: { projectCountImpUnit: [{ count: 1 }] },
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
			query: GET_IMPACT_UNIT_COUNT_BY_ORG,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { impactUnitsOrgCount: impactUnitMock.length } },
	},
	{
		request: {
			query: GET_IMPACT_UNIT_BY_ORG,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { impactUnitsOrgList: impactUnitMock } },
	},
	{
		request: {
			query: GET_IMPACT_UNIT_BY_ORG,
			variables: {
				filter: { organization: "3" },
				limit: impactUnitMock.length,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { impactUnitsOrgList: impactUnitMock } },
	},
];

beforeEach(async () => {
	table = renderApollo(
		<DashboardProvider
			defaultState={{ project: projectDetails, organization: organizationDetails }}
		>
			<NotificationProvider>
				<ImpactUnitTable />
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

describe("Impact Unit Table tests", () => {
	for (let i = 0; i < impactUnitTableHeadings.length; i++) {
		test(`Table Headings ${impactUnitTableHeadings[i].label} for Impact Unit Table`, async () => {
			await waitForElement(() => table.getAllByText(impactUnitTableHeadings[i].label));
		});
	}
	test("Impact Unit Table renders correctly", async () => {
		for (let i = 0; i < impactUnitMock.length; i++) {
			await waitForElement(() => table.getAllByText(new RegExp(impactUnitMock[i].name, "i")));
			await waitForElement(() =>
				table.getAllByText(new RegExp(impactUnitMock[i].description, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp("" + impactUnitMock[i].code, "i"))
			);
		}
	});
});
