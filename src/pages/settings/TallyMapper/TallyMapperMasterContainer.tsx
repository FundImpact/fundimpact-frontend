import React, { useState, useEffect } from "react";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import TallyMapperMasterView from "./TallyMapperMasterView";
import { COUNTRY_ACTION } from "../../../utils/access/modules/country/actions";
import { GEOGRAPHIES_STATE_ACTIONS } from "../../../utils/access/modules/geographiesState/actions";

function TallyMapperMasterContainer() {
	const [geographiesCountryFilterList, setGeographiesCountryFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
	});

	const [geoGraphiesUnitFilterList, setgeoGraphiesUnitFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		country: "",
	});

	const geographiesCountryCreateAccess = userHasAccess(
		MODULE_CODES.COUNTRY,
		COUNTRY_ACTION.CREATE_COUNTRY
		// MODULE_CODES.DELIVERABLE_CATEGORY,
		// DELIVERABLE_CATEGORY_ACTIONS.CREATE_DELIVERABLE_CATEGORY
	);

	const deliverableUnitCreateAccess = userHasAccess(
		MODULE_CODES.GEOGRAPHIES_STATE,
		GEOGRAPHIES_STATE_ACTIONS.CREATE_GEOGRAPHIES_STATE
	);

	const geographiesCountryFindAccess = userHasAccess(
		MODULE_CODES.COUNTRY,
		COUNTRY_ACTION.FIND_COUNTRY
	);

	const geographiesStateFindAccess = userHasAccess(
		MODULE_CODES.GEOGRAPHIES_STATE,
		GEOGRAPHIES_STATE_ACTIONS.FIND_GEOGRAPHIES_STATE
		// MODULE_CODES.DELIVERABLE_UNIT,
		// DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
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
		<TallyMapperMasterView
			value={value}
			geographiesCountryFilterList={geographiesCountryFilterList}
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

export default TallyMapperMasterContainer;
