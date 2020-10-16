import { act, fireEvent, queries, render, RenderResult, wait } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";

import { ILoginForm } from "../../../models";
import LoginForm from "./LoginForm";

const intialFormValue: ILoginForm = {
	email: "deafult email",
	password: "deafult",
};
const onSubmitMock = jest.fn();
const clearError = jest.fn();
const validate = jest.fn((values: ILoginForm) => {
	const errors: { email?: string; password?: string } = !values.email
		? { email: "emailErrorfromValidate" }
		: {};
	if (!values.password) errors["password"] = "password message";
	return errors;
});

let loginForm: RenderResult<typeof queries>;
beforeEach(() => {
	act(() => {
		loginForm = render(
			<IntlProvider locale={"en"} defaultLocale="en">
				<LoginForm
					onSubmit={onSubmitMock}
					clearErrors={clearError}
					validate={validate}
					initialValues={intialFormValue}
				/>
			</IntlProvider>
		);
	});
});

describe("Login  Form", () => {
	test("should have Email  Field", async () => {
		let emailField = await loginForm.findByDisplayValue(`${intialFormValue.email}`);
		expect(emailField).toBeInTheDocument();
	});

	test("should have Password  Field", async () => {
		let passwordField = await loginForm.findByDisplayValue(`${intialFormValue.password}`);
		expect(passwordField).toBeInTheDocument();
	});

	test("should have Submit Button and enabled by default", async () => {
		let submitButton = await loginForm.findByTestId("submit");
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toBeEnabled();
	});

	test("should have set intialValues passed", async () => {
		let emailField = (await loginForm.findByDisplayValue(
			`${intialFormValue.email}`
		)) as HTMLInputElement;
		let passwordField = (await loginForm.findByDisplayValue(
			`${intialFormValue.password}`
		)) as HTMLInputElement;
		expect(emailField.value).toBe(intialFormValue.email);
		expect(passwordField.value).toBe(intialFormValue.password);
	});

	test("Submit Button should be disabled if email field is empty", async () => {
		let emailField = (await loginForm.findByDisplayValue(
			`${intialFormValue.email}`
		)) as HTMLInputElement;
		let value = "";

		act(() => {
			fireEvent.change(emailField, { target: { value } });
		});

		expect(emailField.value).toBe(value);
		let submitButton = await loginForm.findByTestId(`submit`);
		expect(submitButton).toBeDisabled();
	});

	test("Submit Button should be disabled if Password field is empty", async () => {
		let passwordField = (await loginForm.findByDisplayValue(
			`${intialFormValue.password}`
		)) as HTMLInputElement;
		let value = "";

		act(() => {
			fireEvent.change(passwordField, { target: { value } });
		});

		expect(passwordField.value).toBe(value);
		let submitButton = await loginForm.findByTestId(`submit`);
		expect(submitButton).toBeDisabled();
	});

	test("OnSubmit method should be called when User clicks on Submit button.", async () => {
		let submitButton = loginForm.container.querySelector(
			`button[type="submit"]`
		) as HTMLElement;

		await wait(() => fireEvent.click(submitButton));
		expect(onSubmitMock).toHaveBeenCalledTimes(1);
	});
});
