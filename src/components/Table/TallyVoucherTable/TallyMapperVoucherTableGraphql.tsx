import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";

import pagination from "../../../hooks/pagination";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
import TallyMapperVoucherTableContainer from "./TallyMapperVoucherTableContainer";
import {
	GET_GRAMPANCHAYAT_COUNT,
	GET_GRAMPANCHAYAT_DATA,
} from "../../../graphql/Geographies/GeographiesGrampanchayat";
import { useLazyQuery } from "@apollo/client";
import {
	GET_TALLYMAPPER_VOUCHERTYPE,
	GET_TALLYMAPPER_VOUCHERTYPE_COUNT,
} from "../../../graphql/TallyMapper/TallyMapperVoucherType";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

function TallyMapperVoucherTableGraphql({
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
		changePage: changeTallyMapperVoucherPage,
		count: tallyMapperVoucherCount,
		queryData: tallyMapperVoucherData,
		queryLoading: tallyMapperVoucherLoading,
		countQueryLoading: tallyMapperVoucherCountLoading,
		queryRefetch: deliverableUnitRefetch,
		countRefetch: deliverableUnitCountRefetch,
	} = pagination({
		countQuery: GET_TALLYMAPPER_VOUCHERTYPE_COUNT,
		countFilter: queryFilter,
		query: GET_TALLYMAPPER_VOUCHERTYPE,
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

	return (
		<TallyMapperVoucherTableContainer
			geographiesGrampanchayatList={tallyMapperVoucherData?.voucherTypes || []}
			collapsableTable={collapsableTable}
			changePage={changeTallyMapperVoucherPage}
			loading={tallyMapperVoucherLoading || tallyMapperVoucherCountLoading}
			count={tallyMapperVoucherCount?.aggregate?.count}
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

export default TallyMapperVoucherTableGraphql;
