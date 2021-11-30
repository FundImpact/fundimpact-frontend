import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import pagination from "../../../hooks/pagination";
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
				// organization: dashboardData?.organization?.id,
				...newFilterListObject,
			});
		}
	}, [tableFilterList, dashboardData]);

	useEffect(() => {
		setNestedTableQueryFilter({
			deliverable_units_org: delivarableUnitId,
		});
	}, [delivarableUnitId]);

	// useEffect(() => {
	// 	setQueryFilter({
	// 		organization: dashboardData?.organization?.id,
	// 	});
	// }, [dashboardData]);

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

	let {
		changePage: changeGeographiesCountryPage,
		count: geographyCountryCount,
		queryData: geographyCountry,
		queryLoading: geographiesCountryLoading,
		countQueryLoading: geographiesCountryCountLoading,
		queryRefetch: refetchDeliverableCategory,
		countRefetch: refetchDeliverableCategoryCount,
	} = pagination({
		countQuery: GET_COUNTRY_COUNT,
		countFilter: {},
		query: GET_COUNTRY_DATA,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});
	const [filter, setFilter] = useState({});
	const [getCountries, countriesResponse] = useLazyQuery(GET_COUNTRY_DATA);

	useEffect(() => {
		let newFilterListObject: { [key: string]: string | string[] } = {};
		for (let key in tableFilterList) {
			if (tableFilterList[key] && tableFilterList[key].length) {
				newFilterListObject[key] = tableFilterList[key];
			}
		}
		// console.log("agage", tableFilterList);
		// console.log("newFilterListObject", newFilterListObject);
		// console.log("nested", nestedTableFilterList);
		// console.log("newFilter",newFilterListObject);
		setFilter(newFilterListObject);
		// console.log("Filter inside useEffect", filter);
		getCountries({
			variables: {
				filter: newFilterListObject,
			},
		});
		// console.log("Filter inside useEffect 2", filter);
	}, [tableFilterList]);

	let geographiesCountryList = countriesResponse?.data?.countries;

	const reftechDeliverableCategoryAndUnitTable = useCallback(() => {
		refetchDeliverableCategoryOnDeliverableCategoryImport();
		refetchDeliverableCategoryCount?.().then(() => refetchDeliverableCategory?.());
	}, [
		refetchDeliverableCategoryCount,
		refetchDeliverableCategory,
		refetchDeliverableCategoryOnDeliverableCategoryImport,
	]);

	return (
		<GeographiesCountryTableContainer
			geographiesCountryList={geographyCountry?.countries || []}
			collapsableTable={collapsableTable}
			changePage={changeGeographiesCountryPage}
			loading={geographiesCountryLoading || geographiesCountryCountLoading}
			count={geographyCountryCount?.aggregate?.count}
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
