import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import pagination from "../../../hooks/pagination";
import { useRefetchDeliverableMastersOnDeliverableMasterImport } from "../../../hooks/deliverable";
import TallyMapperLedgerTableContainer from "./TallyMapperLedgerTableContainer";
import {
	GET_DISTRICT_COUNT,
	GET_DISTRICT_DATA,
} from "../../../graphql/Geographies/GeographiesDistrict";
import { useLazyQuery } from "@apollo/client";
import { GET_TALLYMAPPER_LEDGERS } from "../../../graphql/TallyMapper/TallyMapperLedger";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

function TallyMapperLedgerTableGraphql({
	collapsableTable = false,
	rowId: geographiesDistrictId,
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
			deliverable_category_org: geographiesDistrictId,
		});
	}, [geographiesDistrictId]);

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
					{ deliverable_category_org: geographiesDistrictId },
					Object.keys(newFilterListObject).length && {
						deliverable_units_org: {
							...newFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, geographiesDistrictId]);

	let {
		changePage: changeDeliverableUnitPage,
		count: geographyDistrictCount,
		queryData: geographyDistrict,
		queryLoading: geographiesDistrictLoading,
		countQueryLoading: GeographiesDistrictCountLoading,
		queryRefetch: deliverableUnitRefetch,
		countRefetch: deliverableUnitCountRefetch,
	} = pagination({
		countQuery: GET_DISTRICT_COUNT,
		countFilter: queryFilter,
		query: GET_DISTRICT_DATA,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
	});

	// console.log("deliverableUnitCount", deliverableUnitCount, deliverableUnitList);

	const reftechDeliverableCategoryAndUnitTable = useCallback(() => {
		deliverableUnitCountRefetch?.().then(() => deliverableUnitRefetch?.());
		refetchDeliverableUnitOnDeliverableUnitImport();
	}, [
		deliverableUnitCountRefetch,
		deliverableUnitRefetch,
		refetchDeliverableUnitOnDeliverableUnitImport,
	]);

	const geographiesDistrictList: any =
		geographyDistrict?.districts.map((item: any) => ({
			...item,
			state: item.state ? item.state.name : null,
		})) || [];

	const [getTallyMapperLedgers, ledgerResponse] = useLazyQuery(GET_TALLYMAPPER_LEDGERS);

	useEffect(() => {
		getTallyMapperLedgers();
	}, []);

	let ledgerResponseList = ledgerResponse?.data;

	console.log("ledgerResponseList", ledgerResponseList);

	return (
		<TallyMapperLedgerTableContainer
			geographiesDistrictList={geographiesDistrictList}
			collapsableTable={collapsableTable}
			changePage={changeDeliverableUnitPage}
			loading={geographiesDistrictLoading || GeographiesDistrictCountLoading}
			count={geographyDistrictCount?.aggregate?.count}
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

export default TallyMapperLedgerTableGraphql;
