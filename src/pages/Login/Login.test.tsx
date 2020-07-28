import { fireEvent, render, RenderResult } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { ILoginForm } from "../../models";
import Login from "./Login";

const intialFormValue: ILoginForm = {
	email: "abc",
	password: "sadas",
};

let loginPage: RenderResult<typeof import("/mnt/c/Users/Shadab/Repositories/fundimpact-frontend/node_modules/@types/testing-library__dom/queries")>;
beforeEach(() => {
	loginPage = render(
		<BrowserRouter>
			<Login intialFormValue={intialFormValue} />
		</BrowserRouter>
	);
});

describe("Login Page", () => {
	test("should have Email  Field", async () => {
		let emailField = await loginPage.findByDisplayValue(`${intialFormValue.email}`);
		expect(emailField).toBeInTheDocument();
	});

	test("should have Submit Button", async () => {
		let submitButton = await loginPage.findByText("Submit");
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toBeEnabled();
	});

	test("Submit Button should be disabled if email field is empty", async () => {
		let emailField = await loginPage.findByDisplayValue(`${intialFormValue.email}`);
		fireEvent.change(emailField, { target: { value: "" } });
		let submitButton = await loginPage.findByText("Submit");
		expect(submitButton).toBeDisabled();
	});

	test("Submit Button should be disabled if password field is empty", async () => {
		let passwordField = await loginPage.findByDisplayValue(`${intialFormValue.password}`);
		fireEvent.change(passwordField, { target: { value: "" } });
		let submitButton = await loginPage.findByText("Submit");
		expect(submitButton).toBeDisabled();
	});
});
