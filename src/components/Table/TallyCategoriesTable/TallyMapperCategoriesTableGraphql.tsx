import React, { useMemo, useState, useEffect, useCallback } from "react";
import TallyMapperCategoriesTableContainer from "./TallyMapperCategoriesTableContainer";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import pagination from "../../../hooks/pagination";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
import { GET_STATE_COUNT, GET_STATE_DATA } from "../../../graphql/Geographies/GeographyState";
import { useLazyQuery } from "@apollo/client";
import {
	GET_TALLYMAPPER_COSTCATEGORIES,
	GET_TALLYMAPPER_COSTCATEGORIES_COUNT,
} from "../../../graphql/TallyMapper/TallyMapperCategories";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

function TallyMapperCategoriesTableGraphql({
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
		count: tallyMapperCostCategoryCount,
		queryData: tallyMapperCostCategories,
		queryLoading: deliverableUnitLoading,
		countQueryLoading: deliverableUnitCountLoading,
		queryRefetch: deliverableUnitRefetch,
		countRefetch: deliverableUnitCountRefetch,
	} = pagination({
		countQuery: GET_TALLYMAPPER_COSTCATEGORIES_COUNT,
		countFilter: queryFilter,
		query: GET_TALLYMAPPER_COSTCATEGORIES,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});

	// console.log("geographyStateCount", geographyStateCount, geographyState);

	const reftechDeliverableCategoryAndUnitTable = useCallback(() => {
		deliverableUnitCountRefetch?.().then(() => deliverableUnitRefetch?.());
		refetchDeliverableUnitOnDeliverableUnitImport();
	}, [
		deliverableUnitCountRefetch,
		deliverableUnitRefetch,
		refetchDeliverableUnitOnDeliverableUnitImport,
	]);

	// let geographiesStateList: any =
	// 	geographyState?.states.map((item: any) => ({
	// 		...item,
	// 		country: item.country ? item.country.name : null,
	// 	})) || [];

	return (
		<TallyMapperCategoriesTableContainer
			geographiesStateList={tallyMapperCostCategories?.costCategories || []}
			collapsableTable={collapsableTable}
			changePage={changeCountryStatePage}
			loading={deliverableUnitLoading || deliverableUnitCountLoading}
			count={tallyMapperCostCategoryCount?.aggregate?.count}
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

export default TallyMapperCategoriesTableGraphql;
