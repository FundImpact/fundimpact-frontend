import React from "react";
import ReactDOM from "react-dom";
import AlertMessage from "./../AlertMessage";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<AlertMessage msg={"Render Without Crashing"} />, div);
});

it("renders alert component correctly", () => {
	const { getByTestId } = render(<AlertMessage severity="success" msg="successfully tested" />);
	expect(getByTestId("fi-alert")).toHaveTextContent("successfully tested");
});
