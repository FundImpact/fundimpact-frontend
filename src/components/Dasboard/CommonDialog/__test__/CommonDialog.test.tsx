import React from "react";
import CommonDialog from "../CommonDialog";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { CREATE_ORG_BUDGET_CATEGORY } from "../../../../graphql/queries/budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";

const handleClose = jest.fn();
const onUpdate = jest.fn();
const onSubmit = jest.fn();
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
			<CommonDialog
				open={true}
				handleClose={handleClose}
				onUpdate={onUpdate}
				initialValues={intialFormValue}
				inputFields={[]}
				loading={false}
				onSubmit={onSubmit}
				title="new title"
				subtitle="new subtitle"
				validate={validate}
				workspace="new workspace"
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
