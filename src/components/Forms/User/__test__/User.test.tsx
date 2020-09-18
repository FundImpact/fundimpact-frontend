import React from "react";
import UserForm from "../index";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FORM_ACTIONS } from "../../constant";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { updateUserForm } from "./testInputField.json";
import { UPDATE_USER_DETAILS } from "../../../../graphql/User/mutation";

let userUpdateFormMutation = false;
const mocks = [
	{
		request: {
			query: UPDATE_USER_DETAILS,
			variables: {
				id: "2",
				input: {
					username: "username",
					email: "my@my.com",
					name: "name",
					profile_photo: "1",
				},
			},
		},
		result: () => {
			userUpdateFormMutation = true;
			return { data: {} };
		},
	},
];

let userUpdateForm: RenderResult<typeof queries>;
let data = {
	id: "2",
	name: "name",
	email: "email.com",
	username: "username",
	profile_photo: "1",
	uploadPhoto: "",
};
beforeEach(() => {
	act(() => {
		userUpdateForm = renderApollo(
			<NotificationProvider>
				<UserForm data={data} type={FORM_ACTIONS.UPDATE} />
			</NotificationProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Update User Form", () => {
	updateUserForm.forEach((formField) => {
		test(`should have ${formField.name} field`, () => {
			let updateUserFormField = userUpdateForm.getByTestId(formField.dataTestId);
			expect(updateUserFormField).toBeInTheDocument();
		});
	});

	test(`Submit Button enabels if all required field is have values and User Update mutaion call`, async () => {
		for (let i = 0; i < updateUserForm.length; i++) {
			let formField = updateUserForm[i];
			if (formField.value) {
				let updateUserFormField = userUpdateForm.getByTestId(
					formField.testId
				) as HTMLInputElement;
				act(() => {
					fireEvent.change(updateUserFormField, {
						target: { value: formField.value },
					});
				});

				expect(updateUserFormField.value).toBe(formField.value);
			}
		}

		let userUpdateFormSubmit = await userUpdateForm.findByTestId(`createSaveButton`);
		expect(userUpdateFormSubmit).toBeEnabled();
		act(() => {
			fireEvent.click(userUpdateFormSubmit);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(userUpdateFormMutation).toBe(true);
	});
});
