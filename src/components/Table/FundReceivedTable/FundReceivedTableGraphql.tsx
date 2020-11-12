import React, { useEffect, useState } from "react";
import FundReceivedTableContainer from "./FundReceivedTableContainer";
import { useLazyQuery } from "@apollo/client";
import {
	GET_FUND_RECEIPT_PROJECT_LIST,
	GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
} from "../../../graphql/FundRecevied";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	IGet_Fund_Receipt_List,
	IGet_Fund_Receipt_List_Variables,
} from "../../../models/fundReceived/query";
import { setErrorNotification } from "../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import pagination from "../../../hooks/pagination";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { fundReceiptInputFields } from "./inputFields.json";
import { GET_PROJECT_DONORS } from "../../../graphql";
import { GET_PROJ_DONORS } from "../../../graphql/project";

let donorHash = {};

const mapIdToName = (
	arr: { id: string; name: string }[],
	initialObject: { [key: string]: string }
) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		initialObject
	);
};

const getDefaultFilterList = () => ({
	amount: "",
	reporting_date: "",
	project_donor: [],
});

const convertProjectDonorListToIdNameFormat = (
	projectDonors: { id: string; donor: { id: string; name: string } }[]
) => projectDonors.map((projectDonor) => ({ id: projectDonor.id, name: projectDonor.donor.name }));

function FundReceivedTableGraphql() {
	const dashboardData = useDashBoardData();
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>(getDefaultFilterList());

	const [getProjectDonors, { data }] = useLazyQuery<{
		projectDonors: { id: string; donor: { id: string; name: string } }[];
	}>(GET_PROJ_DONORS, {
		onCompleted: (data) => {
			donorHash = mapIdToName(
				convertProjectDonorListToIdNameFormat(data?.projectDonors || []),
				donorHash
				);
			},
		});
		
		console.log("data :>> ", data);
	(fundReceiptInputFields[1].optionsArray as {
		id: string;
		name: string;
	}[]) = convertProjectDonorListToIdNameFormat(data?.projectDonors || []);

	useEffect(() => {
		if (dashboardData && dashboardData.project) {
			getProjectDonors({
				variables: {
					filter: {
						project: dashboardData?.project?.id,
					},
				},
			});
		}
	}, [dashboardData]);

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		if (dashboardData) {
			setQueryFilter({
				project: dashboardData?.project?.id || "",
			});
			setFilterList(getDefaultFilterList());
		}
	}, [dashboardData, setFilterList, setQueryFilter]);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				project: dashboardData?.project?.id || "",
				...newFilterListObject,
			});
		}
	}, [filterList, dashboardData]);

	let { changePage, count, queryData, queryLoading, countQueryLoading } = pagination({
		countQuery: GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
		countFilter: queryFilter,
		query: GET_FUND_RECEIPT_PROJECT_LIST,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData && dashboardData?.project),
	});

	return (
		<FundReceivedTableContainer
			fundReceiptList={queryData?.fundReceiptProjectList || []}
			loading={queryLoading || countQueryLoading}
			changePage={changePage}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			removeFilterListElements={removeFilterListElements}
			filterList={filterList}
			setFilterList={setFilterList}
			inputFields={fundReceiptInputFields}
			donorHash={donorHash}
		/>
	);
}

export default FundReceivedTableGraphql;
