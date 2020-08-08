import React from "react";
import ReactDOM from "react-dom";
import AlertMessage from "./../AlertMessage";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<AlertMessage msg={"renders successfully"} />, div);
});

it("renders alert correctly", () => {
	const { getByTestId } = render(<AlertMessage severity="success" msg="successfully tested" />);
	expect(getByTestId("fi-alert")).toHaveTextContent("successfully tested");
});
