import React, { useState, useRef, useEffect } from "react";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
// import DeliverableCategoryTableView from "./DeliverableCategoryTableView";
import GeographiesCountryTableView from "./GeographiesCountryTableView";
import { useLazyQuery } from "@apollo/client";
import { GET_COUNTRY_COUNT, GET_COUNTRY_DATA } from "../../../graphql/Geographies/GeographyCountry";
// import { ApolloQueryResult } from "@apollo/client";

const getInitialValues = (
	deliverableCategory: IDeliverableCategoryData | null,
	organization?: string
): IDeliverable => {
	return {
		code: deliverableCategory?.code || "",
		description: deliverableCategory?.description || "",
		id: parseInt(deliverableCategory?.id || ""),
		name: deliverableCategory?.name || "",
		organization,
	};
};

function GeographiesCountryTableContainer({
	deliverableCategoryList,
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
	deliverableCategoryList: IDeliverableCategoryData[];
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
}) {
	const editDeliverableCategory = false,
		deleteDeliverableCategory = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editDeliverableCategory,
		deleteDeliverableCategory,
	]);
	const selectedDeliverableCategory = useRef<IDeliverableCategoryData | null>(null);

	const dashboardData = useDashBoardData();

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
	const deliverableCategoryImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.DELIVERABLE_CATEGORY_IMPORT_FROM_CSV
	);
	const deliverableCategoryExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.DELIVERABLE_CATEGORY_EXPORT
	);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);

	const [getCountries, countriesResponse] = useLazyQuery(GET_COUNTRY_DATA);

	const [getCountryCount, countryCountResponse] = useLazyQuery(GET_COUNTRY_COUNT);

	useEffect(() => {
		getCountries();
		getCountryCount();
	}, []);

	console.log(
		"countryCountResponse",
		countryCountResponse?.data?.countriesConnection?.aggregate?.count
	);

	let geographiesCountryList = countriesResponse?.data?.countries || [];

	// console.log("CountryQueryData", geographiesCountryList);
	// console.log("CountryQueryData twice", countriesResponse);

	// console.log("deliverableCategoryList", deliverableCategoryList);

	return (
		// <DeliverableCategoryTableView
		<GeographiesCountryTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedDeliverableCategory={selectedDeliverableCategory}
			initialValues={getInitialValues(
				selectedDeliverableCategory.current,
				dashboardData?.organization?.id || ""
			)}
			deliverableCategoryList={geographiesCountryList}
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
			deliverableCategoryEditAccess={geographiesCountryEditAccess}
			// deliverableCategoryEditAccess={deliverableCategoryEditAccess}
			deliverableUnitFindAccess={deliverableUnitFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			deliverableCategoryDeleteAccess={geographiesCountryDeleteAccess}
			// deliverableCategoryDeleteAccess={deliverableCategoryDeleteAccess}
			deliverableCategoryImportFromCsvAccess={deliverableCategoryImportFromCsvAccess}
			deliverableCategoryExportAccess={deliverableCategoryExportAccess}
		/>
	);
}

export default GeographiesCountryTableContainer;
