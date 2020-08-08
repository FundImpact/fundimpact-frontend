import React from "react";
import { renderApollo } from "../../../../utils/test.util";
import { waitForElement, fireEvent, wait } from "@testing-library/react";
import ProjectName from "../ProjectName";
import { GET_PROJECT_BY_ID, UPDATE_PROJECT } from "../../../../graphql/queries/project";
import { act } from "react-dom/test-utils";

const getProjectMock = {
	__typename: "Project",
	id: "1",
	name: "KALAMKAAR",
	short_name: "KMK",
	description: "",
};

let updateProjectMutation = false;

describe("Update Project text display and update", () => {
	test("renders correctly", async () => {
		const mocks = [
			{
				request: {
					query: GET_PROJECT_BY_ID,
					variables: { id: 1 },
				},
				result: { data: { project: getProjectMock } },
			},
			{
				request: {
					query: UPDATE_PROJECT,
					variables: {
						id: 1,
						input: { name: "ARTISTAAN", short_name: "KMK", description: "" },
					},
				},
				result: () => {
					updateProjectMutation = true;
					return {};
				},
			},
		];
		const { getByText, getByTestId } = await renderApollo(<ProjectName />, {
			mocks,
			resolvers: {},
		});
		await waitForElement(() => getByText(/KALAMKAAR/i));

		const editButton = getByTestId("editable-edit");
		fireEvent.click(editButton);

		let inputField = getByTestId("editable-input") as HTMLInputElement;
		let value = "ARTISTAAN";
		act(() => {
			fireEvent.change(inputField, { target: { value } });
		});

		const saveButton = getByTestId("editable-save");
		fireEvent.click(saveButton);

		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(updateProjectMutation).toBe(true);
	});
});
