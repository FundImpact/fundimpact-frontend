import React, { useState, useEffect } from "react";
import IndividualTableContainer from "./IndividualTableContainer";
import pagination from "../../../hooks/pagination";
import {
	GET_ORG_BUDGET_CATEGORY_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
} from "../../../graphql/Budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import IndividualTableGraphql from ".";
import { GET_INDIVIDUALS, GET_INDIVIDUALS_COUNT } from "../../../graphql/Individual";
import { useLazyQuery } from "@apollo/client";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import { removeFilterListObjectElements } from "../../../utils/filterList";

const getDefaultFilterList = () => ({
	name: "",
});

function IndividualCategoryTableGraphql({
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string };
}) {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>(getDefaultFilterList());

	useEffect(() => {
		if (dashboardData) {
			setQueryFilter({
				organization: dashboardData?.organization?.id,
			});
		}
	}, [setQueryFilter, dashboardData]);

	useEffect(() => {
		if (filterList && dashboardData) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				organization: dashboardData?.organization?.id,
				...newFilterListObject,
			});
		}
	}, [filterList, dashboardData]);

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	let {
		changePage,
		count,
		queryData: individualList,
		queryLoading,
		countQueryLoading,
	} = pagination({
		countQuery: GET_INDIVIDUALS_COUNT,
		countFilter: queryFilter,
		query: GET_INDIVIDUALS,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		retrieveContFromCountQueryResponse: "t4DIndividualsConnection,aggregate,count",
		fireRequest: Boolean(dashboardData),
	});

	return (
		<IndividualTableContainer
			individualList={individualList?.t4DIndividuals || []}
			count={count}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			order={order}
			orderBy={orderBy}
			setOrder={setOrder}
			setOrderBy={setOrderBy}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
		/>
	);
}

export default IndividualCategoryTableGraphql;
