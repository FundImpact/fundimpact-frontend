import React, { useState, useEffect } from "react";
import DeliverableMasterView from "../DeliverableMaster/DeliverableMasterView";
// import DeliverableMasterView from "./DeliverableMasterView";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import GeoRegionMasterView from "./GeoRegionMasterView";

function GeoRegionsMasterContainer() {
	const [geoRegionsFilterList, setGeoRegionsFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	const [geoRegionsUnitFilterList, setgeoRegionsUnitFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	// console.log("geoRegionsUnitFilterList", geoRegionsUnitFilterList);

	const deliverableCategoryCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.CREATE_DELIVERABLE_CATEGORY
	);

	console.log("deliverableCategoryCreateAccess", deliverableCategoryCreateAccess);

	const deliverableUnitCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.CREATE_DELIVERABLE_UNIT
	);

	const deliverableCategoryFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	console.log("deliverableCategoryFindAccess", deliverableCategoryFindAccess);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);

	const [value, setValue] = React.useState<number>(0);

	useEffect(() => {
		if (deliverableCategoryFindAccess) {
			setValue(0);
		} else {
			setValue(1);
		}
	}, [setValue, deliverableCategoryFindAccess]);

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		value === 0 &&
			setGeoRegionsFilterList((geoRegionsFilterListObject) => {
				geoRegionsFilterListObject[elementToDelete] = "";
				return { ...geoRegionsFilterListObject };
			});

		value === 1 &&
			setgeoRegionsUnitFilterList((geoRegionsUnitFilterListObject) => {
				geoRegionsUnitFilterListObject[elementToDelete] = "";
				return { ...geoRegionsUnitFilterListObject };
			});
	};

	return (
		// <DeliverableMasterView
		<GeoRegionMasterView
			value={value}
			deliverableCategoryFilterList={geoRegionsFilterList}
			// geoRegionsFilterList={geoRegionsFilterList}
			deliverableUnitFilterList={geoRegionsUnitFilterList}
			// geoRegionsUnitFilterList={geoRegionsUnitFilterList}
			removeFilteListElements={removeFilteListElements}
			// setgeoRegionsUnitFilterList={setGeoRegionsFilterList}
			setDeliverableCategoryFilterList={setGeoRegionsFilterList}
			// setgeoRegionsFilterList={setGeoRegionsFilterList}
			setDeliverableUnitFilterList={setgeoRegionsUnitFilterList}
			setValue={setValue}
			deliverableCategoryFindAccess={deliverableCategoryFindAccess}
			deliverableUnitFindAccess={deliverableUnitFindAccess}
			deliverableCategoryCreateAccess={deliverableCategoryCreateAccess}
			deliverableUnitCreateAccess={deliverableUnitCreateAccess}
		/>
	);
}

export default GeoRegionsMasterContainer;
