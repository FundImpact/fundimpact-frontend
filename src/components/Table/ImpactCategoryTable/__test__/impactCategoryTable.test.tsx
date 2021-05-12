import React from "react";
import { waitForElement, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { projectDetails, organizationDetails } from "../../../../utils/testMock.json";
import { impactCategoryTableHeadings } from "../../constants";
import ImpactCategoryTable from "../ImpactCategoryTableGraphql";
import {
	GET_IMPACT_CATEGORY_COUNT_BY_ORG,
	GET_IMPACT_CATEGORY_BY_ORG,
} from "../../../../graphql/Impact/query";
import { impactCategoryMock } from "../../../Impact/__test__/testHelp";
import { GET_IMPACT_CATEGORY_PROJECT_COUNT } from "../../../../graphql/Impact/category";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";

let table: any;

const impactCategoryCountQuery = {
	request: {
		query: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
		variables: {
			filter: { organization: "3" },
		},
	},
	result: { data: { impactCategoryOrgCount: impactCategoryMock.length } },
};

const impactCategoryProjectCountQuery = {
	request: {
		query: GET_IMPACT_CATEGORY_PROJECT_COUNT,
		variables: {
			filter: {
				impact_category_org: "1",
			},
		},
	},
	result: {
		data: { projectCountImpCatByOrg: [{ count: 1 }] },
	},
};

const impactCategoryByOrgQuery = {
	request: {
		query: GET_IMPACT_CATEGORY_BY_ORG,
		variables: {
			filter: { organization: "3" },
		},
	},
	result: { data: { impactCategoryOrgList: impactCategoryMock } },
};

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
	impactCategoryProjectCountQuery,
	{
		request: {
			query: GET_IMPACT_CATEGORY_BY_ORG,
			variables: {
				filter: { organization: "3" },
				limit: impactCategoryMock.length,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { impactCategoryOrgList: impactCategoryMock } },
	},
	impactCategoryByOrgQuery,
	impactCategoryCountQuery,
	{
		request: {
			query: GET_IMPACT_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					impact_category_org: "2",
				},
			},
		},
		result: {
			data: { projectCountImpCatByOrg: [{ count: 1 }] },
		},
	},
];

beforeEach(async () => {
	table = renderApollo(
		<DashboardProvider
			defaultState={{ project: projectDetails, organization: organizationDetails }}
		>
			<NotificationProvider>
				<ImpactCategoryTable />
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

describe("Impact Category Table tests", () => {
	for (let i = 0; i < impactCategoryTableHeadings.length; i++) {
		test(`Table Headings ${impactCategoryTableHeadings[i].label} for Impact Category Table`, async () => {
			await waitForElement(() => table.getAllByText(impactCategoryTableHeadings[i].label));
		});
	}

	test("Impact Category Table renders correctly", async () => {
		for (let i = 0; i < impactCategoryMock.length; i++) {
			await waitForElement(() =>
				table.getAllByText(new RegExp(impactCategoryMock[i].name, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp(impactCategoryMock[i].description, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp("" + impactCategoryMock[i].code, "i"))
			);
		}
	});
});
