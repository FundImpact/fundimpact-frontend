import React, { useState, useEffect, useCallback } from "react";
import IndividualTableContainer from "./IndividualTableContainer";
import pagination from "../../../hooks/pagination";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import IndividualTableGraphql from ".";
import { GET_INDIVIDUALS, GET_INDIVIDUALS_COUNT } from "../../../graphql/Individual";
import { useLazyQuery } from "@apollo/client";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { IndividualTableType } from "../../../models/individual/constant";
import { IDashboardDataContext } from "../../../models";

const getDefaultFilterList = () => ({
	name: "",
});

const getQueryFilter = ({
	individualTableType,
	dashboardData,
}: {
	individualTableType: IndividualTableType;
	dashboardData: IDashboardDataContext;
}) => {
	if (individualTableType == IndividualTableType.organization) {
		return { organization: dashboardData?.organization?.id };
	}
	return { t4d_project_individuals: { project: dashboardData?.project?.id } };
};

function IndividualCategoryTableGraphql({
	tableFilterList,
	individualTableType = IndividualTableType.organization,
}: {
	tableFilterList?: { [key: string]: string };
	individualTableType?: IndividualTableType;
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
			setQueryFilter(getQueryFilter({ individualTableType, dashboardData }));
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
				...getQueryFilter({ individualTableType, dashboardData }),
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
		queryRefetch: refetchIndividualList,
		countRefetch: refetchIndividualCount,
	} = pagination({
		countQuery: GET_INDIVIDUALS_COUNT,
		countFilter: queryFilter,
		query: GET_INDIVIDUALS,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		retrieveContFromCountQueryResponse: "t4DIndividualsConnection,aggregate,count",
		fireRequest: Boolean(dashboardData),
	});

	const refetchIndividualTable = useCallback(() => {
		refetchIndividualCount?.().then(() => refetchIndividualList?.());
	}, [refetchIndividualCount, refetchIndividualList]);

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
			individualTableType={individualTableType}
			refetchIndividualTable={refetchIndividualTable}
		/>
	);
}

export default IndividualCategoryTableGraphql;
