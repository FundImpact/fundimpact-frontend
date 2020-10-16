import { queries, render, RenderResult } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { ILoginForm } from "../../models";
import Login from "./Login";

const intialFormValue: ILoginForm = {
	email: "abc",
	password: "sadas",
};

let loginPage: RenderResult<typeof queries>;
beforeEach(() => {
	loginPage = render(
		<IntlProvider locale={"en"} defaultLocale="en">
			<BrowserRouter>
				<Login intialFormValue={intialFormValue} />
			</BrowserRouter>
		</IntlProvider>
	);
});

describe("Login Page", () => {
	test("should have Email", async () => {
		let emailField = await loginPage.findByDisplayValue(`${intialFormValue.email}`);
		expect(emailField).toBeInTheDocument();
	});
	// test("should have Submit Button and enabled", async () => {
	// 	let submitButton = await loginPage.findByText("Submit");
	// 	expect(submitButton).toBeInTheDocument();
	// 	expect(submitButton).toBeEnabled();
	// });
	// test("Submit Button should be disabled if email field is empty", async () => {
	// 	let emailField = await loginPage.findByDisplayValue(`${intialFormValue.email}`);
	// 	fireEvent.change(emailField, { target: { value: "" } });
	// 	let submitButton = await loginPage.findByText("Submit");
	// 	expect(submitButton).toBeDisabled();
	// });
	// test("Submit Button should be disabled if password field is empty", async () => {
	// 	let passwordField = await loginPage.findByDisplayValue(`${intialFormValue.password}`);
	// 	fireEvent.change(passwordField, { target: { value: "" } });
	// 	let submitButton = await loginPage.findByText("Submit");
	// 	expect(submitButton).toBeDisabled();
	// });
	// test("Submit Button should be clicked on valid inputs...", async () => {
	// 	// const onSubmitFunction = jest.fn();
	// 	// // let passwordField = await loginPage.findByDisplayValue(`${intialFormValue.password}`);
	// 	// let submitButton = await loginPage.findByText("Submit");
	// 	// // expect(submitButton).toBeDisabled();
	// 	// const clicked = fireEvent.click(submitButton);
	// 	// expect(clicked).toBeTruthy();
	// });
});
