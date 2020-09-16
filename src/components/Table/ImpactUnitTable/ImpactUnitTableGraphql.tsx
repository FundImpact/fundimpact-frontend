import React, { useMemo, useState } from "react";
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
import { IImpactUnitData, IImpactCategoryData } from "../../../models/impact/impact";
import pagination from "../../../hooks/pagination";

function ImpactUnitTableGraphql({
	collapsableTable = true,
	rowId: impactCategoryId,
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
		changePage: changeImpactUnitPage,
		count: impactUnitCount,
		queryData: impactUnitList,
		queryLoading: impactUnitLoading,
		countQueryLoading: impactUnitCountLoading,
	} = pagination({
		countQuery: GET_IMPACT_UNIT_COUNT_BY_ORG,
		countFilter: {
			organization: dashboardData?.organization?.id,
		},
		query: GET_IMPACT_UNIT_BY_ORG,
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
			impact_category_org: impactCategoryId,
		},
		query: GET_IMPACT_CATEGORY_UNIT,
		queryFilter: {
			impact_category_org: impactCategoryId,
		},
		sort:  `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
		fireRequest: Boolean(impactCategoryId && !collapsableTable),
	});

	const impactCategoryUnitListMemoized = useMemo(
		() =>
			impactCategoryUnitList?.impactCategoryUnitList?.map(
				(element: {
					impact_category_org: IImpactCategoryData;
					impact_units_org: IImpactUnitData;
				}) => element?.impact_units_org
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
		/>
	);
}

export default ImpactUnitTableGraphql;
