import React from "react";
import { waitForElement, fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockIndividualListCount,
	mockIndividualList,
	mockProjects,
} from "../../../../utils/testMock.json";
import { individualTableOrganizationHeadings } from "../../constants";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import IndividualTable from "..";
import { GET_INDIVIDUALS_COUNT, GET_INDIVIDUALS } from "../../../../graphql/Individual";
import { GET_PROJECTS } from "../../../../graphql";

let table: any;

const mocks = [
	{
		request: {
			query: GET_INDIVIDUALS_COUNT,
			variables: {
				filter: {
					organization: organizationDetails.id,
					deleted: false,
				},
			},
		},
		result: {
			data: mockIndividualListCount,
		},
	},
	{
		request: {
			query: GET_PROJECTS,
			variables: {},
		},
		result: { data: mockProjects },
	},
	{
		request: {
			query: GET_INDIVIDUALS,
			variables: {
				filter: {
					organization: organizationDetails.id,
					deleted: false,
				},
				limit: mockIndividualListCount.t4DIndividualsConnection.aggregate.count,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: {
			data: {
				t4DIndividuals: mockIndividualList,
			},
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
];

beforeEach(async () => {
	table = renderApollo(
		<DashboardProvider
			defaultState={{ project: projectDetails, organization: organizationDetails }}
		>
			<NotificationProvider>
				<IndividualTable />
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

describe("Individual Table tests", () => {
	for (let i = 0; i < individualTableOrganizationHeadings.length; i++) {
		test(`Table Headings ${individualTableOrganizationHeadings[i].label} for Individual Target Table`, async () => {
			await waitForElement(() =>
				table.getAllByText(individualTableOrganizationHeadings[i].label)
			);
		});
	}

	test("renders correctly", async () => {
		await waitForElement(() =>
			table.getByText(new RegExp("" + mockIndividualList[0].name, "i"))
		);

		for (let i = 0; i < mockIndividualList[0].t4d_project_individuals.length; i++) {
			await waitForElement(() =>
				table.getByText(
					new RegExp(
						"" + mockIndividualList[0].t4d_project_individuals[i].project.name,
						"i"
					)
				)
			);
		}
	});

	test("Filter List test", async () => {
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

	test("Filter List Input Elements test", async () => {
		let buttonElement = await table.findByTestId(`filter-button`);
		expect(buttonElement).toBeInTheDocument();
		act(() => {
			fireEvent.click(buttonElement);
		});

		let nameField = (await table.findByTestId("createNameInput")) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(nameField, { target: { value: "sherlock" } });
		});
		await expect(nameField.value).toBe("sherlock");
	});
});
