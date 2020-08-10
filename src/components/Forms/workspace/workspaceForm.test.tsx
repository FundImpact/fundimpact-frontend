import { act, fireEvent, queries, render, RenderResult, wait } from "@testing-library/react";
import React from "react";

import { ILoginForm } from "../../../models";
import { IWorkspace } from "../../../models/workspace/workspace";
import { WORKSPACE_ACTIONS } from "../../workspace/constants";
import WorkspaceForm from "./workspaceForm";

const initialValues: IWorkspace = {
	name: "testing",
	short_name: "testing shortname",
	description: "",
	organisation: 4,
};
const clearError = jest.fn();
const onCreate = jest.fn();
const onUpdate = jest.fn();
const clearErrors = jest.fn();
const formState: WORKSPACE_ACTIONS = WORKSPACE_ACTIONS.CREATE;
const validate = jest.fn((values: ILoginForm) => {
	return {};
});

let workspaceForm: RenderResult<typeof queries>;
beforeEach(() => {
	act(() => {
		workspaceForm = render(
			<WorkspaceForm
				{...{
					clearError,
					initialValues,
					onCreate,
					onUpdate,
					validate,
					clearErrors,
					formState,
				}}
			/>
		);
	});
});

describe("Workspace  Form", () => {
	test("should have Name  Field and match the initial value provided", async () => {
		let name = await workspaceForm.findByTestId("name");
		expect(name).toBeInTheDocument();
		expect((name.querySelector(`input[name="name"]`) as HTMLInputElement).value).toBe(
			`${initialValues.name}`
		);
	});

	test("should have Short Name Field and match the initial value provided", async () => {
		let shortName = await workspaceForm.findByTestId("short_name");
		expect(shortName).toBeInTheDocument();
		expect(
			(shortName.querySelector(`input[name="short_name"]`) as HTMLInputElement).value
		).toBe(`${initialValues.short_name}`);
	});

	test("should have Description  Field and match the initial value provided", async () => {
		let description = await workspaceForm.findByTestId("description");
		expect(description).toBeInTheDocument();
		expect(
			(description.querySelector(`textarea[name="description"]`) as HTMLInputElement).value
		).toBe(`${initialValues.description}`);
	});

	test("Submit Button should be enabled if Name and Short Name is provided, irrespective of description field", async () => {
		let submitButton = await workspaceForm.findByTestId("submit");
		expect(submitButton).toBeEnabled();
	});

	test("should not have been submitted if Name is not provided.", async () => {
		let submitButton = await workspaceForm.findByTestId("submit");
		let name = (await workspaceForm.findByTestId("name")).querySelector(
			`input[name="name"]`
		) as HTMLInputElement;

		act(() => {
			fireEvent.change(name, { target: { value: "" } });
		});
		fireEvent.click(submitButton);
		expect(onCreate).toHaveBeenCalledTimes(0);
	});

	test("should not have been submitted if Short Name is not provided.", async () => {
		let submitButton = await workspaceForm.findByTestId("submit");
		let shortName = (await workspaceForm.findByTestId("short_name")).querySelector(
			`input[name="short_name"]`
		) as HTMLInputElement;

		act(() => {
			fireEvent.change(shortName, { target: { value: "" } });
		});
		fireEvent.click(submitButton);
		expect(onCreate).toHaveBeenCalledTimes(0);
	});

	test("Submit Button should have text Create if Workspace Action is Create", async () => {
		let submitButton = await workspaceForm.findByTestId("submit");
		expect(submitButton.textContent).toBe("Create");
	});

	test("should call onCreate Function is Workpsace Action is Create", async () => {
		/**
		 * @description You may be wondering why we are fire Submit even like this
		 * instead of using simple submit button click? It turns out react-testing-library
		 * does not trigger submit event if the submit button is outside of the form even after
		 * linking the the button to the form.
		 */
		act(() => {
			fireEvent.submit(workspaceForm.baseElement.querySelector("#workspace_form") as Element);
		});
		await wait(() => expect(onCreate).toHaveBeenCalled());
	});

	test("should call onUpdate Function is Workpsace Action is Update", async () => {
		workspaceForm.unmount();
		act(() => {
			workspaceForm = render(
				<WorkspaceForm
					{...{
						clearError,
						initialValues,
						onCreate,
						onUpdate,
						validate,
						clearErrors,
						formState: WORKSPACE_ACTIONS.UPDATE,
					}}
				/>
			);
		});
		/**
		 * @description You may be wondering why we are fire Submit even like this
		 * instead of using simple submit button click? It turns out react-testing-library
		 * does not trigger submit event if the submit button is outside of the form even after
		 * linking the the button to the form.
		 */
		act(() => {
			fireEvent.submit(workspaceForm.baseElement.querySelector("#workspace_form") as Element);
		});
		await wait(() => expect(onUpdate).toHaveBeenCalled());
	});
});
