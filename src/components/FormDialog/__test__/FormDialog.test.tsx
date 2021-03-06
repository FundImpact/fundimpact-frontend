import React from "react";
import FormDialog from "../../FormDialog";
import { renderApollo } from "../../../utils/test.util";
import { act } from "react-dom/test-utils";

const handleClose = jest.fn();
const validate = jest.fn();

let dialog: any;

const intialFormValue: any = {
	code: "category code",
	description: "category description",
	name: "category namqfe",
};

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<FormDialog
				open={true}
				handleClose={handleClose}
				title="new title"
				subtitle="new subtitle"
				workspace="new workspace"
				loading={false}
				validate={validate}
			/>
		);
	});
});

describe("Budget Category Dialog tests", () => {
	test("Budget Category Dialog is rendered correctly", () => {
		const conponent = dialog.getByTestId("common-dialog");
		expect(conponent).toBeInTheDocument();
	});

	test("Budget Category Dialog render header correctly", () => {
		const header = dialog.getByTestId("dialog-header");
		expect(header).toHaveTextContent("new title");
	});
});
