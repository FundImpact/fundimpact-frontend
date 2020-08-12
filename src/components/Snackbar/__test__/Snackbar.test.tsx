import React from "react";
import ReactDOM from "react-dom";
import Snackbar from "./../Snackbar";
import { render } from "@testing-library/react";
import "../../Forms/Project/__test__/node_modules/@testing-library/jest-dom/extend-expect";

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<Snackbar msg={"Render Without Crashing"} />, div);
});

it("renders snackbar component correctly", () => {
	const { getByTestId } = render(<Snackbar severity="success" msg="successfully tested" />);
	expect(getByTestId("fi-snackbar")).toHaveTextContent("successfully tested");
});
