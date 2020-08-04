import React from "react";
import ReactDOM from "react-dom";
import CreateProject from "./../createProject";
import {
	act,
	fireEvent,
	queries,
	render,
	RenderResult,
	wait,
	cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import { IProject } from "../../../../models/project/project";
import { PROJECT_ACTIONS } from "../../../Project/constants";

const intialFormValue: IProject = {
	id: 1,
	name: "Project1",
	short_name: "P1",
	description: "",
	workspace: 2,
};
const onCreateMock = jest.fn();
const onUpdateMock = jest.fn();
const clearErrors = jest.fn();
const validate = jest.fn();
const formState = "CREATE";
const workspace: any = [{ id: 2, name: "Default" }];

let createForm: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		createForm = render(
			<CreateProject
				clearErrors={clearErrors}
				initialValues={intialFormValue}
				validate={validate}
				formState={PROJECT_ACTIONS.CREATE}
				onCreate={onCreateMock}
				onUpdate={onUpdateMock}
				workspace={workspace}
			/>
		);
	});
});

describe("Create project Form", () => {
	test("should have a name field", async () => {
		let nameField = await createForm.getByTestId("createProjectName");
		expect(nameField).toBeInTheDocument();
	});
	test("should have a short-name field", async () => {
		let shortNameField = await createForm.getByTestId("createProjectShortName");
		expect(shortNameField).toBeInTheDocument();
	});
	test("should have a workspace field", async () => {
		let workspacefield = await createForm.getByTestId("createProjectWorkspace");
		expect(workspacefield).toBeInTheDocument();
	});
	test("should have a description field", async () => {
		let descriptionField = await createForm.getByTestId("createProjectDescription");
		expect(descriptionField).toBeInTheDocument();
	});
	test("should have a submit button", async () => {
		let submitButton = await createForm.getByTestId("createProjectSubmit");
		expect(submitButton).toBeInTheDocument();
	});
});

it("matches project form snapshot", () => {
	const tree = renderer
		.create(
			<CreateProject
				clearErrors={clearErrors}
				initialValues={intialFormValue}
				validate={validate}
				formState={PROJECT_ACTIONS.CREATE}
				onCreate={onCreateMock}
				onUpdate={onUpdateMock}
				workspace={workspace}
			/>
		)
		.toJSON();
	expect(tree).toMatchSnapshot();
});
