import React from "react";
import CreateBudgetDialog from "../CreateBudgetDialog";
import { queries, render, act, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const handleClose = jest.fn();

let dialog: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		dialog = render(<CreateBudgetDialog open={true} handleClose={handleClose} />);
	});
});

it("Dialog is rendered correctly", () => {
	const conponent = dialog.getByTestId("create-budget-dialog");
	expect(conponent).toBeInTheDocument();
});

it("Dialog render header correctly", () => {
	const header = dialog.getByTestId("create-budget-dialog-header");
	expect(header).toHaveTextContent("New Budget");
});