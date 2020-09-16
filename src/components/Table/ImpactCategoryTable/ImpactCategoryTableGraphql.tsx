import React, { useMemo, useState } from "react";
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

function ImpactCategoryTableGraphql({
	collapsableTable = true,
	rowId: impactUnitId,
}: {
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");

	let {
		changePage: changeImpactCategoryPage,
		count: impactCategoryCount,
		queryData: impactCategoryList,
		queryLoading: impactCategoryLoading,
		countQueryLoading: impactCategoryCountLoading,
	} = pagination({
		countQuery: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
		countFilter: {
			organization: dashboardData?.organization?.id,
		},
		query: GET_IMPACT_CATEGORY_BY_ORG,
		queryFilter: {
			organization: dashboardData?.organization?.id,
		},
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
		countFilter: {
			impact_units_org: impactUnitId,
		},
		query: GET_IMPACT_CATEGORY_UNIT,
		queryFilter: {
			impact_units_org: impactUnitId,
		},
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
		/>
	);
}

export default ImpactCategoryTableGraphql;
