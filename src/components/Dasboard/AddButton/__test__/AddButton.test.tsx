import React from "react";
import { act, fireEvent, queries, RenderResult, wait } from "@testing-library/react";
import AddButton from "../AddButton";
import { renderApollo } from "../../../../utils/test.util";
interface CreateButton {
	text: string;
}

const mockCreateButtonsData = [
	{ text: "Create Budget" },
	{ text: "Create Deliverables" },
	{ text: "Create Impact Indicators" },
	{ text: "Add Donor" },
	{ text: "Create Budget Indicators" },
	{ text: "Track Budget Spend" },
	{ text: "Report Fund Receipt" },
];

let addButton: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		addButton = renderApollo(<AddButton createButtons={mockCreateButtonsData} />);
	});
});

describe("Add Button", () => {
	test("Add Button Should Render On Screen", () => {
		let component = addButton.getByTestId("add-button");
		expect(component).toBeInTheDocument();
	});

	test("Various buttons should not be visible before clicking add button", () => {
		mockCreateButtonsData.forEach((createButton: CreateButton): void => {
			let buttonFound = addButton.getByText(createButton.text);
			expect(buttonFound).not.toBeVisible();
		});
	});

	test("Various buttons should visible on clicking add button", () => {
		let component = addButton.getByTestId("add-button");
		fireEvent.click(component);

		mockCreateButtonsData.forEach((createButton: CreateButton): void => {
			let buttonFound = addButton.getByText(createButton.text);
			expect(buttonFound).toBeVisible();
		});
	});

	test("Various buttons should visible on clicking add button", async () => {
		fireEvent.click(addButton.getByTestId("add-button"));
		await wait(() => {
			let slider = addButton.getByTestId("sliding-buttons");
			expect(slider).toBeVisible();
		});
		fireEvent.click(addButton.getByTestId("add-button"));

		await wait(() => {
			let slider = addButton.getByTestId("sliding-buttons");
			expect(slider).not.toBeVisible();
		});

		let slider = addButton.getByTestId("sliding-buttons");
		expect(slider).not.toBeVisible();
	});
});
