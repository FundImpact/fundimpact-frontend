import React, { useMemo, useState, useEffect, useCallback } from "react";
// import DeliverableUnitTableContainer from "./DeliverableUnitTableContainer";
// import GeographiesStateTableContainer from "./GeographiesStateTableContainer";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Deliverable/categoryUnit";
import {
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
} from "../../../graphql/Deliverable/unit";
import pagination from "../../../hooks/pagination";
import { IGetDeliverableCategoryUnit } from "../../../models/deliverable/query";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
import GeographiesBlockTableContainer from "./GeographiesBlockTableContainer";
import { GET_BLOCK_DATA } from "../../../graphql/Geographies/GeographiesBlock";
import { useLazyQuery } from "@apollo/client";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

function GeographiesBlockTableGraphql({
	collapsableTable = false,
	rowId: geographiesBlockId,
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string };
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const [nestedTableQueryFilter, setNestedTableQueryFilter] = useState({});
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [queryFilter, setQueryFilter] = useState({});
	const dashboardData = useDashBoardData();
	const [nestedTableFilterList, setNestedTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	const {
		refetchDeliverableUnitOnDeliverableUnitImport,
	} = useRefetchDeliverableMastersOnDeliverableMasterImport();

	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	const removeNestedFilterListElements = (key: string, index?: number) => {
		setNestedTableFilterList((nestedTableFilterListObject) => {
			nestedTableFilterListObject[key] = "";
			return { ...nestedTableFilterListObject };
		});
	};

	useEffect(() => {
		setNestedTableQueryFilter({
			deliverable_category_org: geographiesBlockId,
		});
	}, [geographiesBlockId]);

	useEffect(() => {
		if (tableFilterList) {
			const newFilterListObject = removeEmptyKeys(tableFilterList);
			setQueryFilter({
				organization: dashboardData?.organization?.id,
				...newFilterListObject,
			});
		}
	}, [tableFilterList, dashboardData]);

	useEffect(() => {
		if (nestedTableFilterList) {
			const newFilterListObject = removeEmptyKeys(nestedTableFilterList);
			setNestedTableQueryFilter(
				Object.assign(
					{},
					{ deliverable_category_org: geographiesBlockId },
					Object.keys(newFilterListObject).length && {
						deliverable_units_org: {
							...newFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, geographiesBlockId]);

	let {
		changePage: changeDeliverableUnitPage,
		count: deliverableUnitCount,
		queryData: deliverableUnitList,
		queryLoading: geographiesBlockLoading,
		// queryLoading: deliverableUnitLoading,
		countQueryLoading: geographiesBlockCountLoading,
		queryRefetch: deliverableUnitRefetch,
		countRefetch: deliverableUnitCountRefetch,
	} = pagination({
		countQuery: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
		countFilter: queryFilter,
		query: GET_DELIVERABLE_UNIT_BY_ORG,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});

	// let {
	// 	changePage: changeDeliverableCategoryUnitPage,
	// 	count: deliverableCategoryUnitCount,
	// 	queryData: deliverableCategoryUnitList,
	// 	queryLoading: deliverableCategoryUnitLoading,
	// 	countQueryLoading: deliverableCategoryUnitCountLoading,
	// 	queryRefetch: deliverableCategoryUnitRefetch,
	// 	countRefetch: deliverableCategoryUnitCountRefetch,
	// } = pagination({
	// 	countQuery: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
	// 	countFilter: nestedTableQueryFilter,
	// 	query: GET_CATEGORY_UNIT,
	// 	queryFilter: nestedTableQueryFilter,
	// 	sort: `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
	// 	fireRequest: Boolean(deliverableCategoryId && !collapsableTable),
	// });

	const reftechDeliverableCategoryAndUnitTable = useCallback(() => {
		// deliverableCategoryUnitCountRefetch?.().then(() => deliverableCategoryUnitRefetch?.());
		deliverableUnitCountRefetch?.().then(() => deliverableUnitRefetch?.());
		refetchDeliverableUnitOnDeliverableUnitImport();
	}, [
		// deliverableCategoryUnitCountRefetch,
		// deliverableCategoryUnitRefetch,
		deliverableUnitCountRefetch,
		deliverableUnitRefetch,
		refetchDeliverableUnitOnDeliverableUnitImport,
	]);

	console.log("deliverableUnitList?.deliverableUnitOrg", deliverableUnitList?.deliverableUnitOrg);

	const [getBlocks, blockResponse] = useLazyQuery(GET_BLOCK_DATA);

	useEffect(() => {
		getBlocks();
	}, []);

	const geographiesBlocksList = blockResponse?.data?.blocks || [];

	console.log("blockResponse", geographiesBlocksList);

	const GeographiesBlockCount: number = 10;

	return (
		// <DeliverableUnitTableContainer
		<GeographiesBlockTableContainer
			geographiesBlocksList={geographiesBlocksList}
			// deliverableUnitList={deliverableUnitList?.deliverableUnitOrg || []}
			collapsableTable={collapsableTable}
			changePage={changeDeliverableUnitPage}
			loading={geographiesBlockLoading || geographiesBlockCountLoading}
			count={GeographiesBlockCount}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={nestedTableFilterList}
			setFilterList={setNestedTableFilterList}
			removeFilterListElements={removeNestedFilterListElements}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
		/>
	);
}

export default GeographiesBlockTableGraphql;
