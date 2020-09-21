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
	const [value, setValue] = React.useState<number>(0);

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		value === 0 &&
			setImpactCategoryFilterList((obj) => {
				obj[elementToDelete] = "";
				return { ...obj };
			});

		value === 1 &&
			setImpactUnitFilterList((obj) => {
				obj[elementToDelete] = "";
				return { ...obj };
			});
	};

	return (
		<ImpactMasterView
			value={value}
			impactCategoryFilterList={impactCategoryFilterList}
			impactUnitFilterList={impactUnitFilterList}
			removeFilteListElements={removeFilteListElements}
			setImpactCategoryFilterList={setImpactCategoryFilterList}
			setImpactUnitFilterList={setImpactUnitFilterList}
			setValue={setValue}
		/>
	);
}

export default ImpactMasterContainer;
