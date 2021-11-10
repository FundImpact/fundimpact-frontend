import React, { useState, useRef, useEffect } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import GeographiesGrampanchayatTableView from "./GeographiesGrampanchayatTableView";
import {
	IGeographiesGrampanchayat,
	IGeographiesGrampanchayatData,
	IGeographiesGrampanchayatDataObj,
	IGeographiesGrampanchayatObj,
} from "../../../models/geographies/geographiesGrampanchayat";

const getInitialValues = (
	geographiesGrampanchayat: IGeographiesGrampanchayatData | null,
	organization: string | number
): IGeographiesGrampanchayat => {
	// console.log("geographiesGrampanchayat",geographiesGrampanchayat);
	// console.log("geographiesGrampanchayatORG",organization);
	return {
		code: geographiesGrampanchayat?.code || "",
		name: geographiesGrampanchayat?.name || "",
		district: geographiesGrampanchayat?.district || "",
		// district: {
		// 	id : geographiesGrampanchayat?.district?.id || "",
		// 	name : geographiesGrampanchayat?.district?.name || ""
		// },
		id: parseInt(geographiesGrampanchayat?.id || ""),
		// prefix_label: geographiesGrampanchayat?.prefix_label || "",
		// suffix_label: geographiesGrampanchayat?.suffix_label || "",
		// unit_type: geographiesGrampanchayat?.unit_type || "",
		// deliverableCategory,
		// organization,
	};
};
// console.log("geographiesGrampanchayatAFTER_RETURN",getInitialValues());
function GeographiesGrampanchayatTableContainer({
	geographiesGrampanchayatList,
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
	geographiesGrampanchayatList: IGeographiesGrampanchayatData[];
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
	const editGeographiesGrampanchayat = false,
		deleteGeographiesGrampanchayat = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesGrampanchayat,
		deleteGeographiesGrampanchayat,
	]);

	const selectedGeographiesGrampanchayat = useRef<IGeographiesGrampanchayatData | null>(null);
	const dashboardData = useDashBoardData();
	// console.log("afhqnm",dashboardData);
	// const [getcategoryUnit] = useLazyQuery(GET_CATEGORY_UNIT);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};
	// console.log("toggleDialogss", toggleDialogs);

	// useEffect(() => {
	// 	if (selectedGeographiesGrampanchayat.current && openDialogs[0]) {
	// 		// console.log("selectedGeographiesGrampanchayat",selectedGeographiesGrampanchayat);
	// 		getcategoryUnit({
	// 			variables: {
	// 				filter: {
	// 					deliverable_units_org: selectedGeographiesGrampanchayat.current.id,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [openDialogs, getcategoryUnit]);

	const geographiesGrampanchayatEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);
	const geographiesGrampanchayatDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	);
	const geographiesGrampanchayatImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_IMPORT_FROM_CSV
	);
	const geographiesGrampanchayatExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_EXORT
	);

	const geographiesGrampanchayatFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);
	console.log("aeqnegmoq3m", selectedGeographiesGrampanchayat);
	return (
		<GeographiesGrampanchayatTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesGrampanchayat={selectedGeographiesGrampanchayat}
			initialValues={getInitialValues(
				selectedGeographiesGrampanchayat.current,
				dashboardData?.organization?.id || ""
			)}
			geographiesGrampanchayatList={geographiesGrampanchayatList}
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
			geographiesGrampanchayatEditAccess={geographiesGrampanchayatEditAccess}
			geographiesGrampanchayatFindAccess={geographiesGrampanchayatFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesGrampanchayatDeleteAccess={geographiesGrampanchayatDeleteAccess}
			geographiesGrampanchayatImportFromCsvAccess={
				geographiesGrampanchayatImportFromCsvAccess
			}
			geographiesGrampanchayatExportAccess={geographiesGrampanchayatExportAccess}
		/>
	);
}

export default GeographiesGrampanchayatTableContainer;
