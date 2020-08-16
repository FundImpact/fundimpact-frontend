import React from "react";
import ReactDOM from "react-dom";
import Snackbar from "./../Snackbar";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { DashboardProvider } from "../../../contexts/dashboardContext";

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(
		<DashboardProvider>
			<NotificationProvider>
				<Snackbar msg={"Render Without Crashing"} />
			</NotificationProvider>
		</DashboardProvider>,
		div
	);
});

it("renders snackbar component correctly", () => {
	const { getByTestId } = render(
		<DashboardProvider>
			<NotificationProvider>
				<Snackbar severity="success" msg="successfully tested" />
			</NotificationProvider>
		</DashboardProvider>
	);
	expect(getByTestId("fi-snackbar")).toHaveTextContent("successfully tested");
});
