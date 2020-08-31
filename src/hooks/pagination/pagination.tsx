import React, { useState, useEffect } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/client";

function getStartValue(startingValue: number, limit: number, prev: boolean): number {
	if (!prev) {
		return startingValue;
	}

	if (startingValue % limit == 0) {
		return startingValue - 2 * limit < 0 ? 0 : startingValue - 2 * limit;
	}

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
}: {
	limit?: number;
	start?: number;
	sort: string;
	query: any;
	queryFilter: any;
	countQuery: any;
	countFilter: any;
	fireRequest?: boolean;
}) {
	const startingValue = React.useRef<number>(start);
	const count = React.useRef<number>(0);
	const apolloClient = useApolloClient();

	const [error, setError] = useState<null | string>(null);
	const [oldCache, setOldCache] = useState(null);

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
		{ data: queryData, loading: queryLoading, error: queryError },
	] = useLazyQuery(query);

	useEffect(() => {
		if (fireRequest) {
			getRequestedDataLength();
		}
	}, [fireRequest]);

	useEffect(() => {
		if (countData) {
			startingValue.current = start;
			count.current = Object.values(countData)[0] as number;
			ChangePage();
		}
	}, [countData]);

	function ChangePage(prev: boolean = false) {
		if (countQueryLoading) {
			return;
		}

		if (!prev && startingValue.current > count.current) {
			setError("Start Cannot Be More Than Count");
			return;
		}

		if (prev && startingValue.current == 0) {
			setError("Start Cannot Be Zero When Going Previous");
			return;
		}

		let correctStartingValue = getStartValue(startingValue.current, limit, prev);

		let currentLimit =
			correctStartingValue + limit > count.current
				? count.current - correctStartingValue
				: limit;

		let oldCacheQueryData: any = null;
		try {
			oldCacheQueryData = apolloClient.readQuery({
				query,
				variables: {
					filter: queryFilter,
					limit: currentLimit,
					start: correctStartingValue,
					sort,
				},
			});
		} catch (err) {}

		setOldCache(oldCacheQueryData);

		if (!oldCacheQueryData) {
			getQueryData({
				variables: {
					filter: queryFilter,
					limit: currentLimit,
					start: correctStartingValue,
					sort,
				},
			});
		}

		startingValue.current =
			correctStartingValue + currentLimit > count.current
				? count.current
				: correctStartingValue + currentLimit;
	}

	return {
		count: count.current,
		changePage: ChangePage,
		queryData: oldCache ? oldCache : queryData,
		error,
		queryLoading,
		countQueryLoading,
		countQueryError,
		queryError,
		end: !countQueryLoading && startingValue.current >= count.current ? true : false,
	};
}

export default Pagination;
