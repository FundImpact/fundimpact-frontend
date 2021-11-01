import React, { useState, useEffect, useCallback } from "react";
import pagination from "../../../hooks/pagination";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useRefetchBudgetCategoryOnBudgetCategoryImport } from "../../../hooks/budget";
import GeoRegionsTableContainer from "./GeoRegionsTableContainer";
import { GET_GEOREGIONS_COUNT, GET_GEOREGIONS_DATA } from "../../../graphql/GeoRegions/query";

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
			// organization: dashboardData?.organization?.id,
			...newFilterListObject,
		});
	}, [tableFilterList, dashboardData]);

	let {
		changePage,
		count,
		queryData: geoRegionsData,
		queryLoading,
		countQueryLoading,
		queryRefetch,
		countRefetch,
	} = pagination({
		countQuery: GET_GEOREGIONS_COUNT,
		countFilter: {},
		query: GET_GEOREGIONS_DATA,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	console.log("geoRegionsData", count);

	const geoRegionsTableRefetch = useCallback(() => {
		countRefetch?.().then(() => queryRefetch?.());
		refetchBudgetCategoryOnBudgetCategoryImport();
	}, [countRefetch, queryRefetch]);

	return (
		<GeoRegionsTableContainer
			geoRegionsList={geoRegionsData?.geoRegions || []}
			collapsableTable={false}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			count={count?.aggregate?.count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			geoRegionsTableRefetch={geoRegionsTableRefetch}
		/>
	);
}

export default GeoRegionsTableGraphql;
