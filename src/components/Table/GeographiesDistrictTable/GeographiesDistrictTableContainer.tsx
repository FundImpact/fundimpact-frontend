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
// import GeographiesStateTableView from "./GeographiesStateTableView";
import GeographiesDistrictTableView from "./GeographiesDistrictTableView";
import { GET_DISTRICT_DATA } from "../../../graphql/Geographies/GeographiesDistrict";
import {
	IGeographiesDistrict,
	IGeographiesDistrictData,
} from "../../../models/geographies/geographiesDistrict";
// import { IGetDeliverableCategoryUnit } from "../../../models/deliverable/query";

const getInitialValues = (
	geographiesDistrict: IGeographiesDistrictData | null,
	// deliverableUnit: IDeliverableUnitData | null,
	organization: string | number
	// deliverableCategory: string[]
): IGeographiesDistrict => {
	return {
		code: geographiesDistrict?.code || "",
		state: geographiesDistrict?.state || "",
		id: parseInt(geographiesDistrict?.id || ""),
		name: geographiesDistrict?.name || "",
		// prefix_label: geographiesDistrict?.prefix_label || "",
		// suffix_label: geographiesDistrict?.suffix_label || "",
		// unit_type: geographiesDistrict?.unit_type || "",
		// deliverableCategory,
		// organization,
		// code: deliverableUnit?.code || "",
		// description: deliverableUnit?.description || "",
		// id: parseInt(deliverableUnit?.id || ""),
		// name: deliverableUnit?.name || "",
		// prefix_label: deliverableUnit?.prefix_label || "",
		// suffix_label: deliverableUnit?.suffix_label || "",
		// unit_type: deliverableUnit?.unit_type || "",
		// // deliverableCategory,
		// organization,
	};
};

function GeographiesDistrictTableContainer({
	// deliverableUnitList,
	geographiesDistrictList,
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
	geographiesDistrictList: IGeographiesDistrictData[];
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
	const editGeographiesDistrict = false,
		deleteGeographiesDistrict = false;
	// const editDeliverableUnit = false,
	// 	deleteDeliverableUnit = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesDistrict,
		deleteGeographiesDistrict,
		// editDeliverableUnit,
		// deleteDeliverableUnit,
	]);

	const selectedGeographiesDistrict = useRef<IGeographiesDistrictData | null>(null);
	// const selectedDeliverableUnit = useRef<IDeliverableUnitData | null>(null);
	const dashboardData = useDashBoardData();
	const [getgeographiesDistrict] = useLazyQuery(GET_CATEGORY_UNIT);
	// const [getcategoryUnit] = useLazyQuery(GET_CATEGORY_UNIT);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedGeographiesDistrict.current && openDialogs[0]) {
			// if (selectedDeliverableUnit.current && openDialogs[0]) {
			getgeographiesDistrict({
				// getcategoryUnit({
				variables: {
					filter: {
						deliverable_units_org: selectedGeographiesDistrict.current.id,
						// deliverable_units_org: selectedDeliverableUnit.current.id,
					},
				},
			});
		}
	}, [openDialogs, getgeographiesDistrict]);
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

	const geographiesDistrictEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);

	const geographiesDistrictDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	);

	const deliverableUnitImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_IMPORT_FROM_CSV
	);
	const deliverableUnitExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_EXORT
	);

	const geographiesDistrictFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	return (
		<GeographiesDistrictTableView
			// <DeliverableUnitTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesDistrict={selectedGeographiesDistrict}
			// selectedDeliverableUnit={selectedDeliverableUnit}
			initialValues={getInitialValues(
				selectedGeographiesDistrict.current,
				// selectedDeliverableUnit.current,
				dashboardData?.organization?.id || ""
			)}
			geographiesDistrictList={geographiesDistrictList}
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
			geographiesDistrictEditAccess={geographiesDistrictEditAccess}
			// deliverableUnitEditAccess={deliverableUnitEditAccess}
			geographiesDistrictFindAccess={geographiesDistrictFindAccess}
			// deliverableCategoryFindAccess={deliverableCategoryFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesDistrictDeleteAccess={geographiesDistrictDeleteAccess}
			// deliverableUnitDeleteAccess={deliverableUnitDeleteAccess}
			deliverableUnitImportFromCsvAccess={deliverableUnitImportFromCsvAccess}
			deliverableUnitExportAccess={deliverableUnitExportAccess}
		/>
	);
}

export default GeographiesDistrictTableContainer;
