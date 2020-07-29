import { render, RenderResult } from "@testing-library/react";
import React from "react";

import { ILoginForm } from "../../../models";
import LoginForm from "./LoginForm";

const intialFormValue: ILoginForm = {
	email: "",
	password: "sadas",
};
const onSubmitMock = jest.fn();
const clearError = jest.fn();
const validate = jest.fn();

let loginForm: RenderResult<typeof import("/mnt/c/Users/Shadab/Repositories/fundimpact-frontend/node_modules/@types/testing-library__dom/queries")>;
beforeEach(() => {
	loginForm = render(
		<LoginForm
			onSubmit={onSubmitMock}
			clearErrors={clearError}
			validate={validate}
			initialValues={{ ...intialFormValue }}
		/>
	);
});

describe("Login  Form", () => {
	test("should have Email  Field", async () => {
		let emailField = await loginForm.findByDisplayValue(`${intialFormValue.email}`);
		expect(emailField).toBeInTheDocument();
	});

	test("should have Submit Button and enabled", async () => {
		let submitButton = await loginForm.findByText("Submit");
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toBeEnabled();
	});

	test("Submit Button should be disabled if email field is empty", async () => {
		let emailField = (await loginForm.findByDisplayValue(
			`${intialFormValue.email}`
		)) as HTMLInputElement;
		// act(() => {
		// 	fireEvent.change(emailField, { persist: jest.fn(), target: { value: null } });
		// });
		// loginForm.debug();
		// let submitButton = loginForm.container.querySelector("button[type='submit']");
		// loginForm.debug();
		// expect(emailField.value).toBe("");
		// expect(submitButton).toBeDisabled();

		// console.log(submitButton);
		// await wait(() => fireEvent.change(emailField, { target: { value: "" } }));
	});

	// test("Submit Button should be disabled if password field is empty", async () => {
	// 	let passwordField = await loginForm.findByDisplayValue(`${intialFormValue.password}`);
	// 	fireEvent.change(passwordField, { target: { value: "" } });
	// 	let submitButton = await loginForm.findByText("Submit");
	// 	expect(submitButton).toBeDisabled();
	// });

	// test("Submit Button should be clicked on valid inputs...", async () => {
	// 	let submitButton = await loginForm.findByText("Submit");
	// 	fireEvent.click(submitButton);
	// 	expect(onSubmitMock).toHaveBeenCalledTimes(1);
	// 	// const onSubmitFunction = jest.fn();
	// 	// // let passwordField = await loginPage.findByDisplayValue(`${intialFormValue.password}`);
	// 	// let submitButton = await loginPage.findByText("Submit");
	// 	// // expect(submitButton).toBeDisabled();
	// 	// const clicked = fireEvent.click(submitButton);
	// 	// expect(clicked).toBeTruthy();
	// });
});
