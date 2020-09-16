import React, { useMemo, useState } from "react";
import DeliverableCategoryTableContainer from "./DeliverableCategoryTableContainer";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_DELIVERABLE_ORG_CATEGORY,
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
} from "../../../graphql/Deliverable/category";
import { IDeliverableUnitData } from "../../../models/deliverable/deliverableUnit";
import { IDeliverableCategoryData } from "../../../models/deliverable/deliverable";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Deliverable/categoryUnit";
import pagination from "../../../hooks/pagination";

//insert genrics in pagination
function DeliverableCategoryTableGraphql({
	collapsableTable = true,
	rowId: delivarableUnitId,
}: {
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");

	console.log(`${orderBy}:${order.toUpperCase()}`);
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
		sort: `${orderBy}:${order.toUpperCase()}`,
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
		sort: `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
		fireRequest: Boolean(delivarableUnitId && !collapsableTable),
	});

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
		<DeliverableCategoryTableContainer
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
			order={collapsableTable ? order : nestedTableOrder}
			setOrder={collapsableTable ? setOrder : setNestedTableOrder}
			orderBy={collapsableTable ? orderBy : nestedTableOrderBy}
			setOrderBy={collapsableTable ? setOrderBy : setNestedTableOrderBy}
		/>
	);
}

export default DeliverableCategoryTableGraphql;
