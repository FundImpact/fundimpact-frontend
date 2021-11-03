import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import pagination from "../../../hooks/pagination";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
// import GeographiesCountryTableContainer from "./GeographiesCountryTableContainers";
import { GET_COUNTRY_COUNT, GET_COUNTRY_DATA } from "../../../graphql/Geographies/GeographyCountry";
import { useLazyQuery } from "@apollo/client";
import TallyMapperCostcenterTableContainer from "./TallyMapperCostcenterTableContainers";
import {
	GET_TALLYMAPPER_COSTCENTER,
	GET_TALLYMAPPER_COSTCENTER_COUNT,
} from "../../../graphql/TallyMapper/TallyMapperCostcenter";

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
function TallyMapperCostcenterTableGraphql({
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
		count: tallyMpapperCostCenterCount,
		queryData: tallyMapperCostCenterData,
		queryLoading: geographiesCountryLoading,
		countQueryLoading: geographiesCountryCountLoading,
		queryRefetch: refetchDeliverableCategory,
		countRefetch: refetchDeliverableCategoryCount,
	} = pagination({
		countQuery: GET_TALLYMAPPER_COSTCENTER_COUNT,
		// countQuery: GET_COUNTRY_COUNT,
		countFilter: {},
		query: GET_TALLYMAPPER_COSTCENTER,
		// query: GET_COUNTRY_DATA,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});

	// console.log("geographyCountryCount", geographyCountryCount, geographyCountry);

	const reftechDeliverableCategoryAndUnitTable = useCallback(() => {
		refetchDeliverableCategoryOnDeliverableCategoryImport();
		refetchDeliverableCategoryCount?.().then(() => refetchDeliverableCategory?.());
	}, [
		refetchDeliverableCategoryCount,
		refetchDeliverableCategory,
		refetchDeliverableCategoryOnDeliverableCategoryImport,
	]);

	return (
		<TallyMapperCostcenterTableContainer
			geographiesCountryList={tallyMapperCostCenterData?.costCenters || []}
			// geographiesCountryList={geographyCountry?.countries || []}
			collapsableTable={collapsableTable}
			changePage={changeGeographiesCountryPage}
			loading={geographiesCountryLoading || geographiesCountryCountLoading}
			count={tallyMpapperCostCenterCount?.aggregate?.count}
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

export default TallyMapperCostcenterTableGraphql;
