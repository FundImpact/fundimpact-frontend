import { act, fireEvent, queries, RenderResult, waitForElement } from "@testing-library/react";
import React from "react";
import { DashboardProvider } from "../../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../../contexts/notificationContext";
import { ProgressCardConfig } from "../../../../../models/cards/cards";
import { renderApollo } from "../../../../../utils/test.util";
import { ProgressCard } from "../index";

let mocks: any = [];

let projectCardConfig: ProgressCardConfig = {
	dataToDisplay: [
		{
			id: "5",
			name: "COVID 19 VACCINE",
			avg_value: 90,
		},
	],
	dialogTitle: "Title",
};

let progressCard: RenderResult<typeof queries>;
beforeEach(() => {
	act(() => {
		progressCard = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<ProgressCard {...projectCardConfig} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Progress Card and data listing", () => {
	test("renders correctly", async () => {
		await waitForElement(() =>
			progressCard.getByText(new RegExp("" + projectCardConfig.dataToDisplay[0].name, "i"))
		);
		await waitForElement(() =>
			progressCard.getByText(
				new RegExp("" + projectCardConfig.dataToDisplay[0].avg_value, "i")
			)
		);
		let moreButton = await progressCard.findByTestId(`fundImpactMoreButton`);
		expect(moreButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(moreButton);
		});
		await waitForElement(() =>
			progressCard.getByText(new RegExp("" + projectCardConfig.dialogTitle, "i"))
		);
	});
});
