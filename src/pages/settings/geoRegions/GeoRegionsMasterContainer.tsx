import React, { useState } from "react";
// import BudgetMasterView from "./BudgetMasterView";
import GeoRegionsMasterView from "./GeoRegionMasterView";

function GeoRegionsMasterContainer() {
	//change it to object
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		// code: "",
		description: "",
	});

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		setTableFilterList((filterListObject) => {
			filterListObject[elementToDelete] = "";
			return { ...filterListObject };
		});
	};

	return (
		<div>
			<GeoRegionsMasterView
				// <BudgetMasterView
				tableFilterList={tableFilterList}
				setTableFilterList={setTableFilterList}
				removeFilteListElements={removeFilteListElements}
			/>
		</div>
	);
}

export default GeoRegionsMasterContainer;
