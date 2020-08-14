import React from "react";
import ImpaceUnitDialog from "../ImpaceUnitDialog";
import { queries, render, act, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const handleClose = jest.fn();

let dialog: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		dialog = render(<ImpaceUnitDialog open={true} handleClose={handleClose} />);
	});
});

it("Dialog is rendered correctly", () => {
	const conponent = dialog.getByTestId("impact-unit-dialog");
	expect(conponent).toBeInTheDocument();
});

it("Dialog render header correctly", () => {
	const header = dialog.getByTestId("impact-unit-dialog-header");
	expect(header).toHaveTextContent("New Impact Indicators");
});
