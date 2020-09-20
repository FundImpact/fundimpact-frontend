import React from "react";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../utils/test.util";
import { fireEvent, wait } from "@testing-library/dom";
import FilterList from "../FilterListContainer";
import { budgetCategoryInputFields } from "../../../pages/settings/BudgetMaster/inputFields.json";

const setFilterList = jest.fn();
let filterButton: any;

beforeEach(() => {
	act(() => {
		filterButton = renderApollo(
			<FilterList
				inputFields={budgetCategoryInputFields}
				initialValues={{}}
				setFilterList={setFilterList}
			/>
		);
	});
});

describe("Filter List tests", () => {
	test("Filter button render properly", () => {
		let button = filterButton.getByTestId("filter-button");
		expect(button).toBeInTheDocument();
	});

	test("Popover render properly", async () => {
		let button = filterButton.getByTestId("filter-button");
		await act(async () => {
			await fireEvent.click(button);
		});

		let popover = filterButton.getByTestId("filter-list-popover");
		expect(popover).toBeInTheDocument();
	});

	test("Input Elements render properly", async () => {
		let button = filterButton.getByTestId("filter-button");
		await act(async () => {
			await fireEvent.click(button);
		});

		for (let i = 0; i < budgetCategoryInputFields.length; i++) {
			let inputElement = filterButton.getByTestId(budgetCategoryInputFields[i].dataTestId);
			expect(inputElement).toBeInTheDocument();
		}
	});
});
