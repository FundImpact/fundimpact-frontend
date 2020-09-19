import React from "react";
import { waitForElement, fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { projectDetails, organizationDetails } from "../../../../utils/testMock.json";
import { impactCategoryTableHeadings, impactUnitTableHeadings } from "../../constants";
import ImpactUnitTable from "../ImpactUnitTableGraphql";
import { deliverableCategoryUnitListMock } from "../../../Deliverable/__test__/testHelp";
import { GET_CATEGORY_UNIT } from "../../../../graphql/Deliverable/categoryUnit";
import {
	GET_IMPACT_CATEGORY_COUNT_BY_ORG,
	GET_IMPACT_CATEGORY_BY_ORG,
	GET_IMPACT_UNIT_COUNT_BY_ORG,
	GET_IMPACT_UNIT_BY_ORG,
	GET_IMPACT_UNIT_PROJECT_COUNT,
} from "../../../../graphql/Impact/query";
import {
	impactCategoryMock,
	impactCategoryUnit,
	impactUnitMock,
} from "../../../Impact/__test__/testHelp";
import {
	GET_IMPACT_CATEGORY_UNIT,
	GET_IMPACT_CATEGORY_UNIT_COUNT,
} from "../../../../graphql/Impact/categoryUnit";
import { GET_IMPACT_CATEGORY_PROJECT_COUNT } from "../../../../graphql/Impact/category";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { impactCategoryInputFields } from "../../../../pages/settings/ImpactMaster/inputFields.json";

let table: any;

let intialFormValue = {
	name: "new category name",
	code: "impact category code",
	description: "impact category desc",
};

const mocks = [
	{
		request: {
			query: GET_CATEGORY_UNIT,
			variables: {
				filter: { deliverable_category_org: "1" },
				limit: 1,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { deliverableCategoryUnitList: deliverableCategoryUnitListMock } },
	},
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
	{
		request: {
			query: GET_IMPACT_CATEGORY_BY_ORG,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { impactCategoryOrgList: impactCategoryMock } },
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { impactCategoryOrgCount: impactCategoryMock.length } },
	},
	{
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
	},
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
			query: GET_IMPACT_CATEGORY_UNIT,
			variables: {
				filter: { impact_units_org: "1" },
			},
		},
		result: { data: { impactCategoryUnit: impactCategoryUnit } },
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_UNIT,
			variables: {
				filter: { impact_units_org: "1" },
			},
		},
		result: { data: { impactCategoryUnitList: impactCategoryUnit } },
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_UNIT,
			variables: {
				filter: { impact_units_org: "1" },
				limit: impactCategoryUnit.length,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { impactCategoryUnitList: impactCategoryUnit } },
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_UNIT_COUNT,
			variables: {
				filter: { impact_units_org: "1" },
			},
		},
		result: { data: { impactCategoryUnitListCount: impactCategoryUnit.length } },
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

beforeEach(() => {
	act(() => {
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
	});
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

	test("Table Headings and Data listing of Impact Category table", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});

		for (let i = 0; i < impactCategoryTableHeadings.length; i++) {
			await waitForElement(() => table.findAllByText(impactCategoryTableHeadings[i].label));
		}

		await waitForElement(() =>
			table.getAllByText(new RegExp("" + impactCategoryUnit[0].impact_category_org.name, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + impactCategoryUnit[0].impact_category_org.code, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + impactCategoryUnit[0].impact_category_org.description, "i")
			)
		);
	});

	const { checkElementHaveCorrectValue } = commonFormTestUtil(fireEvent, wait, act);

	test("Filter List test", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

	test("Filter List Input Elements test", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(filterButton);
		});

		for (let i = 0; i < impactCategoryInputFields.length; i++) {
			await checkElementHaveCorrectValue({
				inputElement: impactCategoryInputFields[i],
				reactElement: table,
				value: intialFormValue[impactCategoryInputFields[i].name],
			});
		}
	});
});
