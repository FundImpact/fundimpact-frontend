import React, { useState } from "react";
import ImpactMasterView from "./ImpactMasterView";

function ImpactMasterContainer() {
	const [impactCategoryFilterList, setImpactCategoryFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});
	const [impactUnitFilterList, setImpactUnitFilterList] = useState<{ [key: string]: string }>({
		name: "",
		code: "",
		description: "",
	});
	const [showImpactUnitTable, setShowImpactUnitTable] = React.useState<number>(0);

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		showImpactUnitTable === 0 &&
			setImpactCategoryFilterList((impactCategoryFilterListObject) => {
				impactCategoryFilterListObject[elementToDelete] = "";
				return { ...impactCategoryFilterListObject };
			});

		showImpactUnitTable === 1 &&
			setImpactUnitFilterList((impactUnitFilterListObject) => {
				impactUnitFilterListObject[elementToDelete] = "";
				return { ...impactUnitFilterListObject };
			});
	};

	return (
		<ImpactMasterView
			showImpactUnitTable={showImpactUnitTable}
			impactCategoryFilterList={impactCategoryFilterList}
			impactUnitFilterList={impactUnitFilterList}
			removeFilteListElements={removeFilteListElements}
			setImpactCategoryFilterList={setImpactCategoryFilterList}
			setImpactUnitFilterList={setImpactUnitFilterList}
			setValue={setShowImpactUnitTable}
		/>
	);
}

export default ImpactMasterContainer;
