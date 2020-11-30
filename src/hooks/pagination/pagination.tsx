import React, { useState, useEffect, useCallback } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/client";
import { getValueFromObject } from "../../utils";

function getStartValue(startingValue: number, limit: number, prev: boolean): number {
	if (!prev) {
		return startingValue;
	}

	//at the end of the pagination the number of elements left might not be equal to the
	//value of limit provided bu the user that is why we are checking starting value is divisible
	//by the limit we are shifting the stating value by 2*limit due to following reason.
	//let us conside we have 3 starting value 0, 10, 20 and we are at 20 , user has seen value from
	//10 to 20 but we have to show value 0 t0 10 that is why we subtarct 2*limit from starting value
	if (startingValue % limit === 0) {
		return startingValue - 2 * limit < 0 ? 0 : startingValue - 2 * limit;
	}

	//staring value is not divisible by limit so we are shifting by the number of elements at the
	//end and the value of limit
	return startingValue - limit - +(startingValue % limit);
}

function Pagination({
	limit = 10,
	start = 0,
	sort,
	query,
	queryFilter,
	countQuery,
	countFilter,
	fireRequest = true,
	retrieveContFromCountQueryResponse = "",
}: {
	limit?: number;
	start?: number;
	sort: string;
	query: any;
	queryFilter: any;
	countQuery: any;
	countFilter: any;
	fireRequest?: boolean;
	retrieveContFromCountQueryResponse?: string;
}) {
	const startingValue = React.useRef<number>(start);
	const count = React.useRef<number>(0);
	const apolloClient = useApolloClient();

	const [error, setError] = useState<null | string>(null);

	let [
		getRequestedDataLength,
		{ data: countData, loading: countQueryLoading, error: countQueryError },
	] = useLazyQuery(countQuery, {
		variables: {
			filter: countFilter,
		},
	});

	let [
		getQueryData,
		{ data: queryData, loading: queryLoading, error: queryError, refetch: queryRefetch },
	] = useLazyQuery(query, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		if (fireRequest) {
			getRequestedDataLength();
		}
	}, [fireRequest, getRequestedDataLength]);

	const changePage = useCallback(
		(prev: boolean = false) => {
			if (countQueryLoading) {
				return;
			}

			if (!prev && startingValue.current > count.current) {
				setError("Start Cannot Be More Than Count");
				return;
			}

			if (prev && startingValue.current === 0) {
				setError("Start Cannot Be Zero When Going Previous");
				return;
			}

			let correctStartingValue = getStartValue(startingValue.current, limit, prev);

			let currentLimit =
				correctStartingValue + limit > count.current
					? count.current - correctStartingValue
					: limit;

			getQueryData({
				variables: {
					filter: queryFilter,
					limit: currentLimit,
					start: correctStartingValue,
					sort,
				},
			});

			startingValue.current =
				correctStartingValue + currentLimit > count.current
					? count.current
					: correctStartingValue + currentLimit;
		},
		[apolloClient, countQueryLoading, getQueryData, limit, query, queryFilter, sort]
	);

	useEffect(() => {
		if (countData) {
			startingValue.current = start;
			count.current =
				(retrieveContFromCountQueryResponse &&
					getValueFromObject(countData, retrieveContFromCountQueryResponse.split(","))) ||
				(Object.values(countData)[0] as number);
			changePage();
		}
	}, [countData, sort, start, changePage]);

	return {
		count: count.current,
		changePage,
		queryData: queryData,
		error,
		queryLoading: !queryData && queryLoading,
		countQueryLoading,
		countQueryError,
		queryError,
		end: !countQueryLoading && startingValue.current >= count.current ? true : false,
		queryRefetch,
	};
}

export default Pagination;
