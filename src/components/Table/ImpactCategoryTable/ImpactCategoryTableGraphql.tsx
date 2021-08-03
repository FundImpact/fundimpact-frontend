import React, { useMemo, useState, useEffect, useCallback } from "react";
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
import { IGetImpactCategoryUnit } from "../../../models/impact/query";
import { useRefetchImpactMastersOnImpactMasterImport } from "../../../hooks/impact";

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
	collapsableTable = false,
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

	const {
		refetchImpactCategoryOnImpactCategoryImport,
	} = useRefetchImpactMastersOnImpactMasterImport();

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
			let newTableFilterListObject: { [key: string]: string } = removeEmptyKeys(
				tableFilterList
			);
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

	const [limit, setLimit] = useState(10);

	let {
		changePage: changeImpactCategoryPage,
		count: impactCategoryCount,
		queryData: impactCategoryList,
		queryLoading: impactCategoryLoading,
		countQueryLoading: impactCategoryCountLoading,
		queryRefetch: impactCategoryRefetch,
		countRefetch: impactCategoryCountRefetch,
	} = pagination({
		countQuery: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
		countFilter: queryFilter,
		query: GET_IMPACT_CATEGORY_BY_ORG,
		queryFilter,
		limit: limit,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});

	// let {
	// 	changePage: changeImpactCategoryUnitPage,
	// 	count: impactCategoryUnitCount,
	// 	queryData: impactCategoryUnitList,
	// 	queryLoading: impactCategoryUnitLoading,
	// 	countQueryLoading: impactCategoryUnitCountLoading,
	// 	queryRefetch: impactCategoryUnitRefetch,
	// 	countRefetch: impactCategoryUnitCountRefetch,
	// } = pagination({
	// 	countQuery: GET_IMPACT_CATEGORY_UNIT_COUNT,
	// 	countFilter: nestedTableQueryFilter,
	// 	query: GET_IMPACT_CATEGORY_UNIT,
	// 	queryFilter: nestedTableQueryFilter,
	// 	sort: `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
	// 	fireRequest: Boolean(impactUnitId && !collapsableTable),
	// });

	const reftechImpactCategoryAndUnitTable = useCallback(() => {
		refetchImpactCategoryOnImpactCategoryImport();
		impactCategoryCountRefetch?.().then(() => impactCategoryRefetch?.());
		// impactCategoryUnitCountRefetch?.().then(() => impactCategoryUnitRefetch?.());
	}, [
		impactCategoryCountRefetch,
		// impactCategoryUnitCountRefetch,
		impactCategoryRefetch,
		refetchImpactCategoryOnImpactCategoryImport,
		// impactCategoryUnitRefetch,
	]);

	// const impactCategoryUnitListMemoized = useMemo(
	// 	() =>
	// 		impactCategoryUnitList?.impactCategoryUnitList
	// 			?.filter(
	// 				(element: IGetImpactCategoryUnit["impactCategoryUnitList"][0]) => element.status
	// 			)
	// 			.map(
	// 				(element: IGetImpactCategoryUnit["impactCategoryUnitList"][0]) =>
	// 					element?.impact_category_org
	// 			),
	// 	[impactCategoryUnitList]
	// );

	return (
		<ImpactCategoryTableContainer
			impactCategoryList={impactCategoryList?.impactCategoryOrgList || []}
			collapsableTable={collapsableTable}
			changePage={changeImpactCategoryPage}
			loading={impactCategoryLoading || impactCategoryCountLoading}
			count={impactCategoryCount}
			limit={limit}
			setLimit={setLimit}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={nestedTableFilterList}
			setFilterList={setNestedTableFilterList}
			removeFilterListElements={removeNestedFilterListElements}
			reftechImpactCategoryAndUnitTable={reftechImpactCategoryAndUnitTable}
		/>
	);
}

export default ImpactCategoryTableGraphql;
