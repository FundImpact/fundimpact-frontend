import React from "react";
import PasswordReset from "../index";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FORM_ACTIONS } from "../../constant";
import { renderApollo } from "../../../../utils/test.util";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { newPasswordForm } from "./testInputField.json";
import { UPDATE_PASSWORD } from "../../../../graphql/Password/mutation";

let resetPassFormMutation = false;
const mocks = [
	{
		request: {
			query: UPDATE_PASSWORD,
			variables: {
				id: "2",
				input: {
					password: "newpass",
					passwordConfirmation: "newpass",
				},
			},
		},
		result: () => {
			resetPassFormMutation = true;
			return { data: {} };
		},
	},
];

let resetPasswordForm: RenderResult<typeof queries>;
let open = true;
let close = jest.fn();
beforeEach(() => {
	act(() => {
		resetPasswordForm = renderApollo(
			<NotificationProvider>
				<PasswordReset
					open={open}
					handleClose={close}
					userId="2"
					type={FORM_ACTIONS.UPDATE}
				/>
			</NotificationProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

describe("Update User Form", () => {
	newPasswordForm.forEach((formField) => {
		test(`should have ${formField.name} field`, () => {
			let newPasswordFormField = resetPasswordForm.getByTestId(formField.dataTestId);
			expect(newPasswordFormField).toBeInTheDocument();
		});
	});

	test(`Submit Button enabels if all required field is have values and User Update mutaion call`, async () => {
		for (let i = 0; i < newPasswordForm.length; i++) {
			let formField = newPasswordForm[i];
			if (formField.value) {
				let newPasswordFormField = resetPasswordForm.getByTestId(
					formField.testId
				) as HTMLInputElement;
				act(() => {
					fireEvent.change(newPasswordFormField, {
						target: { value: formField.value },
					});
				});

				expect(newPasswordFormField.value).toBe(formField.value);
			}
		}

		let resetPasswordFormSubmit = await resetPasswordForm.findByTestId(`createSaveButton`);
		expect(resetPasswordFormSubmit).toBeEnabled();
		act(() => {
			fireEvent.click(resetPasswordFormSubmit);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(resetPassFormMutation).toBe(true);
	});
});
