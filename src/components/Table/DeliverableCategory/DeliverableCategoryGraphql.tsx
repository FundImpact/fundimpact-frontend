import React, { useEffect, useState, useMemo } from "react";
import DeliverableCategoryContainer from "./DeliverableCategoryContainer";
import { useLazyQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_DELIVERABLE_ORG_CATEGORY,
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
} from "../../../graphql/Deliverable/category";
import {
	IGetDeliverablCategoryVariables,
	IGetDeliverableCategory,
	IGetDeliverableCategoryUnitVariables,
	IGetDeliverableCategoryUnit,
} from "../../../models/deliverable/query";
import { IDeliverableUnitData } from "../../../models/deliverable/deliverableUnit";
import { IDeliverableCategoryData } from "../../../models/deliverable/deliverable";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Deliverable/categoryUnit";
import pagination from "../../../hooks/pagination";

//insert genrics in pagination
function DeliverableCategoryGraphql({
	collapsableTable = true,
	rowId: delivarableUnitId,
}: {
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const dashboardData = useDashBoardData();

	let {
		changePage: changeDeliverableCategoryPage,
		count: deliverableCategoryCount,
		queryData: deliverableCategoryList,
		queryLoading: deliverableCategoryLoading,
		countQueryLoading: deliverableCategoryCountLoading,
	} = pagination({
		countQuery: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
		countFilter: {
			organization: dashboardData?.organization?.id,
		},
		query: GET_DELIVERABLE_ORG_CATEGORY,
		queryFilter: {
			organization: dashboardData?.organization?.id,
		},
		sort: "created_at:DESC",
		fireRequest: Boolean(dashboardData && collapsableTable),
	});

	let {
		changePage: changeDeliverableCategoryUnitPage,
		count: deliverableCategoryUnitCount,
		queryData: deliverableCategoryUnitList,
		queryLoading: deliverableCategoryUnitLoading,
		countQueryLoading: deliverableCategoryUnitCountLoading,
	} = pagination({
		countQuery: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
		countFilter: {
			deliverable_units_org: delivarableUnitId,
		},
		query: GET_CATEGORY_UNIT,
		queryFilter: {
			deliverable_units_org: delivarableUnitId,
		},
		sort: "created_at:DESC",
		fireRequest: Boolean(delivarableUnitId && !collapsableTable),
	});

	// const [deliverableCategoryList, setDeliverableCategoryList] = useState<
	// 	IDeliverableCategoryData[]
	// >([]);

	// if (budgetCategoryList) {
	// 	setDeliverableCategoryList(budgetCategoryList?.deliverableCategory || []);
	// }

	// const [getDeliverableCategoryList] = useLazyQuery<
	// 	IGetDeliverableCategory,
	// 	IGetDeliverablCategoryVariables
	// >(GET_DELIVERABLE_ORG_CATEGORY, {
	// 	onCompleted: (data) => {
	// 		if (collapsableTable) {
	// 			setDeliverableCategoryList(data?.deliverableCategory || []);
	// 		}
	// 	},
	// });

	// const [getDeliverableCategoryUnitList] = useLazyQuery<
	// 	IGetDeliverableCategoryUnit,
	// 	IGetDeliverableCategoryUnitVariables
	// >(GET_CATEGORY_UNIT, {
	// 	onCompleted: (data) => {
	// 		if (!collapsableTable) {
	// 			setDeliverableCategoryList(
	// 				data?.deliverableCategoryUnitList?.map(
	// 					(element: {
	// 						deliverable_category_org: IDeliverableCategoryData;
	// 						deliverable_units_org: IDeliverableUnitData;
	// 					}) => element?.deliverable_category_org
	// 				) || []
	// 			);
	// 		}
	// 	},
	// });

	// useEffect(() => {
	// 	if (dashboardData?.organization && collapsableTable) {
	// 		getDeliverableCategoryList({
	// 			variables: {
	// 				filter: {
	// 					organization: dashboardData?.organization?.id,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [dashboardData]);

	// useEffect(() => {
	// 	if (delivarableUnitId && !collapsableTable) {
	// 		getDeliverableCategoryUnitList({
	// 			variables: {
	// 				filter: {
	// 					deliverable_units_org: delivarableUnitId,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [delivarableUnitId]);

	const deliverableCategoryUnitListMemoized = useMemo(
		() =>
			deliverableCategoryUnitList?.deliverableCategoryUnitList?.map(
				(element: {
					deliverable_category_org: IDeliverableCategoryData;
					deliverable_units_org: IDeliverableUnitData;
				}) => element?.deliverable_category_org
			),
		[deliverableCategoryUnitList]
	);

	return (
		<DeliverableCategoryContainer
			deliverableCategoryList={
				deliverableCategoryList?.deliverableCategory ||
				deliverableCategoryUnitListMemoized ||
				[]
			}
			collapsableTable={collapsableTable}
			changePage={
				dashboardData && collapsableTable
					? changeDeliverableCategoryPage
					: changeDeliverableCategoryUnitPage
			}
			loading={
				deliverableCategoryLoading ||
				deliverableCategoryCountLoading ||
				deliverableCategoryUnitLoading ||
				deliverableCategoryUnitCountLoading
			}
			count={
				dashboardData && collapsableTable
					? deliverableCategoryCount
					: deliverableCategoryUnitCount
			}
		/>
	);
}

export default DeliverableCategoryGraphql;
