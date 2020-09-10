import { queries, render, RenderResult } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { Persistent } from "../../components/Forms/BasicDetailsForm/BasicDetailsForm";

let signupComponent: RenderResult<typeof queries>;
beforeEach(() => {
	signupComponent = render(
		<IntlProvider locale={"en"} defaultLocale="en">
			<BrowserRouter>
				<Persistent />
			</BrowserRouter>
		</IntlProvider>
	);
});

describe("Basic Details Form (Signup Page)", () => {
	test("should have email Field", async () => {
		let emailField = await signupComponent.findByTestId("email");
		expect(emailField).toBeInTheDocument();
	});

	test("should have password Field", async () => {
		let passwordField = await signupComponent.findByTestId("signup-password");
		expect(passwordField).toBeInTheDocument();
	});

	test("should have organisation name Field", async () => {
		let organisationField = await signupComponent.findByTestId("organisationName");
		expect(organisationField).toBeInTheDocument();
	});
});
