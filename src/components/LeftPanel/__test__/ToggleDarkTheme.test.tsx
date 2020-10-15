import React from "react";
import { organizationDetails, projectDetails } from "../../../utils/testMock.json";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { mockUser, mockUserDetails } from "../../../utils/testMock.json";
import { fireEvent } from "@testing-library/dom";
import {  GET_USER_DETAILS } from "../../../graphql/User/query";
import ToggleDarkTheme from "../ToggleDarkTheme";
import { RenderResult } from "@testing-library/react";
import { UPDATE_USER_DETAILS } from "../../../graphql/User/mutation";

let darkThemeToggle: RenderResult;
let updationOccured = false;

const mocks = [
	{
		request: {
			query: UPDATE_USER_DETAILS,
			variables: {
				id: mockUser.user.id,
				input: {
					theme: {
						palette: {
							type: mockUser.user.theme.palette.type == "dark" ? "light" : "dark",
						},
					},
				},
			},
		},
		result: () => {
			updationOccured = true;
			return {
				data: {
					updateUserCustomerInput: {
						...mockUser.user,
						theme: mockUser.user.theme.palette.type == "dark" ? "light" : "dark",
					},
				},
			};
		},
	},
	{
		request: {
			query: GET_USER_DETAILS,
			variables: {},
		},
		result: {
			data: {
				userCustomer: mockUserDetails,
			},
		},
	},
];

beforeEach(() => {
	act(() => {
		darkThemeToggle = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<ToggleDarkTheme />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Toggle dark theme tests", () => {
	test("check dark theme toggle button is available", () => {
		let toggleButton = darkThemeToggle.getByTestId("dark-theme-toggle-button");
		expect(toggleButton).toBeInTheDocument();
	});
	test("check theme updation occur when toggle button is clicked", async () => {
		let toggleButton = await darkThemeToggle.findByTestId("dark-theme-toggle-button");
		await act(async () => {
			fireEvent.click(toggleButton);
		});
		expect(updationOccured).toBe(true);
	});
});
