import { queries, render, RenderResult } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { Persistent } from "../../components/Forms/BasicDetailsForm/BasicDetailsForm";

let signupComponent: RenderResult<typeof queries>;
beforeEach(() => {
	signupComponent = render(
		<BrowserRouter>
			<Persistent />
		</BrowserRouter>
	);
});

describe("Basic Details Form (Signup Page)", () => {
	test("should have email Field", async () => {
		let emailField = await signupComponent.findByText("Email");
		expect(emailField).toBeInTheDocument();
	});

	test("should have password Field", async () => {
		let passwordField = await signupComponent.findByText("Password");
		expect(passwordField).toBeInTheDocument();
	});

	test("should have confirm password Field", async () => {
		let confirmPasswordField = await signupComponent.findByText("Confirm Password");
		expect(confirmPasswordField).toBeInTheDocument();
	});

	test("should have organisation name Field", async () => {
		let organisationField = await signupComponent.findByText("Organization Name");
		expect(organisationField).toBeInTheDocument();
	});
});
