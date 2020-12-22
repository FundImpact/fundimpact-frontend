import React from "react";
import { renderApollo } from "../../../../utils/test.util";
import { waitForElement, act, fireEvent } from "@testing-library/react";
import DeliverableTable from "../Deliverable";
import {
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGETS_COUNT,
} from "../../../../graphql/Deliverable/target";
import {
	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
	GET_DELIVERABLE_TRACKLINE_COUNT,
	GET_DELIVERABLE_LINEITEM_FYDONOR,
} from "../../../../graphql/Deliverable/trackline";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { deliverableHeadings, deliverableAndimpactTracklineHeading } from "../../constants";
import {
	DeliverableTargetMock,
	achieveValueMock,
	DeliverableTracklineByTargetMock,
	projectsMock,
	deliverableLineitemFyDonorListMock,
	deliverableCategoryMock,
} from "../../../Deliverable/__test__/testHelp";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../../graphql/Deliverable/category";
import { organizationDetail, financialYearListMock } from "../../../../utils/testMock.json";
import { GET_ANNUAL_YEARS, GET_FINANCIAL_YEARS } from "../../../../graphql";
import { annualYearListMock } from "../../../Impact/__test__/testHelp";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import { DialogProvider } from "../../../../contexts/DialogContext";

let intialFormValue = {
	name: "new deliverable target name",
	target_value: "12312",
};

const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: {
				sort: "created_at:DESC",
				limit: 1,
				start: 0,
				filter: { project: 2 },
			},
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
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { impactCategoryOrgList: deliverableCategoryMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
			variables: {
				filter: { deliverable_target_project: "1" },
				sort: "created_at:DESC",
				limit: 1,
				start: 0,
			},
		},
		result: { data: { deliverableTrackingLineitemList: DeliverableTracklineByTargetMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TARGETS_COUNT,
			variables: { filter: { project: 2 } },
		},
		result: { data: { deliverableTargetCount: 1 } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TRACKLINE_COUNT,
			variables: { filter: { deliverable_target_project: "1" } },
		},
		result: { data: { deliverableTrackingLineitemCount: 1 } },
	},
	{
		request: {
			query: GET_ANNUAL_YEARS,
		},
		result: { data: { annualYears: annualYearListMock } },
	},
	{
		request: {
			query: GET_FINANCIAL_YEARS,
			variables: { filter: { country: "1" } },
		},
		result: { data: { financialYearList: financialYearListMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_LINEITEM_FYDONOR,
			variables: { filter: { deliverable_tracking_lineitem: "2" } },
		},
		result: { data: { deliverableLinitemFyDonorList: deliverableLineitemFyDonorListMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: {
				filter: { id: "1" },
			},
		},
		result: { data: { deliverableTargetList: DeliverableTargetMock } },
	},
];

let deliverableTable: any;

beforeEach(() => {
	act(() => {
		deliverableTable = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectsMock, organization: organizationDetail }}
			>
				<NotificationProvider>
					<DialogProvider>
						<DeliverableTable />
					</DialogProvider>
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

jest.setTimeout(30000);
describe("Deliverable Table and Deliverable trackline table Graphql Calls and data listing", () => {
	test("Table Headings for Deliverable Table", async () => {
		const { getAllByText } = deliverableTable;
		for (let i = 0; i < deliverableHeadings.length; i++) {
			await waitForElement(() => getAllByText(deliverableHeadings[i].label));
		}
	});
	test("Data listing of Deliverable table", async () => {
		const { getByText } = deliverableTable;
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

		for (let i = 0; i < deliverableAndimpactTracklineHeading.length; i++) {
			await waitForElement(() =>
				findAllByText(deliverableAndimpactTracklineHeading[i].label)
			);
		}
		await waitForElement(() => getByText(/2020-08-25/i)); // date of target trackline
		await waitForElement(() => getByText(/this is a note/i)); // Note of target trackline
		await waitForElement(() => getAllByText(/25000 unit/)); // Target Value of target trackline
		await waitForElement(() => getAllByText(/FY 2019-20/));
		await waitForElement(() => getAllByText(/2015/));
	});

	test("Filter List test", async () => {
		let filterButton = await deliverableTable.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

	test("Filter List Input Elements test", async () => {
		let filterButton = await deliverableTable.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(filterButton);
		});

		let nameField = (await deliverableTable.findByTestId(
			"createDeliverableTargetNameInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(nameField, { target: { value: intialFormValue.name } });
		});
		await expect(nameField.value).toBe(intialFormValue.name);

		let amountField = (await deliverableTable.findByTestId(
			"createDeliverableTotalTargetAmountInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(amountField, {
				target: { value: intialFormValue.target_value },
			});
		});
		await expect(amountField.value).toBe(intialFormValue.target_value);
	});
});
