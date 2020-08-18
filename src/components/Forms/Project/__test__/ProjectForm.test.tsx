import React, { Children } from "react";
import ProjectForm from "../projectForm";
import { act, fireEvent, queries, render, RenderResult } from "@testing-library/react";
import "../../../Deliverable/__test__/__test__/node_modules/@testing-library/jest-dom/extend-expect";
import { IProject } from "../../../../models/project/project";
import { PROJECT_ACTIONS } from "../../../Project/constants";

const intialFormValue: IProject = {
	id: 1,
	name: "Project1",
	short_name: "P1",
	description: "",
	workspace: "2",
};
const onCreateMock = jest.fn();
const onUpdateMock = jest.fn();
const clearErrors = jest.fn();
const handleFormOpen = jest.fn();
const formIsOpen = true;
const validate = jest.fn((values: IProject) => {
	let errors: Partial<IProject> = {};
	if (!values.name && !values.name.length) {
		errors.name = "Name is required";
	}
	if (!values.workspace) {
		errors.workspace = "workspace is required";
	}
	return errors;
});

const formState = PROJECT_ACTIONS.CREATE;
const workspaces: any = [
	{ id: "2", name: "EDUCATION" },
	{ id: "4", name: "HEALTH" },
];

let createForm: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		createForm = render(
			<ProjectForm
				clearErrors={clearErrors}
				initialValues={intialFormValue}
				validate={validate}
				formState={PROJECT_ACTIONS.CREATE}
				onCreate={onCreateMock}
				onUpdate={onUpdateMock}
				workspaces={workspaces}
				handleFormOpen={handleFormOpen}
				formIsOpen={formIsOpen}
			/>
		);
	});
});

describe("Create project Form", () => {
	test("should have a name field", () => {
		let nameField = createForm.getByTestId("createProjectName");
		expect(nameField).toBeInTheDocument();
	});
	test("should have a short-name field", () => {
		let shortNameField = createForm.getByTestId("createProjectShortName");
		expect(shortNameField).toBeInTheDocument();
	});
	test("should have a workspace field", () => {
		let workspacefield = createForm.getByTestId("createProjectWorkspace");
		expect(workspacefield).toBeInTheDocument();
	});

	// for (let i = 0; i < workspace.length; i++) {
	// 	test("option should match", async () => {
	// 		const myElem = fireEvent.click(createForm.getByLabelText(/Choose Workspace/i));
	// 		let option = createForm.getByTestId(`createProjectSelectOption${workspace[i].id}`);
	// 		expect(option).toBeInTheDocument();
	// 	});
	// }

	test("should have a description field", () => {
		let descriptionField = createForm.getByTestId("createProjectDescription");
		expect(descriptionField).toBeInTheDocument();
	});
	test("should have a submit button", () => {
		let submitButton = createForm.getByTestId("createProjectSubmit");
		expect(submitButton).toBeInTheDocument();
	});

	test("should have initial values", () => {
		let nameField = createForm.getByTestId("createProjectNameInput") as HTMLInputElement;
		expect(nameField.value).toBe(intialFormValue.name);

		let shortNameField = createForm.getByTestId(
			"createProjectShortNameInput"
		) as HTMLInputElement;
		expect(shortNameField.value).toBe(intialFormValue.short_name);

		let optionField = createForm.getByTestId(
			"createProjectWorkspaceOption"
		) as HTMLInputElement;
		expect(optionField.value).toBe(workspaces[0].id);

		let descriptionField = createForm.getByTestId(
			"createProjectDescriptionInput"
		) as HTMLInputElement;
		expect(descriptionField.value).toBe(intialFormValue.description);
	});

	test("Submit Button should be disabled if name field is empty", async () => {
		let nameField = createForm.getByTestId("createProjectNameInput") as HTMLInputElement;
		let value = "";
		act(() => {
			fireEvent.change(nameField, { target: { value } });
		});
		expect(nameField.value).toBe(value);
		let submitButton = await createForm.findByTestId(`createProjectSubmit`);
		expect(submitButton).toBeDisabled();
	});
});
