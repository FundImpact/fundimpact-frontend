import { cleanup } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// test("Provide current Step in SignUp based on url", () => {

// });

afterEach(cleanup);
test("App component should render", () => {
	const root = document.createElement("div");
	ReactDOM.render(<App />, root);
});
