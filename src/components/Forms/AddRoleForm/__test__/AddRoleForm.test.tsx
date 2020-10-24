import React from "react";
import { organizationDetails, projectDetails } from "../../../../utils/testMock.json";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../../utils/test.util";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { fireEvent, wait } from "@testing-library/dom";
import { GET_USER_ROLES } from "../../../../graphql/User/query";
import { RenderResult } from "@testing-library/react";
import { addRoleForm } from "../inputField.json";
import AddRoleForm from "../";
import { GET_ROLES_BY_ORG } from "../../../../graphql/UserRoles/query";
import { rolesMock } from "../../UserRole/__test__/testHelp";
import { CREATE_ORGANIZATION_USER_ROLE } from "../../../../graphql/AddRole/mutation";

const handleClose = jest.fn();

let dialog: RenderResult;
let creationOccured = false;

const intialFormValue: { name: string } = {
	name: "admin",
};

let mockInputData = {
	name: intialFormValue.name,
	permissions: {
		application: {
			controllers: {
				"budget-tracking-lineitem": {
					find: {
						enabled: false,
						policy: "",
					},
				},
			},
		},
	},
	is_project_level: true,
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
		result: {
			data: {
				getRolePemissions: [
					{
						id: "46572",
						controller: "budget-tracking-lineitem",
						action: "find",
						enabled: false,
					},
				],
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
			query: CREATE_ORGANIZATION_USER_ROLE,
			variables: {
				id: organizationDetails.id,
				input: mockInputData,
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createOrganizationUserRole: {
						organization: {
							id: organizationDetails.id,
							name: organizationDetails.name,
						},
					},
				},
			};
		},
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<AddRoleForm open={true} handleClose={handleClose} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

const inputIds = [...addRoleForm];
inputIds.pop();

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Add Role Form tests", () => {
	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<{ name: string }>({
				inputFields: inputIds,
				reactElement: dialog,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled<{ name: string }>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: dialog,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	test("check if addRoleIsProjectLevelForm  is in the document", async () => {
		let switchButtoon = await dialog.findByTestId("addRoleIsProjectLevelForm");
		expect(switchButtoon).toBeInTheDOM();
	});

	test("Mock response", async () => {
		let switchButtoon = await dialog.findByTestId("addRoleIsProjectLevelForm");
		expect(switchButtoon).toBeInTheDOM();
		await act(async () => {
			fireEvent.click(switchButtoon);
		});
		await triggerMutation<{ name: string }>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
