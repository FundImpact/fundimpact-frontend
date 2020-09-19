import React from "react";
import { waitForElement, fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { GET_PROJECT_BUDGET_TARGETS_COUNT } from "../../../../graphql/Budget";
import { GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM } from "../../../../graphql/Budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockBudgetTargetAmountSum,
	mockBudgetTargetCount,
	mockDeliverableCategoryCount,
} from "../../../../utils/testMock.json";
import { impactCategoryTableHeadings, impactUnitTableHeadings } from "../../constants";
import ImpactCategoryTable from "../ImpactCategoryTableGraphql";
import {
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
	GET_DELIVERABLE_ORG_CATEGORY,
} from "../../../../graphql/Deliverable/category";
import {
	deliverableCategoryMock,
	deliverableCategoryUnitListMock,
} from "../../../Deliverable/__test__/testHelp";
import { GET_CATEGORY_UNIT } from "../../../../graphql/Deliverable/categoryUnit";
import {
	GET_IMPACT_CATEGORY_COUNT_BY_ORG,
	GET_IMPACT_CATEGORY_BY_ORG,
	GET_IMPACT_UNIT_PROJECT_COUNT,
} from "../../../../graphql/Impact/query";
import { impactCategoryMock, impactCategoryUnit } from "../../../Impact/__test__/testHelp";
import {
	GET_IMPACT_CATEGORY_UNIT,
	GET_IMPACT_CATEGORY_UNIT_COUNT,
} from "../../../../graphql/Impact/categoryUnit";
import { GET_IMPACT_CATEGORY_PROJECT_COUNT } from "../../../../graphql/Impact/category";
import { impactUnitInputFields } from "../../../../pages/settings/ImpactMaster/inputFields.json";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";

let table: any;

let intialFormValue = {
	name: "new impact unit",
	code: "impact code",
	description: "impact desc",
};

const impactUnitProjectCountQuery = {
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
};

const budgetTargetCountQuery = {
	request: {
		query: GET_PROJECT_BUDGET_TARGETS_COUNT,
		variables: {
			filter: {
				project: 3,
			},
		},
	},
	result: {
		data: mockBudgetTargetCount,
	},
};

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

const budgetTragetAmountSum = {
	request: {
		query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
		variables: {
			filter: {
				budgetTargetsProject: "3",
			},
		},
	},
	result: {
		data: mockBudgetTargetAmountSum,
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

const deliverableCategoryCountByOrgQuery = {
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
};

const mocks = [
	impactUnitProjectCountQuery,
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
				filter: { impact_category_org: "1" },
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
				filter: { impact_category_org: "1" },
			},
		},
		result: { data: { impactCategoryUnitListCount: impactCategoryUnit.length } },
	},

	deliverableCategoryCountByOrgQuery,
	budgetTragetAmountSum,
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
	impactCategoryProjectCountQuery,
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
	},
	budgetTargetCountQuery,
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
	impactCategoryByOrgQuery,
	impactCategoryCountQuery,
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
				filter: { impact_category_org: "1" },
			},
		},
		result: { data: { impactCategoryUnitList: impactCategoryUnit } },
	},
	impactCategoryProjectCountQuery,
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

beforeEach(() => {
	act(() => {
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
	});
});

const { checkElementHaveCorrectValue } = commonFormTestUtil(fireEvent, wait, act);

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

	test("Table Headings and Data listing of Impact Unit table", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});

		for (let i = 0; i < impactUnitTableHeadings.length; i++) {
			await waitForElement(() => table.findAllByText(impactUnitTableHeadings[i].label));
		}

		await waitForElement(() =>
			table.getAllByText(new RegExp("" + impactCategoryUnit[0].impact_units_org.name, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(new RegExp("" + impactCategoryUnit[0].impact_units_org.code, "i"))
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + impactCategoryUnit[0].impact_units_org.description, "i")
			)
		);
	});

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

		for (let i = 0; i < impactUnitInputFields.length; i++) {
			await checkElementHaveCorrectValue({
				inputElement: impactUnitInputFields[i],
				reactElement: table,
				value: intialFormValue[impactUnitInputFields[i].name],
			});
		}
	});
});
