import React, { useState, useCallback } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/client";

function UseLazyQueryCustom<T>({ query }: { query: any }) {
	const apolloClient = useApolloClient();

	let [getQueryData, { data, loading, error }] = useLazyQuery(query);
	const [cachedData, setCachedData] = useState<T | null>(null);
	const fetchData = useCallback(
		(variables = {}) => {
			let cachedQueryData: T | null = null;
			try {
				cachedQueryData = apolloClient.readQuery<T>({
					query,
					variables,
				});
			} catch (err) {}

			setCachedData(cachedQueryData);

			if (!cachedQueryData) {
				getQueryData({ variables });
			}
		},
		[query, getQueryData, setCachedData, apolloClient]
	);

	return {
		data: cachedData ? cachedData : data,
		error,
		loading,
		fetchData,
	};
}

export default UseLazyQueryCustom;
