import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

function Pagination({
	limit = 10,
	start = 0,
	sort,
	query,
	queryFilter,
	countQuery,
	countFilter,
}: {
	limit: number;
	start: number;
	sort: string;
	query: any;
	queryFilter: any;
	countQuery: any;
	countFilter: any;
}) {
	const [startingValue, setStartingValue] = useState<number>(start);
	const [error, setError] = useState<null | string>(null);
	let [
		getRequestedDataLength,
		{ data: count, loading: countQueryLoading, error: countQueryError },
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
		getRequestedDataLength();
	}, []);

	function Next() {
		if (countQueryLoading) {
			return;
		}

		if (startingValue >= count) {
			setError("Start Cannot Be More Than Count");
			return;
		}
		getQueryData({
			variables: {
				filter: queryFilter,
				limit: startingValue + limit > count ? count - startingValue : limit,
				start: startingValue,
				sort,
			},
		});

		setStartingValue((startingValue) => {
			return startingValue + limit > count ? count : startingValue + limit;
		});
	}

	function reinitializeState() {
		setStartingValue(0);
		setError(null);
	}

	return {
		count,
		next: Next,
		queryData,
		error,
		queryLoading,
		countQueryLoading,
		countQueryError,
		queryError,
		end: !countQueryLoading && startingValue >= count ? true : false,
		reinitializeState,
	};
}

export default Pagination;
