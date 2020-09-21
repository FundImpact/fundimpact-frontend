import React from "react";
import FilterListView from "./FilterListView";

function FilterListContainer<T extends { [key: string]: string | string[] }>({
	inputFields,
	setFilterList,
	initialValues = {},
}: {
	inputFields: any;
	setFilterList: React.Dispatch<React.SetStateAction<T>>;
	initialValues?: { [key: string]: any };
}) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
	return (
		<FilterListView
			inputFields={inputFields}
			anchorEl={anchorEl}
			setAnchorEl={setAnchorEl}
			setFilterList={setFilterList}
			initialValues={initialValues}
		/>
	);
}

export default FilterListContainer;
