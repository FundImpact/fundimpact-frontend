import React, { useMemo, useState, useEffect, useCallback } from "react";
// import DeliverableCategoryTableContainer from "./DeliverableCategoryTableContainer";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_DELIVERABLE_ORG_CATEGORY,
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
} from "../../../graphql/Deliverable/category";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Deliverable/categoryUnit";
import pagination from "../../../hooks/pagination";
import { IGetDeliverableCategoryUnit } from "../../../models/deliverable/query";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
import GeographiesCountryTableContainer from "./GeographiesCountryTableContainers";
import { GET_COUNTRY_COUNT, GET_COUNTRY_DATA } from "../../../graphql/Geographies/GeographyCountry";
import { useLazyQuery } from "@apollo/client";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

//insert genrics in pagination
function GoegraphiesCountryTableGraphql({
	collapsableTable = false,
	rowId: delivarableUnitId,
	tableFilterList,
}: {
	collapsableTable?: boolean;
	rowId?: string;
	tableFilterList?: { [key: string]: string };
}) {
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const dashboardData = useDashBoardData();
	const [nestedTableQueryFilter, setNestedTableQueryFilter] = useState({});
	const [queryFilter, setQueryFilter] = useState({});
	const [nestedTableFilterList, setNestedTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	const {
		refetchDeliverableCategoryOnDeliverableCategoryImport,
	} = useRefetchDeliverableMastersOnDeliverableMasterImport();

	const removeNestedFilterListElements = (key: string, index?: number) => {
		setNestedTableFilterList((nestedTableFilterListObject) => {
			nestedTableFilterListObject[key] = "";
			return { ...nestedTableFilterListObject };
		});
	};

	useEffect(() => {
		if (tableFilterList) {
			let newFilterListObject: { [key: string]: string } = removeEmptyKeys(tableFilterList);
			setQueryFilter({
				organization: dashboardData?.organization?.id,
				...newFilterListObject,
			});
		}
	}, [tableFilterList, dashboardData]);

	useEffect(() => {
		setNestedTableQueryFilter({
			deliverable_units_org: delivarableUnitId,
		});
	}, [delivarableUnitId]);

	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	useEffect(() => {
		if (nestedTableFilterList) {
			const newNestedTableFilterListObject = removeEmptyKeys(nestedTableFilterList);
			setNestedTableQueryFilter(
				Object.assign(
					{},
					{ deliverable_units_org: delivarableUnitId },
					Object.keys(newNestedTableFilterListObject).length && {
						deliverable_category_org: {
							...newNestedTableFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, delivarableUnitId]);

	const [getCountryCount, countryCountResponse] = useLazyQuery(GET_COUNTRY_COUNT);

	useEffect(() => {
		getCountryCount();
	}, []);

	let CountryCount = countryCountResponse;

	let {
		changePage: changeGeographiesCountryPage,
		// changePage: changeDeliverableCategoryPage,
		// count: CountryCount,
		count: deliverableCategoryCount,
		queryData: deliverableCategoryList,
		queryLoading: geographiesCountryLoading,
		// queryLoading: deliverableCategoryLoading,
		countQueryLoading: geographiesCountryCountLoading,
		// countQueryLoading: deliverableCategoryCountLoading,
		queryRefetch: refetchDeliverableCategory,
		countRefetch: refetchDeliverableCategoryCount,
	} = pagination({
		// countQuery: GET_COUNTRY_COUNT,
		countQuery: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
		countFilter: queryFilter,
		// query: GET_COUNTRY_DATA,
		query: GET_DELIVERABLE_ORG_CATEGORY,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});

	// console.log("category Count", deliverableCategoryCount);

	// console.log("deliverableCategoryCountLoading", deliverableCategoryCountLoading);

	const [getCountries, countriesResponse] = useLazyQuery(GET_COUNTRY_DATA);

	// const [getCountryCount, countryCountResponse] = useLazyQuery(GET_COUNTRY_COUNT);

	useEffect(() => {
		getCountries();
		// getCountryCount();
	}, []);

	let geographiesCountryList = countriesResponse?.data?.countries;

	const reftechDeliverableCategoryAndUnitTable = useCallback(() => {
		refetchDeliverableCategoryOnDeliverableCategoryImport();
		refetchDeliverableCategoryCount?.().then(() => refetchDeliverableCategory?.());
		// refetchDeliverableCategoryUnitCount?.().then(() => refetchDeliverableCategoryUnit?.());
	}, [
		refetchDeliverableCategoryCount,
		refetchDeliverableCategory,
		refetchDeliverableCategoryOnDeliverableCategoryImport,
	]);

	let GeographiesCountryCount = 10;
	return (
		// <DeliverableCategoryTableContainer
		<GeographiesCountryTableContainer
			geographiesCountryList={geographiesCountryList || []}
			// deliverableCategoryList={deliverableCategoryList?.deliverableCategory || []}
			collapsableTable={collapsableTable}
			changePage={changeGeographiesCountryPage}
			loading={geographiesCountryLoading || geographiesCountryCountLoading}
			// loading={deliverableCategoryLoading || deliverableCategoryCountLoading}
			count={GeographiesCountryCount}
			// count={deliverableCategoryCount}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={nestedTableFilterList}
			setFilterList={setNestedTableFilterList}
			removeFilterListElements={removeNestedFilterListElements}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
		/>
	);
}

export default GoegraphiesCountryTableGraphql;
