import { cleanup, render } from "@testing-library/react";
import React from "react";

import AppRoutes from "./routes";

// import ReactDOM from 'react-dom';

// test("Provide current Step in SignUp based on url", () => {

// });

afterEach(cleanup);
test("App Route should render", () => {
	render(<AppRoutes />);
});
