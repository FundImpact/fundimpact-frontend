import React, { useState, useEffect } from "react";
import ImpactMasterView from "./ImpactMasterView";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { IMPACT_CATEGORY_ACTIONS } from "../../../utils/access/modules/impactCategory/actions";
import { IMPACT_UNIT_ACTIONS } from "../../../utils/access/modules/impactUnit/actions";

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

	const impactCategoryFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.FIND_IMPACT_CATEGORY
	);

	const impactUnitFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.FIND_IMPACT_UNIT
	);

	const impactCategoryCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.CREATE_IMPACT_CATEGORY
	);

	const impactUnitCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.CREATE_IMPACT_UNIT
	);

	const [showImpactUnitTable, setShowImpactUnitTable] = React.useState<number>(0);

	useEffect(() => {
		if (impactCategoryCreateAccess) {
			setShowImpactUnitTable(0);
		} else {
			setShowImpactUnitTable(1);
		}
	}, [setShowImpactUnitTable, impactCategoryCreateAccess]);

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
			impactCategoryFindAccess={impactCategoryFindAccess}
			impactUnitFindAccess={impactUnitFindAccess}
			impactCategoryCreateAccess={impactCategoryCreateAccess}
			impactUnitCreateAccess={impactUnitCreateAccess}
		/>
	);
}

export default ImpactMasterContainer;
