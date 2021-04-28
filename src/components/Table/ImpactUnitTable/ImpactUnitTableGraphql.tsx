import React, { useMemo, useState, useEffect, useCallback } from "react";
import ImpactUnitTableContainer from "./ImpactUnitTableContainer";
import {
	GET_IMPACT_UNIT_BY_ORG,
	GET_IMPACT_UNIT_COUNT_BY_ORG,
} from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_IMPACT_CATEGORY_UNIT,
	GET_IMPACT_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Impact/categoryUnit";
import pagination from "../../../hooks/pagination";
import { IGetImpactCategoryUnit } from "../../../models/impact/query";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterList: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterList[key] = filterList[key];
		}
	}
	return newFilterList;
};

function ImpactUnitTableGraphql({
	collapsableTable = true,
	rowId: impactCategoryId,
	tableFilterList,
}: {
	collapsableTable?: boolean;
	rowId?: string;
	tableFilterList?: { [key: string]: string };
}) {
	const [nestedTableQueryFilter, setNestedTableQueryFilter] = useState({});
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const dashboardData = useDashBoardData();
	const [nestedTableFilterList, setNestedTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");

	const removeNestedFilterListElements = (key: string, index?: number) => {
		setNestedTableFilterList((nestedFilterListObject) => {
			nestedFilterListObject[key] = "";
			return { ...nestedFilterListObject };
		});
	};

	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	useEffect(() => {
		setNestedTableQueryFilter({
			impact_category_org: impactCategoryId,
		});
	}, [impactCategoryId]);

	useEffect(() => {
		if (tableFilterList) {
			const newTableFilterList = removeEmptyKeys(tableFilterList);
			setQueryFilter({
				organization: dashboardData?.organization?.id,
				...newTableFilterList,
			});
		}
	}, [tableFilterList, dashboardData]);

	useEffect(() => {
		if (nestedTableFilterList) {
			const newNestedTableFilterList = removeEmptyKeys(nestedTableFilterList);
			setNestedTableQueryFilter(
				Object.assign(
					{},
					{ impact_category_org: impactCategoryId },
					Object.keys(newNestedTableFilterList).length && {
						impact_units_org: {
							...newNestedTableFilterList,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, impactCategoryId]);

	let {
		changePage: changeImpactUnitPage,
		count: impactUnitCount,
		queryData: impactUnitList,
		queryLoading: impactUnitLoading,
		countQueryLoading: impactUnitCountLoading,
		queryRefetch: impactUnitRefetch,
		countRefetch: impactUnitCountRefetch,
	} = pagination({
		countQuery: GET_IMPACT_UNIT_COUNT_BY_ORG,
		countFilter: queryFilter,
		query: GET_IMPACT_UNIT_BY_ORG,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData && collapsableTable),
	});

	let {
		changePage: changeImpactCategoryUnitPage,
		count: impactCategoryUnitCount,
		queryData: impactCategoryUnitList,
		queryLoading: impactCategoryUnitLoading,
		countQueryLoading: impactCategoryUnitCountLoading,
		queryRefetch: impactCategoryUnitRefetch,
		countRefetch: impactCategoryUnitCountRefetch,
	} = pagination({
		countQuery: GET_IMPACT_CATEGORY_UNIT_COUNT,
		countFilter: nestedTableQueryFilter,
		query: GET_IMPACT_CATEGORY_UNIT,
		queryFilter: nestedTableQueryFilter,
		sort: `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
		fireRequest: Boolean(impactCategoryId && !collapsableTable),
	});

	const reftechImpactCategoryAndUnitTable = useCallback(() => {
		impactUnitCountRefetch?.().then(() => impactUnitRefetch?.());
		impactCategoryUnitCountRefetch?.().then(() => impactCategoryUnitRefetch?.());
	}, [
		impactUnitCountRefetch,
		impactUnitRefetch,
		impactCategoryUnitCountRefetch,
		impactCategoryUnitRefetch,
	]);

	const impactCategoryUnitListMemoized = useMemo(
		() =>
			impactCategoryUnitList?.impactCategoryUnitList
				?.filter(
					(element: IGetImpactCategoryUnit["impactCategoryUnitList"][0]) => element.status
				)
				.map(
					(element: IGetImpactCategoryUnit["impactCategoryUnitList"][0]) =>
						element?.impact_units_org
				),
		[impactCategoryUnitList]
	);

	return (
		<ImpactUnitTableContainer
			impactUnitList={
				impactUnitList?.impactUnitsOrgList || impactCategoryUnitListMemoized || []
			}
			collapsableTable={collapsableTable}
			changePage={
				dashboardData && collapsableTable
					? changeImpactUnitPage
					: changeImpactCategoryUnitPage
			}
			loading={
				impactUnitLoading ||
				impactUnitCountLoading ||
				impactCategoryUnitLoading ||
				impactCategoryUnitCountLoading
			}
			count={dashboardData && collapsableTable ? impactUnitCount : impactCategoryUnitCount}
			order={collapsableTable ? order : nestedTableOrder}
			setOrder={collapsableTable ? setOrder : setNestedTableOrder}
			orderBy={collapsableTable ? orderBy : nestedTableOrderBy}
			setOrderBy={collapsableTable ? setOrderBy : setNestedTableOrderBy}
			filterList={nestedTableFilterList}
			setFilterList={setNestedTableFilterList}
			removeFilterListElements={removeNestedFilterListElements}
			reftechImpactCategoryAndUnitTable={reftechImpactCategoryAndUnitTable}
		/>
	);
}

export default ImpactUnitTableGraphql;
