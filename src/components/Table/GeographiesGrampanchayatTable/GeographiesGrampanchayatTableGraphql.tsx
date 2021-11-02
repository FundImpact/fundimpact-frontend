import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";

import pagination from "../../../hooks/pagination";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
import GeographiesGrampanchayatTableContainer from "./GeographiesGrampanchayatTableContainer";
import {
	GET_GRAMPANCHAYAT_COUNT,
	GET_GRAMPANCHAYAT_DATA,
} from "../../../graphql/Geographies/GeographiesGrampanchayat";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

function GeographiesGrampanchayatTableGraphql({
	collapsableTable = false,
	rowId: geographiesGrampanchayatId,
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
			deliverable_category_org: geographiesGrampanchayatId,
		});
	}, [geographiesGrampanchayatId]);

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
					{ deliverable_category_org: geographiesGrampanchayatId },
					Object.keys(newFilterListObject).length && {
						deliverable_units_org: {
							...newFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, geographiesGrampanchayatId]);

	let {
		changePage: changeGeographiesGrampanchayatPage,
		count: geographyGrampanchayatCount,
		queryData: geographyGrampanchayat,
		queryLoading: geographiesGrampanchayatLoading,
		countQueryLoading: geographiesGrampanchayatCountLoading,
		queryRefetch: deliverableUnitRefetch,
		countRefetch: deliverableUnitCountRefetch,
	} = pagination({
		countQuery: GET_GRAMPANCHAYAT_COUNT,
		countFilter: queryFilter,
		query: GET_GRAMPANCHAYAT_DATA,
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

	const geographiesGrampanchayatList: any =
		geographyGrampanchayat?.grampanchayats.map((item: any) => ({
			...item,
			district: item.district ? item.district.name : null,
		})) || [];

	return (
		<GeographiesGrampanchayatTableContainer
			geographiesGrampanchayatList={geographiesGrampanchayatList}
			collapsableTable={collapsableTable}
			changePage={changeGeographiesGrampanchayatPage}
			loading={geographiesGrampanchayatLoading || geographiesGrampanchayatCountLoading}
			count={geographyGrampanchayatCount?.aggregate?.count}
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

export default GeographiesGrampanchayatTableGraphql;
