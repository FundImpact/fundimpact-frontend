import React, { useMemo, useState, useEffect } from "react";
import ImpactCategoryTableContainer from "./ImpactCategoryTableContainer";
import {
	GET_IMPACT_CATEGORY_BY_ORG,
	GET_IMPACT_CATEGORY_COUNT_BY_ORG,
} from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_IMPACT_CATEGORY_UNIT,
	GET_IMPACT_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Impact/categoryUnit";
import { IImpactCategoryData, IImpactUnitData } from "../../../models/impact/impact";
import pagination from "../../../hooks/pagination";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterList: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterList[key] = filterList[key];
		}
	}
	return newFilterList;
};

function ImpactCategoryTableGraphql({
	collapsableTable = true,
	rowId: impactUnitId,
	tableFilterList,
}: {
	collapsableTable?: boolean;
	rowId?: string;
	tableFilterList?: { [key: string]: string };
}) {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [nestedTableQueryFilter, setNestedTableQueryFilter] = useState({});
	const [nestedTableFilterList, setNestedTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	useEffect(() => {
		setNestedTableQueryFilter({
			impact_units_org: impactUnitId,
		});
	}, [impactUnitId]);

	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	useEffect(() => {
		if (tableFilterList) {
			let newTableFilterListObject: { [key: string]: string } = removeEmptyKeys(tableFilterList);
			setQueryFilter({
				organization: dashboardData?.organization?.id,
				...newTableFilterListObject,
			});
		}
	}, [tableFilterList, dashboardData]);

	useEffect(() => {
		if (nestedTableFilterList) {
			const newNestedTableFilterListObject = removeEmptyKeys(nestedTableFilterList);
			setNestedTableQueryFilter(
				Object.assign(
					{},
					{ impact_units_org: impactUnitId },
					Object.keys(newNestedTableFilterListObject).length && {
						impact_category_org: {
							...newNestedTableFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, impactUnitId]);

	const removeNestedFilterListElements = (key: string, index?: number) => {
		setNestedTableFilterList((nestedTableFilterListObject) => {
			nestedTableFilterListObject[key] = "";
			return { ...nestedTableFilterListObject };
		});
	};

	let {
		changePage: changeImpactCategoryPage,
		count: impactCategoryCount,
		queryData: impactCategoryList,
		queryLoading: impactCategoryLoading,
		countQueryLoading: impactCategoryCountLoading,
	} = pagination({
		countQuery: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
		countFilter: queryFilter,
		query: GET_IMPACT_CATEGORY_BY_ORG,
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
	} = pagination({
		countQuery: GET_IMPACT_CATEGORY_UNIT_COUNT,
		countFilter: nestedTableQueryFilter,
		query: GET_IMPACT_CATEGORY_UNIT,
		queryFilter: nestedTableQueryFilter,
		sort: `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
		fireRequest: Boolean(impactUnitId && !collapsableTable),
	});

	const impactCategoryUnitListMemoized = useMemo(
		() =>
			impactCategoryUnitList?.impactCategoryUnitList?.map(
				(element: {
					impact_category_org: IImpactCategoryData;
					impact_units_org: IImpactUnitData;
				}) => element?.impact_category_org
			),
		[impactCategoryUnitList]
	);

	return (
		<ImpactCategoryTableContainer
			impactCategoryList={
				impactCategoryList?.impactCategoryOrgList || impactCategoryUnitListMemoized || []
			}
			collapsableTable={collapsableTable}
			changePage={
				dashboardData && collapsableTable
					? changeImpactCategoryPage
					: changeImpactCategoryUnitPage
			}
			loading={
				impactCategoryLoading ||
				impactCategoryCountLoading ||
				impactCategoryUnitLoading ||
				impactCategoryUnitCountLoading
			}
			count={
				dashboardData && collapsableTable ? impactCategoryCount : impactCategoryUnitCount
			}
			order={collapsableTable ? order : nestedTableOrder}
			setOrder={collapsableTable ? setOrder : setNestedTableOrder}
			orderBy={collapsableTable ? orderBy : nestedTableOrderBy}
			setOrderBy={collapsableTable ? setOrderBy : setNestedTableOrderBy}
			filterList={nestedTableFilterList}
			setFilterList={setNestedTableFilterList}
			removeFilterListElements={removeNestedFilterListElements}
		/>
	);
}

export default ImpactCategoryTableGraphql;
