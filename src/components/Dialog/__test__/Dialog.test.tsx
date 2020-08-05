import React from "react";
import ReactDOM from "react-dom";
import Dialog from "./../Dialog";
import { queries, render, getNodeText, screen, act, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";

const handleClose = jest.fn();

let dialog: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		dialog = render(
			<Dialog
				header="MyDialogHeader"
				open={true}
				handleClose={handleClose}
				children={<div>My Dialog children</div>}
			/>
		);
	});
});

it("Dialog renders header correctly", () => {
	const component = dialog.getByTestId("fi-dialog-header");
	expect(dialog.getByTestId("fi-dialog-header")).toHaveTextContent("MyDialogHeader");
});

it("Dialog renders children correctly", () => {
	const component = dialog.getByTestId("fi-dialog-header");
	expect(dialog.getByTestId("fi-dialog-children")).toHaveTextContent("My Dialog children");
});
