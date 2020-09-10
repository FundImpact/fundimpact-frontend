import React, { useEffect, useState, useMemo } from "react";
import DeliverableUnitContainer from "./DeliverableUnitContainer";
import { useLazyQuery } from "@apollo/client";
import { GET_IMPACT_UNIT_BY_ORG } from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	IGetImpactUnit,
	IGetImpactUnitVariables,
	IGetImpactCategoryUnit,
	IGetImpactCategoryUnitVariables,
} from "../../../models/impact/query";
import { GET_IMPACT_CATEGORY_UNIT } from "../../../graphql/Impact/categoryUnit";
import { IImpactUnitData, IImpactCategoryData } from "../../../models/impact/impact";
import {
	IGetDeliverablUnit,
	IGetDeliverableUnitVariables,
	IGetDeliverableCategoryUnit,
	IGetDeliverableCategoryUnitVariables,
} from "../../../models/deliverable/query";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Deliverable/categoryUnit";
import {
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
} from "../../../graphql/Deliverable/unit";
import { IDeliverableUnitData } from "../../../models/deliverable/deliverableUnit";
import { IDeliverableCategoryData } from "../../../models/deliverable/deliverable";
import pagination from "../../../hooks/pagination";

function DeliverableUnitGraphql({
	collapsableTable = true,
	rowId: deliverableCategoryId,
}: {
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const dashboardData = useDashBoardData();

	let {
		changePage: changeDeliverableCategoryUnitPage,
		count: deliverableCategoryUnitCount,
		queryData: deliverableCategoryUnitList,
		queryLoading: deliverableCategoryUnitLoading,
		countQueryLoading: deliverableCategoryUnitCountLoading,
	} = pagination({
		countQuery: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
		countFilter: {
			deliverable_category_org: deliverableCategoryId,
		},
		query: GET_CATEGORY_UNIT,
		queryFilter: {
			deliverable_category_org: deliverableCategoryId,
		},
		sort: "created_at:DESC",
		fireRequest: Boolean(deliverableCategoryId && !collapsableTable),
	});

	let {
		changePage: changeDeliverableUnitPage,
		count: deliverableUnitCount,
		queryData: deliverableUnitList,
		queryLoading: deliverableUnitLoading,
		countQueryLoading: deliverableUnitCountLoading,
	} = pagination({
		countQuery: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
		countFilter: {
			organization: dashboardData?.organization?.id,
		},
		query: GET_DELIVERABLE_UNIT_BY_ORG,
		queryFilter: {
			organization: dashboardData?.organization?.id,
		},
		sort: "created_at:DESC",
		fireRequest: Boolean(dashboardData && collapsableTable),
	});

	// const [deliverableUnitList, setDeliverableUnitList] = useState<IDeliverableUnitData[]>([]);

	// const [getDeliverableUnitList] = useLazyQuery<IGetDeliverablUnit, IGetDeliverableUnitVariables>(
	// 	GET_DELIVERABLE_UNIT_BY_ORG,
	// 	{
	// 		onCompleted: (data) => {
	// 			if (collapsableTable) {
	// 				setDeliverableUnitList(data?.deliverableUnitOrg || []);
	// 			}
	// 		},
	// 	}
	// );

	// const [getDeliverableCategoryUnitList] = useLazyQuery<
	// 	IGetDeliverableCategoryUnit,
	// 	IGetDeliverableCategoryUnitVariables
	// >(GET_CATEGORY_UNIT, {
	// 	onCompleted: (data) => {
	// 		if (!collapsableTable) {
	// 			setDeliverableUnitList(
	// 				data?.deliverableCategoryUnitList?.map(
	// 					(element: {
	// 						deliverable_category_org: IDeliverableCategoryData;
	// 						deliverable_units_org: IDeliverableUnitData;
	// 					}) => element?.deliverable_units_org
	// 				) || []
	// 			);
	// 		}
	// 	},
	// });

	// useEffect(() => {
	// 	if (dashboardData?.organization && collapsableTable) {
	// 		getDeliverableUnitList({
	// 			variables: {
	// 				filter: {
	// 					organization: dashboardData?.organization?.id,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [dashboardData]);

	// useEffect(() => {
	// 	if (deliverableCategoryId && !collapsableTable) {
	// 		getDeliverableCategoryUnitList({
	// 			variables: {
	// 				filter: {
	// 					deliverable_category_org: deliverableCategoryId,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [deliverableCategoryId]);

	const deliverableCategoryUnitListMemoized = useMemo(
		() =>
			deliverableCategoryUnitList?.deliverableCategoryUnitList?.map(
				(element: {
					deliverable_category_org: IDeliverableCategoryData;
					deliverable_units_org: IDeliverableUnitData;
				}) => element?.deliverable_units_org
			),
		[deliverableCategoryUnitList]
	);

	return (
		<DeliverableUnitContainer
			deliverableUnitList={
				deliverableUnitList?.deliverableUnitOrg || deliverableCategoryUnitListMemoized || []
			}
			collapsableTable={collapsableTable}
			changePage={
				dashboardData && collapsableTable
					? changeDeliverableUnitPage
					: changeDeliverableCategoryUnitPage
			}
			loading={
				deliverableUnitLoading ||
				deliverableUnitCountLoading ||
				deliverableCategoryUnitLoading ||
				deliverableCategoryUnitCountLoading
			}
			count={
				dashboardData && collapsableTable
					? deliverableUnitCount
					: deliverableCategoryUnitCount
			}
		/>
	);
}

export default DeliverableUnitGraphql;
