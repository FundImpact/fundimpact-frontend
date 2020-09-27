import { act, fireEvent, queries, RenderResult, waitForElement } from "@testing-library/react";
import React from "react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import { ProjectCardConfig } from "../../../../../models/cards/cards";
import { renderApollo } from "../../../../../utils/test.util";
import { ProjectCard } from "../index";

let mocks: any = [];

let projectCardConfig: ProjectCardConfig = {
	title: "Budget Target",
	mainHeading: "11.9M",
	rightUpperTitle: "0 / 19 Project",
	firstBarHeading: "23.4 Spend",
	firstBarValue: 50,
	secondBarHeading: "Fund Received",
	secondBarValue: 80,
};

let progressCard: RenderResult<typeof queries>;
beforeEach(() => {
	act(() => {
		progressCard = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<ProjectCard {...projectCardConfig} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Project Card and data listing", () => {
	test("renders correctly", async () => {
		await waitForElement(() =>
			progressCard.getByText(new RegExp("" + projectCardConfig.title, "i"))
		);
		await waitForElement(() =>
			progressCard.getByText(new RegExp("" + projectCardConfig.mainHeading, "i"))
		);
		await waitForElement(() =>
			progressCard.getByText(new RegExp("" + projectCardConfig.rightUpperTitle, "i"))
		);
		await waitForElement(() =>
			progressCard.getByText(new RegExp("" + projectCardConfig.firstBarHeading, "i"))
		);
		await waitForElement(() =>
			progressCard.getByText(new RegExp("" + projectCardConfig.secondBarHeading, "i"))
		);
	});
});
