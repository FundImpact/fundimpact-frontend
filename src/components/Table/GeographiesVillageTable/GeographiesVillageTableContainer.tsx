import React, { useState, useRef, useEffect } from "react";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import GeographiesVillageTableView from "./GeographiesVillageTableView";
import {
	IGeographiesVillage,
	IGeographiesVillageData,
} from "../../../models/geographies/geographiesVillage";

const getInitialValues = (
	geographiesVillage: IGeographiesVillageData | null,
	organization: string | number
	// deliverableCategory: string[]
): IGeographiesVillage => {
	return {
		code: geographiesVillage?.code || "",
		block: geographiesVillage?.block || "",
		id: parseInt(geographiesVillage?.id || ""),
		name: geographiesVillage?.name || "",
		// prefix_label: geographiesVillage?.prefix_label || "",
		// suffix_label: geographiesVillage?.suffix_label || "",
		// unit_type: geographiesVillage?.unit_type || "",
		// deliverableCategory,
		// organization,
	};
};

function GeographiesVillageTableContainer({
	geographiesVillageList,
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
	geographiesVillageList: IGeographiesVillageData[];
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
	const editGeographiesVillage = false,
		deleteGeographiesVillage = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesVillage,
		deleteGeographiesVillage,
	]);

	const selectedGeographiesVillage = useRef<IGeographiesVillageData | null>(null);
	const dashboardData = useDashBoardData();
	const [getGeographiesVillage] = useLazyQuery(GET_CATEGORY_UNIT);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedGeographiesVillage.current && openDialogs[0]) {
			getGeographiesVillage({
				variables: {
					filter: {
						deliverable_units_org: selectedGeographiesVillage.current.id,
					},
				},
			});
		}
	}, [openDialogs, getGeographiesVillage]);

	// const deliverableCategoryMemoized = useMemo<string[]>(
	// 	() =>
	// 		deliverableCategoryUnitList?.deliverableCategoryUnitList
	// 			.filter(
	// 				(element: IGetDeliverableCategoryUnit["deliverableCategoryUnitList"][0]) =>
	// 					element.status
	// 			)
	// 			.map(
	// 				(element: IGetDeliverableCategoryUnit["deliverableCategoryUnitList"][0]) =>
	// 					element.deliverable_category_org.id
	// 			),
	// 	[deliverableCategoryUnitList]
	// );

	const geographiesVillageEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);
	const geographiesVillageDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	);
	const geographiesVillageImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_IMPORT_FROM_CSV
	);
	const GeographiesVillageExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_EXORT
	);

	const geographiesVillageFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	return (
		<GeographiesVillageTableView
			// <DeliverableUnitTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesVillage={selectedGeographiesVillage}
			initialValues={getInitialValues(
				selectedGeographiesVillage.current,
				dashboardData?.organization?.id || ""
			)}
			geographiesVillageList={geographiesVillageList}
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
			geographiesVillageEditAccess={geographiesVillageEditAccess}
			geographiesVillageFindAccess={geographiesVillageFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesVillageDeleteAccess={geographiesVillageDeleteAccess}
			geographiesVillageImportFromCsvAccess={geographiesVillageImportFromCsvAccess}
			GeographiesVillageExportAccess={GeographiesVillageExportAccess}
		/>
	);
}

export default GeographiesVillageTableContainer;
