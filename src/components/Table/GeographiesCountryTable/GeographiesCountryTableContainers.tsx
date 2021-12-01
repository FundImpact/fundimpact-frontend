import React, { useState, useRef, useEffect } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import GeographiesCountryTableView from "./GeographiesCountryTableView";
import { IGeographies, IGeographiesCountryData } from "../../../models/geographies/geographies";
import { COUNTRY_ACTION } from "../../../utils/access/modules/country/actions";

const getInitialValues = (
	geographiesCountry: IGeographiesCountryData | null,
	organization?: string
): IGeographies => {
	return {
		code: geographiesCountry?.code || "",
		id: parseInt(geographiesCountry?.id || ""),
		name: geographiesCountry?.name || "",
		organization,
	};
};

function GeographiesCountryTableContainer({
	geographiesCountryList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	filterList,
	setFilterList,
	removeFilterListElements,
	reftechDeliverableCategoryAndUnitTable,
}: {
	orderBy: string;
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	geographiesCountryList: IGeographiesCountryData[];
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	loading: boolean;
	filterList: {
		[key: string]: string;
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	reftechDeliverableCategoryAndUnitTable: () => void;
}): JSX.Element {
	const editGeographiesCountry = false,
		deleteGeographiesCountry = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesCountry,
		deleteGeographiesCountry,
	]);
	const selectedGeographiesCountry = useRef<IGeographiesCountryData | null>(null);

	const dashboardData = useDashBoardData();

	const toggleDialogs = (index: number, dialogOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogOpenStatus : element))
		);
	};

	const geographiesCountryEditAccess = userHasAccess(
		MODULE_CODES.COUNTRY,
		COUNTRY_ACTION.UPDATE_COUNTRY
		// MODULE_CODES.DELIVERABLE_CATEGORY,
		// DELIVERABLE_CATEGORY_ACTIONS.UPDATE_DELIVERABLE_CATEGORY
	);

	const geographiesCountryDeleteAccess = userHasAccess(
		MODULE_CODES.COUNTRY,
		COUNTRY_ACTION.DELETE_COUNTRY
		// MODULE_CODES.DELIVERABLE_CATEGORY,
		// DELIVERABLE_CATEGORY_ACTIONS.DELETE_DELIVERABLE_CATEGORY
	);

	const geographiesCountryImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.DELIVERABLE_CATEGORY_IMPORT_FROM_CSV
	);
	const geographiesCountryExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.DELIVERABLE_CATEGORY_EXPORT
	);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);

	return (
		<GeographiesCountryTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesCountry={selectedGeographiesCountry}
			initialValues={getInitialValues(
				selectedGeographiesCountry.current,
				dashboardData?.organization?.country?.id || ""
			)}
			geographiesCountryList={geographiesCountryList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			geographiesCountryEditAccess={geographiesCountryEditAccess}
			deliverableUnitFindAccess={deliverableUnitFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesCountryDeleteAccess={geographiesCountryDeleteAccess}
			geographiesCountryImportFromCsvAccess={geographiesCountryImportFromCsvAccess}
			geographiesCountryExportAccess={geographiesCountryExportAccess}
		/>
	);
}

export default GeographiesCountryTableContainer;
