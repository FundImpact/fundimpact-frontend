import React, { useMemo } from "react";
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
		sort: "created_at:DESC",
		fireRequest: Boolean(impactCategoryId && !collapsableTable),
	});

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
		sort: "created_at:DESC",
		fireRequest: Boolean(dashboardData && collapsableTable),
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
		/>
	);
}

export default ImpactUnitTableGraphql;
