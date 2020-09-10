import React, { useEffect, useState, useMemo } from "react";
import ImpactUnitContainer from "./ImpactUnitContainer";
import { useLazyQuery } from "@apollo/client";
import {
	GET_IMPACT_UNIT_BY_ORG,
	GET_IMPACT_UNIT_COUNT_BY_ORG,
} from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	IGetImpactUnit,
	IGetImpactUnitVariables,
	IGetImpactCategoryUnit,
	IGetImpactCategoryUnitVariables,
} from "../../../models/impact/query";
import {
	GET_IMPACT_CATEGORY_UNIT,
	GET_IMPACT_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Impact/categoryUnit";
import { IImpactUnitData, IImpactCategoryData } from "../../../models/impact/impact";
import pagination from "../../../hooks/pagination";

function ImpactUnitGraphql({
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

	// const [getImpactUnitList] = useLazyQuery<IGetImpactUnit, IGetImpactUnitVariables>(
	// 	GET_IMPACT_UNIT_BY_ORG,
	// 	{
	// 		onCompleted: (data) => {
	// 			if (collapsableTable) {
	// 				setImpactUnitList(data?.impactUnitsOrgList || []);
	// 			}
	// 		},
	// 	}
	// );

	// const [getImpactCategoryUnitList] = useLazyQuery<
	// 	IGetImpactCategoryUnit,
	// 	IGetImpactCategoryUnitVariables
	// >(GET_IMPACT_CATEGORY_UNIT, {
	// 	onCompleted: (data) => {
	// 		if (!collapsableTable) {
	// 			setImpactUnitList(
	// 				data?.impactCategoryUnitList?.map(
	// 					(element: {
	// 						impact_category_org: IImpactCategoryData;
	// 						impact_units_org: IImpactUnitData;
	// 					}) => element?.impact_units_org
	// 				) || []
	// 			);
	// 		}
	// 	},
	// });

	// useEffect(() => {
	// 	if (dashboardData?.organization && collapsableTable) {
	// 		getImpactUnitList({
	// 			variables: {
	// 				filter: {
	// 					organization: dashboardData?.organization?.id,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [dashboardData]);

	// useEffect(() => {
	// 	if (impactCategoryId && !collapsableTable) {
	// 		getImpactCategoryUnitList({
	// 			variables: {
	// 				filter: {
	// 					impact_category_org: impactCategoryId,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [impactCategoryId]);

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
		<ImpactUnitContainer
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

export default ImpactUnitGraphql;
