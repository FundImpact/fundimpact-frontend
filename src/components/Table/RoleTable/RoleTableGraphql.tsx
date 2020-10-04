import React, { useEffect, useState } from "react";
import RoleTableContainer from "./RoleTableContainer";
import { useLazyQuery } from "@apollo/client";
import { GET_ROLES_BY_ORG, ORGANIZATION_ROLES_COUNT } from "../../../graphql/UserRoles/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import pagination from "../../../hooks/pagination";

function RoleTableGraphql({ tableFilterList }: { tableFilterList?: { [key: string]: string } }) {
	const dashboardData = useDashBoardData();
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [queryFilter, setQueryFilter] = useState({});

	useEffect(() => {
		let newFilterListObject: { [key: string]: string } = {};
		for (let key in tableFilterList) {
			if (tableFilterList[key] && tableFilterList[key].length) {
				newFilterListObject[key] = tableFilterList[key];
			}
		}
		setQueryFilter({
			organization: dashboardData?.organization?.id,
			...newFilterListObject,
		});
	}, [tableFilterList, dashboardData]);

	let { count, queryData: userRoles, changePage, queryLoading, countQueryLoading } = pagination({
		query: GET_ROLES_BY_ORG,
		countQuery: ORGANIZATION_ROLES_COUNT,
		countFilter: {},
		queryFilter,
		sort: `name:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData),
		retrieveContFromCountQueryResponse: "organizationRolesCount,count",
	});

	return (
		<RoleTableContainer
			loading={queryLoading || countQueryLoading}
			userRoles={userRoles?.organizationRoles || []}
			count={count}
			changePage={changePage}
			order={order}
			setOrder={setOrder}
		/>
	);
}

export default RoleTableGraphql;
