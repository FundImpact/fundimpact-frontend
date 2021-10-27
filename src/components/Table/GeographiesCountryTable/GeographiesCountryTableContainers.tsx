import React, { useState, useRef, useEffect } from "react";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
// import DeliverableCategoryTableView from "./DeliverableCategoryTableView";
import GeographiesCountryTableView from "./GeographiesCountryTableView";
import { useLazyQuery } from "@apollo/client";
import { IGeographies, IGeographiesCountryData } from "../../../models/geographies/geographies";
// import { ApolloQueryResult } from "@apollo/client";

const getInitialValues = (
	geographiesCountry: IGeographiesCountryData | null,
	// deliverableCategory: IDeliverableCategoryData | null,
	organization?: string
): IGeographies => {
	// ): IDeliverable => {
	console.log("getInitialValues", geographiesCountry);
	return {
		code: geographiesCountry?.code || "",
		// description: geographiesCountry?.description || "",
		id: parseInt(geographiesCountry?.id || ""),
		name: geographiesCountry?.name || "",
		organization,
		// code: deliverableCategory?.code || "",
		// description: deliverableCategory?.description || "",
		// id: parseInt(deliverableCategory?.id || ""),
		// name: deliverableCategory?.name || "",
		// organization,
	};
};

function GeographiesCountryTableContainer({
	geographiesCountryList,
	// deliverableCategoryList,
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
	// deliverableCategoryList: IDeliverableCategoryData[];
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
	// const editDeliverableCategory = false,
	// 	deleteDeliverableCategory = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesCountry,
		deleteGeographiesCountry,
		// editDeliverableCategory,
		// deleteDeliverableCategory,
	]);
	const selectedGeographiesCountry = useRef<IGeographiesCountryData | null>(null);
	// const selectedDeliverableCategory = useRef<IDeliverableCategoryData | null>(null);

	const dashboardData = useDashBoardData();

	console.log("dashboardData", dashboardData);

	const toggleDialogs = (index: number, dialogOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogOpenStatus : element))
		);
	};

	// const deliverableCategoryEditAccess = userHasAccess(
	// 	MODULE_CODES.DELIVERABLE_CATEGORY,
	// 	DELIVERABLE_CATEGORY_ACTIONS.UPDATE_DELIVERABLE_CATEGORY
	// );
	const geographiesCountryEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.UPDATE_DELIVERABLE_CATEGORY
	);

	// const deliverableCategoryDeleteAccess = userHasAccess(
	// 	MODULE_CODES.DELIVERABLE_CATEGORY,
	// 	DELIVERABLE_CATEGORY_ACTIONS.DELETE_DELIVERABLE_CATEGORY
	// );
	const geographiesCountryDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.DELETE_DELIVERABLE_CATEGORY
	);

	const geographiesCountryImportFromCsvAccess = userHasAccess(
		// const deliverableCategoryImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.DELIVERABLE_CATEGORY_IMPORT_FROM_CSV
	);
	const geographiesCountryExportAccess = userHasAccess(
		// const deliverableCategoryExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.DELIVERABLE_CATEGORY_EXPORT
	);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);
	// const deliverableUnitFindAccess = userHasAccess(
	// 	MODULE_CODES.DELIVERABLE_UNIT,
	// 	DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	// );

	console.log("deliverableUnitFindAccess", deliverableUnitFindAccess);

	return (
		// <DeliverableCategoryTableView
		<GeographiesCountryTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesCountry={selectedGeographiesCountry}
			// selectedDeliverableCategory={selectedDeliverableCategory}
			initialValues={getInitialValues(
				selectedGeographiesCountry.current,
				dashboardData?.organization?.country?.id || ""
			)}
			// initialValues={getInitialValues(
			// 	selectedDeliverableCategory.current,
			// 	dashboardData?.organization?.id || ""
			// )}
			geographiesCountryList={geographiesCountryList}
			// deliverableCategoryList={deliverableCategoryList}
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
			// deliverableCategoryEditAccess={deliverableCategoryEditAccess}
			deliverableUnitFindAccess={deliverableUnitFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesCountryDeleteAccess={geographiesCountryDeleteAccess}
			// deliverableCategoryDeleteAccess={deliverableCategoryDeleteAccess}
			geographiesCountryImportFromCsvAccess={geographiesCountryImportFromCsvAccess}
			// deliverableCategoryImportFromCsvAccess={deliverableCategoryImportFromCsvAccess}
			geographiesCountryExportAccess={geographiesCountryExportAccess}
			// deliverableCategoryExportAccess={deliverableCategoryExportAccess}
		/>
	);
}

export default GeographiesCountryTableContainer;
