import React from "react";
import { waitForElement, fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM } from "../../../../graphql/Budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockBudgetTargetAmountSum,
	mockDeliverableCategoryCount,
} from "../../../../utils/testMock.json";
import DeliverableUnitTable from "../DeliverableUnitTableGraphql";
import { deliverableCategoryTableHeading, deliverableUnitTableHeadings } from "../../constants";
import {
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
	GET_DELIVERABLE_ORG_CATEGORY,
	GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
} from "../../../../graphql/Deliverable/category";
import {
	deliverableCategoryMock,
	deliverableCategoryUnitListMock,
	deliverableUnitMock,
} from "../../../Deliverable/__test__/testHelp";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../../graphql/Deliverable/categoryUnit";
import {
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_PROJECT_COUNT,
} from "../../../../graphql/Deliverable/unit";
import { deliverableCategoryInputFields } from "../../../../pages/settings/DeliverableMaster/inputFields.json";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";

let intialFormValue = {
	name: "new unit name",
	code: "deliverable unit code",
	description: "deliverable unit desc",
};

let table: any;

const mocks = [
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
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_category_org: "6",
				},
			},
		},
		result: {
			data: { projectCountDelCatByOrg: [{ count: 1 }] },
		},
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
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
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
			query: GET_CATEGORY_UNIT,
			variables: {
				filter: { deliverable_units_org: "1" },
				limit: 1,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { deliverableCategoryUnitList: deliverableCategoryUnitListMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
			variables: {
				filter: { deliverable_units_org: "1" },
			},
		},
		result: { data: { deliverableCategoryUnitCount: deliverableCategoryUnitListMock.length } },
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

beforeEach(() => {
	act(() => {
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
	});
});

describe("Deliverable Unit Table tests", () => {
	for (let i = 0; i < deliverableUnitTableHeadings.length; i++) {
		test(`Table Headings ${deliverableUnitTableHeadings[i].label} for Deliverable Unit Table`, async () => {
			await waitForElement(() => table.getAllByText(deliverableUnitTableHeadings[i].label));
		});
	}

	test("Filter List test", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

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

	test("Table Headings and Data listing of Deliverable Category table", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});

		for (let i = 0; i < deliverableCategoryTableHeading.length; i++) {
			await waitForElement(() =>
				table.findAllByText(deliverableCategoryTableHeading[i].label)
			);
		}

		await waitForElement(() =>
			table.getAllByText(
				new RegExp(
					"" + deliverableCategoryUnitListMock[0].deliverable_category_org.name,
					"i"
				)
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp(
					"" + deliverableCategoryUnitListMock[0].deliverable_category_org.code,
					"i"
				)
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp(
					"" + deliverableCategoryUnitListMock[0].deliverable_category_org.description,
					"i"
				)
			)
		);
	});

	const { checkElementHaveCorrectValue } = commonFormTestUtil(fireEvent, wait, act);

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

		for (let i = 0; i < deliverableCategoryInputFields.length; i++) {
			await checkElementHaveCorrectValue({
				inputElement: deliverableCategoryInputFields[i],
				reactElement: table,
				value: intialFormValue[deliverableCategoryInputFields[i].name],
			});
		}
	});
});
