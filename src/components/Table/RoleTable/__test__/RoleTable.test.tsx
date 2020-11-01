import React from "react";
import { waitForElement, fireEvent, RenderResult } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	projectDonorMock,
} from "../../../../utils/testMock.json";
import { GET_PROJECT_DONORS } from "../../../../graphql";
import RoleTable from "../RoleTableGraphql";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import { GET_ROLES_BY_ORG } from "../../../../graphql/UserRoles/query";
import { rolesMock } from "../../../Forms/UserRole/__test__/testHelp";
import { UPDATE_ORGANIZATION_USER_ROLE } from "../../../../graphql/AddRole/mutation";

let table: RenderResult;

let updationOccured = false;

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
			query: GET_USER_ROLES,
			variables: {
				filter: {
					role: rolesMock[0].id,
				},
			},
		},
		result: { data: mockUserRoles },
	},
	{
		request: {
			query: GET_PROJECT_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projDonors: projectDonorMock,
			},
		},
	},
	{
		request: {
			query: GET_ROLES_BY_ORG,
			variables: {
				organization: organizationDetails.id,
			},
		},
		result: { data: { organizationRoles: rolesMock } },
	},
	{
		request: {
			query: UPDATE_ORGANIZATION_USER_ROLE,
			variables: {
				id: rolesMock[0].id,
				input: {
					name: rolesMock[0].id,
					permissions: {
						application: {
							controllers: {},
						},
					},
				},
			},
		},
		result: () => {
			updationOccured = true;

			return {
				data: {
					updateOrganizationUserRole: {
						...rolesMock[0],
					},
				},
			};
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
					<RoleTable />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

jest.setTimeout(7000);

describe("Role table tests", () => {
	test(`Table Headings Permissions for Role table`, async () => {
		await waitForElement(() => table.getAllByText("Permissions"));
	});

	for (let i = 0; i < rolesMock.length; i++) {
		test(`Table Headings ${rolesMock[i].name} for Role table`, async () => {
			await waitForElement(() => table.getAllByText(rolesMock[i].name));
		});
	}

	for (let i = 0; i < mockUserRoles.getRolePemissions.slice(0, 10).length; i++) {
		test("renders correctly", async () => {
			await waitForElement(() =>
				table.findAllByText(
					new RegExp("" + mockUserRoles.getRolePemissions[i].controller, "i")
				)
			);

			await waitForElement(() =>
				table.findAllByText(new RegExp("" + mockUserRoles.getRolePemissions[i].action, "i"))
			);
		});
	}

	for (let i = 0; i < mockUserRoles.getRolePemissions.slice(0, 10).length; i++) {
		test(`renders correctly ${mockUserRoles.getRolePemissions[i].controller}-${mockUserRoles.getRolePemissions[i].action}-${rolesMock[0].id}-input`, async () => {
			let checkbox = await table.findByTestId(
				`${mockUserRoles.getRolePemissions[i].controller}-${mockUserRoles.getRolePemissions[i].action}-${rolesMock[0].id}-input`
			);
			expect(checkbox).toBeInTheDOM();
		});
	}

	test(`update role test`, async () => {
		for (let i = 0; i < mockUserRoles.getRolePemissions.slice(0, 10).length; i++) {
			let checkbox = await table.findByTestId(
				`${mockUserRoles.getRolePemissions[i].controller}-${mockUserRoles.getRolePemissions[i].action}-${rolesMock[0].id}-input`
			);
			await act(async () => {
				await fireEvent.click(checkbox);
			});
			let checkBoxInputElement = checkbox.querySelector('input[type="checkbox"]');
			expect(checkBoxInputElement).toHaveProperty("checked", true);
		}
		let updateButton = table.getByTestId("createUpdateButton");
		await act(async () => {
			await fireEvent.click(updateButton);
		});
	});
});
