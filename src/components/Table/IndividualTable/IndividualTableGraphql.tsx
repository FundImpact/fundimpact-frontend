import React, { useState, useEffect } from "react";
import IndividualTableContainer from "./IndividualTableContainer";
import pagination from "../../../hooks/pagination";
import {
	GET_ORG_BUDGET_CATEGORY_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
} from "../../../graphql/Budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import IndividualTableGraphql from ".";
import { GET_INDIVIDUALS } from "../../../graphql/Individual";
import { useLazyQuery } from "@apollo/client";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";

function BudgetCategoryTableGraphql({
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string };
}) {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});

	// useEffect(() => {
	// 	setQueryFilter({
	// 		organization: dashboardData?.organization?.id,
	// 	});
	// }, [dashboardData]);

	// useEffect(() => {
	// 	let newFilterListObject: { [key: string]: string } = {};
	// 	for (let key in tableFilterList) {
	// 		if (tableFilterList[key] && tableFilterList[key].length) {
	// 			newFilterListObject[key] = tableFilterList[key];
	// 		}
	// 	}
	// 	setQueryFilter({
	// 		organization: dashboardData?.organization?.id,
	// 		...newFilterListObject,
	// 	});
	// }, [tableFilterList, dashboardData]);

	// let {
	// 	changePage,
	// 	count,
	// 	queryData: budgetCategoryList,
	// 	queryLoading,
	// 	countQueryLoading,
	// } = pagination({
	// 	countQuery: GET_ORG_BUDGET_CATEGORY_COUNT,
	// 	countFilter: queryFilter,
	// 	query: GET_INDIVIDUALS,
	// 	queryFilter,
	// 	sort: `${orderBy}:${order.toUpperCase()}`,
	// });

	// return (
	// <IndividualTableContainer
	// 	budgetCategoryList={budgetCategoryList?.orgBudgetCategory || []}
	// 	collapsableTable={false}
	// 	changePage={changePage}
	// 	loading={queryLoading || countQueryLoading}
	// 	count={count}
	// 	order={order}
	// 	setOrder={setOrder}
	// 	orderBy={orderBy}
	// 	setOrderBy={setOrderBy}
	// />
	// );

	const [getIndividuals, { data: individualList }] = useLazyQuery<IGET_INDIVIDUAL_LIST>(
		GET_INDIVIDUALS
	);
	console.log("individualList :>> ", individualList);
	useEffect(() => {
		if (dashboardData) {
			getIndividuals({
				variables: {
					organization: dashboardData?.organization?.id,
				},
			});
		}
	}, [getIndividuals, dashboardData]);

	return (
		<IndividualTableContainer
			individualList={individualList?.t4DIndividuals || []}
			count={10}
			changePage={(prev: boolean | undefined) => {}}
			loading={false}
			order={order}
			orderBy={orderBy}
			setOrder={setOrder}
			setOrderBy={setOrderBy}
		/>
	);
}

export default BudgetCategoryTableGraphql;
