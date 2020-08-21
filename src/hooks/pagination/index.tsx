import React from "react";
import { useQuery, useLazyQuery } from "@apollo/client";

export const usePagination = (
	dataFetchQuery: any,
	countQuery: any,
	dataFetchQueryFilter: any,
	countQueryFilter: any,
	limit: number
) => {
	let start = 0;
	const { data: count } = useQuery(countQuery, {
		variables: {
			filter: countQueryFilter,
		},
	});

	const [requestData, { data }] = useLazyQuery(dataFetchQuery);

	const nextRequest = () => {
		requestData({
			variables: {
				filter: {
					start,
					limit: start + limit > count ? count - start : limit,
					...dataFetchQueryFilter,
				},
			},
		});
		start = start + limit > count ? count : start + limit;
	};

	return [nextRequest, { count, data }];
};
