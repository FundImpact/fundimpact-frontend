import React, { useState } from "react";
import GeoRegionsMasterView from "./GeoRegionMasterView";

function GeoRegionsMasterContainer() {
	//change it to object
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		description: "",
	});

	console.log("tableFilterList", tableFilterList);

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		setTableFilterList((filterListObject) => {
			filterListObject[elementToDelete] = "";
			return { ...filterListObject };
		});
	};

	return (
		<div>
			<GeoRegionsMasterView
				tableFilterList={tableFilterList}
				setTableFilterList={setTableFilterList}
				removeFilteListElements={removeFilteListElements}
			/>
		</div>
	);
}

export default GeoRegionsMasterContainer;
