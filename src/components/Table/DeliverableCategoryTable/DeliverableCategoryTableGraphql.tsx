import React, { useMemo, useState, useEffect } from "react";
import DeliverableCategoryTableContainer from "./DeliverableCategoryTableContainer";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_DELIVERABLE_ORG_CATEGORY,
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
} from "../../../graphql/Deliverable/category";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Deliverable/categoryUnit";
import pagination from "../../../hooks/pagination";
import { IGetDeliverableCategoryUnit } from "../../../models/deliverable/query";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

//insert genrics in pagination
function DeliverableCategoryTableGraphql({
	collapsableTable = true,
	rowId: delivarableUnitId,
	tableFilterList,
}: {
	collapsableTable?: boolean;
	rowId?: string;
	tableFilterList?: { [key: string]: string };
}) {
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const dashboardData = useDashBoardData();
	const [nestedTableQueryFilter, setNestedTableQueryFilter] = useState({});
	const [queryFilter, setQueryFilter] = useState({});
	const [nestedTableFilterList, setNestedTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	const removeNestedFilterListElements = (key: string, index?: number) => {
		setNestedTableFilterList((nestedTableFilterListObject) => {
			nestedTableFilterListObject[key] = "";
			return { ...nestedTableFilterListObject };
		});
	};

	useEffect(() => {
		if (tableFilterList) {
			let newFilterListObject: { [key: string]: string } = removeEmptyKeys(tableFilterList);
			setQueryFilter({
				organization: dashboardData?.organization?.id,
				...newFilterListObject,
			});
		}
	}, [tableFilterList, dashboardData]);

	useEffect(() => {
		setNestedTableQueryFilter({
			deliverable_units_org: delivarableUnitId,
		});
	}, [delivarableUnitId]);

	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	useEffect(() => {
		if (nestedTableFilterList) {
			const newNestedTableFilterListObject = removeEmptyKeys(nestedTableFilterList);
			setNestedTableQueryFilter(
				Object.assign(
					{},
					{ deliverable_units_org: delivarableUnitId },
					Object.keys(newNestedTableFilterListObject).length && {
						deliverable_category_org: {
							...newNestedTableFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, delivarableUnitId]);

	let {
		changePage: changeDeliverableCategoryPage,
		count: deliverableCategoryCount,
		queryData: deliverableCategoryList,
		queryLoading: deliverableCategoryLoading,
		countQueryLoading: deliverableCategoryCountLoading,
		queryRefetch: refetchDeliverableCategory,
	} = pagination({
		countQuery: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
		countFilter: queryFilter,
		query: GET_DELIVERABLE_ORG_CATEGORY,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData && collapsableTable),
	});

	let {
		changePage: changeDeliverableCategoryUnitPage,
		count: deliverableCategoryUnitCount,
		queryData: deliverableCategoryUnitList,
		queryLoading: deliverableCategoryUnitLoading,
		countQueryLoading: deliverableCategoryUnitCountLoading,
		queryRefetch: refetchDeliverableCategoryUnit,
	} = pagination({
		countQuery: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
		countFilter: nestedTableQueryFilter,
		query: GET_CATEGORY_UNIT,
		queryFilter: nestedTableQueryFilter,
		sort: `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
		fireRequest: Boolean(delivarableUnitId && !collapsableTable),
	});

	const reftechDeliverableCategoryAndUnitTable = () => {
		refetchDeliverableCategory?.();
		refetchDeliverableCategoryUnit?.();
	};

	const deliverableCategoryUnitListMemoized = useMemo(
		() =>
			deliverableCategoryUnitList?.deliverableCategoryUnitList
				?.filter(
					(element: IGetDeliverableCategoryUnit["deliverableCategoryUnitList"][0]) =>
						element.status
				)
				.map(
					(element: IGetDeliverableCategoryUnit["deliverableCategoryUnitList"][0]) =>
						element?.deliverable_category_org
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
			filterList={nestedTableFilterList}
			setFilterList={setNestedTableFilterList}
			removeFilterListElements={removeNestedFilterListElements}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
		/>
	);
}

export default DeliverableCategoryTableGraphql;
