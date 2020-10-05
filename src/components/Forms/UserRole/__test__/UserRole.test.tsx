import React from "react";
import UserRoleForm from "../index";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FORM_ACTIONS } from "../../constant";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { sendUserInvitation } from "./testinputField.json";
import { INVITE_USER } from "../../../../graphql/UserRoles/mutation";
import {
	GET_INVITED_USER_LIST,
	GET_INVITED_USER_LIST_COUNT,
	GET_ROLES_BY_ORG,
} from "../../../../graphql/UserRoles/query";
import { rolesMock, userListMock } from "./testHelp";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { organizationDetail } from "../../../../utils/testMock.json";

let sendUserInvitationMutation = false;
const mocks = [
	{
		request: {
			query: INVITE_USER,
			variables: {
				input: {
					email: "my@my.com",
					role: "40",
					redirectTo: `${window.location.protocol}//${window.location.host}/account/profile`,
				},
			},
		},
		result: () => {
			sendUserInvitationMutation = true;
			return { data: {} };
		},
	},
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
			query: GET_INVITED_USER_LIST_COUNT,
			variables: {},
		},
		result: { data: { userListCount: 1 } },
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
	{
		request: {
			query: GET_ROLES_BY_ORG,
			variables: {
				filter: { organization: "13" },
			},
		},
		result: { data: { organizationRoles: rolesMock } },
	},
];

let sendUserInvitationForm: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		sendUserInvitationForm = renderApollo(
			<DashboardProvider defaultState={{ organization: organizationDetail }}>
				<NotificationProvider>
					<UserRoleForm type={FORM_ACTIONS.CREATE} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Update User Role Form", () => {
	sendUserInvitation.forEach((formField) => {
		test(`should have ${formField.name} field`, () => {
			let sendUserInvitationField = sendUserInvitationForm.getByTestId(formField.dataTestId);
			expect(sendUserInvitationField).toBeInTheDocument();
		});
	});

	test(`Submit Button enabels if all required field is have values and send invitation mutaion call`, async () => {
		for (let i = 0; i < sendUserInvitation.length; i++) {
			let formField = sendUserInvitation[i];
			if (formField.value) {
				let sendUserInvitationField = sendUserInvitationForm.getByTestId(
					formField.testId
				) as HTMLInputElement;
				act(() => {
					fireEvent.change(sendUserInvitationField, {
						target: { value: formField.value },
					});
				});

				expect(sendUserInvitationField.value).toBe(formField.value);
			}
		}

		let sendUserInvitationFormSubmit = await sendUserInvitationForm.findByTestId(
			`createSaveButton`
		);
		expect(sendUserInvitationFormSubmit).toBeEnabled();
		act(() => {
			fireEvent.click(sendUserInvitationFormSubmit);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(sendUserInvitationMutation).toBe(true);
	});
});
