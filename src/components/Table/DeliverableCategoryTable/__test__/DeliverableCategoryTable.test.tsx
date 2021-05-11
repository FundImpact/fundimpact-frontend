import React from "react";
import { waitForElement, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockDeliverableCategoryCount,
} from "../../../../utils/testMock.json";
import DeliverableCategoryTable from "../DeliverableCategoryTableGraphql";
import { deliverableCategoryTableHeading } from "../../constants";
import {
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
	GET_DELIVERABLE_ORG_CATEGORY,
	GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
} from "../../../../graphql/Deliverable/category";
import { deliverableCategoryMock } from "../../../Deliverable/__test__/testHelp";
import { GET_DELIVERABLE_UNIT_PROJECT_COUNT } from "../../../../graphql/Deliverable/unit";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";

let table: any;

const deliverableCategoryProjectCountQuery = {
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
};

const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_category_org: "30",
				},
			},
		},
		result: {
			data: { projectCountDelCatByOrg: [{ count: 1 }] },
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
	deliverableCategoryProjectCountQuery,
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: mockDeliverableCategoryCount,
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: {
				filter: { organization: "3" },
				limit: 2,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_category_org: "1",
				},
			},
		},
		result: {
			data: { projectCountDelCatByOrg: [{ count: 1 }] },
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_category_org: "2",
				},
			},
		},
		result: {
			data: { projectCountDelCatByOrg: [{ count: 1 }] },
		},
	},
];

beforeEach(async () => {
	table = renderApollo(
		<DashboardProvider
			defaultState={{ project: projectDetails, organization: organizationDetails }}
		>
			<NotificationProvider>
				<DeliverableCategoryTable />
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

describe("Deliverable Category Table tests", () => {
	for (let i = 0; i < deliverableCategoryTableHeading.length; i++) {
		test(`Table Headings ${deliverableCategoryTableHeading[i].label} for Deliverable Category Table`, async () => {
			await waitForElement(() =>
				table.getAllByText(deliverableCategoryTableHeading[i].label)
			);
		});
	}
	test("Deliverable Category Table renders correctly", async () => {
		for (let i = 0; i < deliverableCategoryMock.length; i++) {
			await waitForElement(() =>
				table.getAllByText(new RegExp(deliverableCategoryMock[i].name, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp(deliverableCategoryMock[i].description, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp("" + deliverableCategoryMock[i].code, "i"))
			);
		}
	});
});
