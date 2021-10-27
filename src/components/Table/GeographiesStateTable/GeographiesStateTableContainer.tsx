import React, { useState, useRef, useEffect } from "react";
// import DeliverableUnitTableView from "./DeliverableUnitTableView";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
// import { IDeliverableCategoryData } from "../../../models/deliverable/deliverable";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import GeographiesStateTableView from "./GeographiesStateTableView";
import {
	IGeographiesState,
	IGeographiesStateData,
} from "../../../models/geographies/geographiesState";
// import { IGetDeliverableCategoryUnit } from "../../../models/deliverable/query";

const getInitialValues = (
	geographiesState: IGeographiesStateData | null,
	// deliverableUnit: IDeliverableUnitData | null,
	organization: string | number
	// deliverableCategory: string[]
): IGeographiesState => {
	// ): IDeliverableUnit => {
	return {
		code: geographiesState?.code || "",
		// description: geographiesState?.description || "",
		id: parseInt(geographiesState?.id || ""),
		name: geographiesState?.name || "",
		country: geographiesState?.country || "",
		// prefix_label: geographiesState?.prefix_label || "",
		// suffix_label: geographiesState?.suffix_label || "",
		// unit_type: geographiesState?.unit_type || "",
		// deliverableCategory,
		// organization,
		// code: deliverableUnit?.code || "",
		// description: deliverableUnit?.description || "",
		// id: parseInt(deliverableUnit?.id || ""),
		// name: deliverableUnit?.name || "",
		// prefix_label: deliverableUnit?.prefix_label || "",
		// suffix_label: deliverableUnit?.suffix_label || "",
		// unit_type: deliverableUnit?.unit_type || "",
		// deliverableCategory,
		// organization,
	};
};

function GeographiesStateTableContainer({
	// deliverableUnitList,
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
	// const editDeliverableUnit = false,
	// 	deleteDeliverableUnit = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesState,
		deleteGeographiesState,
		// editDeliverableUnit,
		// deleteDeliverableUnit,
	]);

	const selectedGeographiesState = useRef<IGeographiesStateData | null>(null);
	// const selectedDeliverableUnit = useRef<IDeliverableUnitData | null>(null);
	const dashboardData = useDashBoardData();
	const [getGeographiesState] = useLazyQuery(GET_CATEGORY_UNIT);
	// const [getcategoryUnit] = useLazyQuery(GET_CATEGORY_UNIT);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedGeographiesState.current && openDialogs[0]) {
			// if (selectedDeliverableUnit.current && openDialogs[0]) {
			getGeographiesState({
				// getcategoryUnit({
				variables: {
					filter: {
						deliverable_units_org: selectedGeographiesState.current.id,
						// deliverable_units_org: selectedDeliverableUnit.current.id,
					},
				},
			});
		}
	}, [openDialogs, getGeographiesState]);
	// }, [openDialogs, getcategoryUnit]);

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

	const geographiesStateEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);
	// const deliverableUnitEditAccess = userHasAccess(
	// 	MODULE_CODES.DELIVERABLE_UNIT,
	// 	DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	// );
	const geographiesStateDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	);
	// const deliverableUnitDeleteAccess = userHasAccess(
	// 	MODULE_CODES.DELIVERABLE_UNIT,
	// 	DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	// );
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
	// const deliverableCategoryFindAccess = userHasAccess(
	// 	MODULE_CODES.DELIVERABLE_CATEGORY,
	// 	DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	// );

	// console.log("deliverableUnitList", deliverableUnitList);

	return (
		<GeographiesStateTableView
			// <DeliverableUnitTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesState={selectedGeographiesState}
			// selectedDeliverableUnit={selectedDeliverableUnit}
			initialValues={getInitialValues(
				selectedGeographiesState.current,
				// selectedDeliverableUnit.current,
				dashboardData?.organization?.id || ""
			)}
			geographiesStateList={geographiesStateList}
			// deliverableUnitList={deliverableUnitList}
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
			// deliverableUnitEditAccess={deliverableUnitEditAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesStateFindAccess={geographiesStateFindAccess}
			// deliverableCategoryFindAccess={deliverableCategoryFindAccess}
			geographiesStateDeleteAccess={geographiesStateDeleteAccess}
			// deliverableUnitDeleteAccess={deliverableUnitDeleteAccess}
			deliverableUnitImportFromCsvAccess={deliverableUnitImportFromCsvAccess}
			deliverableUnitExportAccess={deliverableUnitExportAccess}
		/>
	);
}

export default GeographiesStateTableContainer;
