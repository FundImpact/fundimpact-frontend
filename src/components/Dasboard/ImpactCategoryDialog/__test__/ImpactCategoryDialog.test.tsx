import React from "react";
import ImpactCategoryDialog from "../ImpactCategoryDialog";
import { queries, render, act, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const handleClose = jest.fn();

let dialog: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		dialog = render(<ImpactCategoryDialog open={true} handleClose={handleClose} />);
	});
});

it("Dialog is rendered correctly", () => {
	const conponent = dialog.getByTestId("impact-category-dialog");
	expect(conponent).toBeInTheDocument();
});

it("Dialog render header correctly", () => {
	const header = dialog.getByTestId("impact-category-dialog-header");
	expect(header).toHaveTextContent("New Impact Indicators");
});