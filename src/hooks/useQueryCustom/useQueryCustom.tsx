import React, { useEffect } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/client";

function UseQueryCustom<T>({ query, variables }: { query: any; variables: any }) {
	const apolloClient = useApolloClient();

	let [getQueryData, { data, loading, error }] = useLazyQuery(query, { variables });

	let cachedQueryData: T | null = null;
	try {
		cachedQueryData = apolloClient.readQuery<T>({
			query,
      variables,
		});
	} catch (error) {}

	useEffect(() => {
		if (!cachedQueryData) {
			getQueryData();
		}
	}, [cachedQueryData]);

	return {
		data: cachedQueryData ? cachedQueryData : data,
		error,
		loading,
	};
}

export default UseQueryCustom;
