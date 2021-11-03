import React, { useMemo, useState, useEffect, useCallback } from "react";
import GeographiesStateTableContainer from "./GeographiesStateTableContainer";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import pagination from "../../../hooks/pagination";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
import { GET_STATE_COUNT, GET_STATE_DATA } from "../../../graphql/Geographies/GeographyState";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

function GeographiesStateTableGraphql({
	collapsableTable = false,
	rowId: geographiesStateId,
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
			deliverable_category_org: geographiesStateId,
		});
	}, [geographiesStateId]);

	useEffect(() => {
		if (tableFilterList) {
			const newFilterListObject = removeEmptyKeys(tableFilterList);
			setQueryFilter({
				// organization: dashboardData?.organization?.id,
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
					{ deliverable_category_org: geographiesStateId },
					Object.keys(newFilterListObject).length && {
						deliverable_units_org: {
							...newFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, geographiesStateId]);

	let {
		changePage: changeCountryStatePage,
		count: geographyStateCount,
		queryData: geographyState,
		queryLoading: deliverableUnitLoading,
		countQueryLoading: deliverableUnitCountLoading,
		queryRefetch: deliverableUnitRefetch,
		countRefetch: deliverableUnitCountRefetch,
	} = pagination({
		countQuery: GET_STATE_COUNT,
		countFilter: queryFilter,
		query: GET_STATE_DATA,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});

	const reftechDeliverableCategoryAndUnitTable = useCallback(() => {
		deliverableUnitCountRefetch?.().then(() => deliverableUnitRefetch?.());
		refetchDeliverableUnitOnDeliverableUnitImport();
	}, [
		deliverableUnitCountRefetch,
		deliverableUnitRefetch,
		refetchDeliverableUnitOnDeliverableUnitImport,
	]);

	let geographiesStateList: any =
		geographyState?.states.map((item: any) => ({
			...item,
			country: item.country ? item.country.name : null,
		})) || [];

	return (
		<GeographiesStateTableContainer
			geographiesStateList={geographiesStateList}
			collapsableTable={collapsableTable}
			changePage={changeCountryStatePage}
			loading={deliverableUnitLoading || deliverableUnitCountLoading}
			count={geographyStateCount?.aggregate?.count}
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

export default GeographiesStateTableGraphql;
