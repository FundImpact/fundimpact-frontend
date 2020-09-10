import React, { useEffect, useState, useMemo } from "react";
import ImpactCategoryContainer from "./ImpactCategoryContainer";
import { useLazyQuery } from "@apollo/client";
import {
	GET_IMPACT_CATEGORY_BY_ORG,
	GET_IMPACT_CATEGORY_COUNT_BY_ORG,
} from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	IGetImpactCategory,
	IGetImpactCategoryVariables,
	IGetImpactCategoryUnit,
	IGetImpactCategoryUnitVariables,
} from "../../../models/impact/query";
import {
	GET_IMPACT_CATEGORY_UNIT,
	GET_IMPACT_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Impact/categoryUnit";
import { IImpactCategoryData, IImpactUnitData } from "../../../models/impact/impact";
import pagination from "../../../hooks/pagination";

function ImpactCategoryGraphql({
	collapsableTable = true,
	rowId: impactUnitId,
}: {
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const dashboardData = useDashBoardData();

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
		sort: "created_at:DESC",
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
		sort: "created_at:DESC",
		fireRequest: Boolean(impactUnitId && !collapsableTable),
	});

	// const [getImpactCategoryList, { data: impactCategoryListData }] = useLazyQuery<
	// 	IGetImpactCategory,
	// 	IGetImpactCategoryVariables
	// >(GET_IMPACT_CATEGORY_BY_ORG, {
	// 	onCompleted: (data) => {
	// 		if (collapsableTable) {
	// 			setImpactCategoryList(data?.impactCategoryOrgList || []);
	// 		}
	// 	},
	// });

	// const [getImpactCategoryUnitList] = useLazyQuery<
	// 	IGetImpactCategoryUnit,
	// 	IGetImpactCategoryUnitVariables
	// >(GET_IMPACT_CATEGORY_UNIT, {
	// 	onCompleted: (data) => {
	// 		if (!collapsableTable) {
	// 			setImpactCategoryList(
	// 				data?.impactCategoryUnitList?.map(
	// 					(element: {
	// 						impact_category_org: IImpactCategoryData;
	// 						impact_units_org: IImpactUnitData;
	// 					}) => element?.impact_category_org
	// 				) || []
	// 			);
	// 		}
	// 	},
	// });

	// useEffect(() => {
	// 	if (dashboardData?.organization && collapsableTable) {
	// 		getImpactCategoryList({
	// 			variables: {
	// 				filter: {
	// 					organization: dashboardData?.organization?.id,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [dashboardData]);

	// useEffect(() => {
	// 	if (impactUnitId && !collapsableTable) {
	// 		getImpactCategoryUnitList({
	// 			variables: {
	// 				filter: {
	// 					impact_units_org: impactUnitId,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [impactUnitId]);

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
		<ImpactCategoryContainer
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
		/>
	);
}

export default ImpactCategoryGraphql;
