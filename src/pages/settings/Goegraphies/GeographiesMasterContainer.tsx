import React, { useState, useEffect } from "react";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import GeographiesMasterView from "./GeographiesMasterView";
import { GEOGRAPHIES_COUNTRY_ACTIONS } from "../../../utils/access/modules/geographiesCountry/actions";
import { GEOGRAPHIES_STATE_ACTIONS } from "../../../utils/access/modules/geographiesState/actions";
import { GEOGRAPHIES_DISTRICT_ACTIONS } from "../../../utils/access/modules/geographiesDistrict/actions";
import { GEOGRAPHIES_BLOCK_ACTIONS } from "../../../utils/access/modules/geographiesBlock/actions";
import { GEOGRAPHIES_GRAMPANCHAYAT_ACTIONS } from "../../../utils/access/modules/geographiesGrampanchayat/actions";
import { GEOGRAPHIES_VILLAGE_ACTIONS } from "../../../utils/access/modules/geographiesVillage/actions";

function GeographiesMasterContainer() {
	const [geographiesCountryFilterList, setGeographiesCountryFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		// description: "",
	});

	const [geoGraphiesUnitFilterList, setgeoGraphiesUnitFilterList] = useState<{
		// const [geoRegionsUnitFilterList, setgeoRegionsUnitFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		country: "",
	});

	const geographiesCountryCreateAccess = userHasAccess(
		// const geographiesCountryCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.CREATE_DELIVERABLE_CATEGORY
	);

	// country ---
	// const geographiesCountryCreateAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_COUNTRY,
	// GEOGRAPHIES_COUNTRY_ACTIONS.CREATE_GEOGRAPHIES_COUNTRY
	// );
	// const geographiesCountryFindAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_COUNTRY,
	// GEOGRAPHIES_COUNTRY_ACTIONS.FIND_GEOGRAPHIES_COUNTRY
	// );

	// state ---

	// const geographiesStateCreateAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_STATE,
	// 	GEOGRAPHIES_STATE_ACTIONS.CREATE_GEOGRAPHIES_STATE
	// )
	// const geographiesStateFindAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_STATE,
	// 	GEOGRAPHIES_STATE_ACTIONS.FIND_GEOGRAPHIES_STATE
	// )

	// district ---
	// const geographiesDistrictCreateAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_DISTRICT,
	// 	GEOGRAPHIES_DISTRICT_ACTIONS.CREATE_GEOGRAPHIES_DISTRICT
	// )
	// const geographiesDistrictFindAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_DISTRICT,
	// 	GEOGRAPHIES_DISTRICT_ACTIONS.FIND_GEOGRAPHIES_DISTRICT
	// )

	// block ---
	// const geographiesBlockCreateAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_BLOCK,
	// 	GEOGRAPHIES_BLOCK_ACTIONS.CREATE_GEOGRAPHIES_BLOCK
	// )
	// const geographiesBlockFindAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_BLOCK,
	// 	GEOGRAPHIES_BLOCK_ACTIONS.FIND_BLOCK_STATE
	// )

	// grampanchayat ---
	// const geographiesGrampanchayatCreateAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_GRAMPANCHAYAT,
	// 	GEOGRAPHIES_GRAMPANCHAYAT_ACTIONS.CREATE_GEOGRAPHIES_GRAMPANCHAYAT
	// )
	// const geographiesGrampanchayatFindAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_GRAMPANCHAYAT,
	// 	GEOGRAPHIES_GRAMPANCHAYAT_ACTIONS.FIND_BLOCK_GRAMPANCHAYAT
	// )

	// village ---
	// const geographiesVillageCreateAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_VILLAGE,
	// 	GEOGRAPHIES_VILLAGE_ACTIONS.CREATE_GEOGRAPHIES_VILLAGE
	// )
	// const geographiesVillageFindAccess = userHasAccess(
	// 	MODULE_CODES.GEOGRAPHIES_VILLAGE,
	// 	GEOGRAPHIES_VILLAGE_ACTIONS.FIND_BLOCK_VILLAGE
	// )

	const deliverableUnitCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.CREATE_DELIVERABLE_UNIT
	);

	const geographiesCountryFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	const geographiesStateFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);
	const geographiesDistrictFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);
	const geographiesBlockFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);
	const geographiesGrampanchayatFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);
	const geographiesVillageFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);

	const [value, setValue] = React.useState<number>(0);

	useEffect(() => {
		if (geographiesCountryFindAccess) {
			setValue(0);
		} else {
			setValue(1);
		}
	}, [setValue, geographiesCountryFindAccess]);

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		value === 0 &&
			setGeographiesCountryFilterList((geographiesCountryFilterListObject) => {
				geographiesCountryFilterListObject[elementToDelete] = "";
				return { ...geographiesCountryFilterListObject };
			});
		value === 1 &&
			setgeoGraphiesUnitFilterList((geoGraphiesUnitFilterListObject) => {
				geoGraphiesUnitFilterListObject[elementToDelete] = "";
				return { ...geoGraphiesUnitFilterListObject };
			});
	};

	return (
		// <DeliverableMasterView
		<GeographiesMasterView
			value={value}
			geographiesCountryFilterList={geographiesCountryFilterList}
			// deliverableCategoryFilterList={geographiesFilterList}
			deliverableUnitFilterList={geoGraphiesUnitFilterList}
			removeFilteListElements={removeFilteListElements}
			setGeographiesCountryFilterList={setGeographiesCountryFilterList}
			setDeliverableUnitFilterList={setgeoGraphiesUnitFilterList}
			setValue={setValue}
			deliverableCategoryFindAccess={geographiesCountryFindAccess}
			deliverableUnitFindAccess={geographiesStateFindAccess}
			geographiesCountryCreateAccess={geographiesCountryCreateAccess}
			deliverableUnitCreateAccess={deliverableUnitCreateAccess}
		/>
	);
}

export default GeographiesMasterContainer;
