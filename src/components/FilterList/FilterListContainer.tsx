import React from "react";
import FilterListView from "./FilterListView";

function FilterListContainer({ inputElements }: { inputElements: string[] }) {
	return <FilterListView inputElements={inputElements} />;
}

export default FilterListContainer;
