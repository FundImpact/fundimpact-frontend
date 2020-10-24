import React from "react";
import { renderApollo } from "../../../../utils/test.util";
import { waitForElement, act, fireEvent, RenderResult } from "@testing-library/react";
import InvitedUserTable from "../";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { invitedUserTableHeadings } from "../../constants";
import { projectsMock } from "../../../Deliverable/__test__/testHelp";
import { organizationDetail } from "../../../../utils/testMock.json";
import {
	GET_INVITED_USER_LIST,
	GET_INVITED_USER_LIST_COUNT,
	GET_ROLES_BY_ORG,
} from "../../../../graphql/UserRoles/query";
import { rolesMock, userListMock } from "../../../Forms/UserRole/__test__/testHelp";

let intialFormValue = {
	email: "my@my.com",
	role: [{ id: "40", name: "Accountant" }],
};

const mocks = [
	{
		request: {
			query: GET_INVITED_USER_LIST_COUNT,
			variables: {
				filter: {},
			},
		},
		result: { data: { userListCount: 1 } },
	},
	{
		request: {
			query: GET_ROLES_BY_ORG,
			variables: {
				filter: { organization: "13" },
			},
		},
		result: { data: { organizationRoles: rolesMock } },
	},
	{
		request: {
			query: GET_INVITED_USER_LIST,
			variables: {
				filter: {},
				limit: 1,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { userList: userListMock } },
	},
];

let invitedUserTable: RenderResult;

beforeEach(() => {
	act(() => {
		invitedUserTable = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectsMock, organization: organizationDetail }}
			>
				<NotificationProvider>
					<InvitedUserTable />
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
describe("Invited User TableGraphql Calls and data listing", () => {
	test("Table Headings for Invited User Table", async () => {
		const { getAllByText } = invitedUserTable;
		for (let i = 0; i < invitedUserTableHeadings.length; i++) {
			await waitForElement(() =>
				getAllByText(new RegExp("" + invitedUserTableHeadings[i].label, "i"))
			);
		}
	});
	test("Data listing of Invited User table", async () => {
		const { getByText } = invitedUserTable;
		await waitForElement(() => getByText(new RegExp("" + userListMock[0].email, "i")));
		await waitForElement(() => getByText(new RegExp("" + userListMock[0].role.name, "i")));
	});

	test("user peoject dialog test", async () => {
		let showProjectButton = await invitedUserTable.findAllByTestId("show-user-projects");
		await act(async () => {
			await fireEvent.click(showProjectButton[0]);
		});
		let projectDialog = await invitedUserTable.findByTestId("project-dialog");
		expect(projectDialog).toBeInTheDocument();
		const { getByText } = invitedUserTable;
		await waitForElement(() => getByText(new RegExp("build school", "i")));
	});

	test("Filter List test", async () => {
		let filterButton = await invitedUserTable.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

	test("Filter List Input Elements test", async () => {
		let filterButton = await invitedUserTable.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(filterButton);
		});

		let nameField = (await invitedUserTable.findByTestId(
			"invitedUserEmailInput"
		)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(nameField, { target: { value: intialFormValue.email } });
		});
		await expect(nameField.value).toBe(intialFormValue.email);

		// let roleField = (await invitedUserTable.findByTestId(
		// 	"invitedUserRoleInput"
		// )) as HTMLInputElement;
		// await act(async () => {
		// 	await fireEvent.change(roleField, {
		// 		target: { value: intialFormValue.role },
		// 	});
		// });
		// await expect(roleField.value).toBe(intialFormValue.role);
	});
});
