import React, { useState, useRef, useEffect } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import GeographiesStateTableView from "./GeographiesStateTableView";
import {
	IGeographiesState,
	IGeographiesStateData,
} from "../../../models/geographies/geographiesState";
import { GEOGRAPHIES_STATE_ACTIONS } from "../../../utils/access/modules/geographiesState/actions";

const getInitialValues = (
	geographiesState: IGeographiesStateData | null,
	organization: string | number
): IGeographiesState => {
	console.log("geographiesState", geographiesState);

	return {
		code: geographiesState?.code || "",
		// description: geographiesState?.description || "",
		id: parseInt(geographiesState?.id || ""),
		name: geographiesState?.name || "",
		// country: geographiesState?.country || { id: "", name: "" },
		country: geographiesState?.country || "",
		// prefix_label: geographiesState?.prefix_label || "",
		// suffix_label: geographiesState?.suffix_label || "",
		// unit_type: geographiesState?.unit_type || "",
		// deliverableCategory,
		// organization,
	};
};

function GeographiesStateTableContainer({
	geographiesStateList,
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
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	orderBy: string;
	geographiesStateList: IGeographiesStateData[];
	// deliverableUnitList: IDeliverableUnitData[];
	filterList: {
		[key: string]: string;
	};
	loading: boolean;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	reftechDeliverableCategoryAndUnitTable: () => void;
}) {
	const editGeographiesState = false,
		deleteGeographiesState = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesState,
		deleteGeographiesState,
	]);

	const selectedGeographiesState = useRef<IGeographiesStateData | null>(null);
	const dashboardData = useDashBoardData();
	const [getGeographiesState] = useLazyQuery(GET_CATEGORY_UNIT);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedGeographiesState.current && openDialogs[0]) {
			getGeographiesState({
				variables: {
					filter: {
						deliverable_units_org: selectedGeographiesState.current.id,
					},
				},
			});
		}
	}, [openDialogs, getGeographiesState]);

	const geographiesStateEditAccess = userHasAccess(
		MODULE_CODES.GEOGRAPHIES_STATE,
		GEOGRAPHIES_STATE_ACTIONS.UPDATE_GEOGRAPHIES_STATE
		// MODULE_CODES.DELIVERABLE_UNIT,
		// DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);
	const geographiesStateDeleteAccess = userHasAccess(
		MODULE_CODES.GEOGRAPHIES_STATE,
		GEOGRAPHIES_STATE_ACTIONS.DELETE_GEOGRAPHIES_STATE
		// MODULE_CODES.DELIVERABLE_UNIT,
		// DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	);
	const deliverableUnitImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_IMPORT_FROM_CSV
	);
	const deliverableUnitExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_EXORT
	);

	const geographiesStateFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	return (
		<GeographiesStateTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesState={selectedGeographiesState}
			initialValues={getInitialValues(
				selectedGeographiesState.current,
				dashboardData?.organization?.id || ""
			)}
			geographiesStateList={geographiesStateList}
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
			geographiesStateEditAccess={geographiesStateEditAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesStateFindAccess={geographiesStateFindAccess}
			geographiesStateDeleteAccess={geographiesStateDeleteAccess}
			deliverableUnitImportFromCsvAccess={deliverableUnitImportFromCsvAccess}
			deliverableUnitExportAccess={deliverableUnitExportAccess}
		/>
	);
}

export default GeographiesStateTableContainer;
