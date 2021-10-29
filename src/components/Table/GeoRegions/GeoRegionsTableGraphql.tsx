import React, { useState, useEffect, useCallback } from "react";
import pagination from "../../../hooks/pagination";
import {
	GET_ORG_BUDGET_CATEGORY_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
} from "../../../graphql/Budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useRefetchBudgetCategoryOnBudgetCategoryImport } from "../../../hooks/budget";
import GeoRegionsTableContainer from "./GeoRegionsTableContainer";
import { useLazyQuery } from "@apollo/client";
import { GET_GEOREGIONS_DATA } from "../../../graphql/GeoRegions/query";

function GeoRegionsTableGraphql({
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string };
}) {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const {
		refetchBudgetCategoryOnBudgetCategoryImport,
	} = useRefetchBudgetCategoryOnBudgetCategoryImport();
	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	useEffect(() => {
		let newFilterListObject: { [key: string]: string } = {};
		for (let key in tableFilterList) {
			if (tableFilterList[key] && tableFilterList[key].length) {
				newFilterListObject[key] = tableFilterList[key];
			}
		}
		setQueryFilter({
			organization: dashboardData?.organization?.id,
			...newFilterListObject,
		});
	}, [tableFilterList, dashboardData]);

	let {
		changePage,
		count,
		queryData: budgetCategoryList,
		queryLoading,
		countQueryLoading,
		queryRefetch,
		countRefetch,
	} = pagination({
		countQuery: GET_ORG_BUDGET_CATEGORY_COUNT,
		countFilter: queryFilter,
		query: GET_ORGANIZATION_BUDGET_CATEGORY,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	const geoRegionsTableRefetch = useCallback(() => {
		countRefetch?.().then(() => queryRefetch?.());
		refetchBudgetCategoryOnBudgetCategoryImport();
	}, [countRefetch, queryRefetch]);

	const [getGeoRegions, geoRegionsResponse] = useLazyQuery(GET_GEOREGIONS_DATA);

	useEffect(() => {
		getGeoRegions();
	}, []);

	const geoRegionsData = geoRegionsResponse?.data?.geoRegions;

	return (
		<GeoRegionsTableContainer
			geoRegionsList={geoRegionsData || []}
			collapsableTable={false}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			geoRegionsTableRefetch={geoRegionsTableRefetch}
		/>
	);
}

export default GeoRegionsTableGraphql;
