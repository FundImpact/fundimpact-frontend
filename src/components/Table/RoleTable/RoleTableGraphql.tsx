import React, { useEffect } from "react";
import RoleTableContainer from "./RoleTableContainer";
import { useLazyQuery } from "@apollo/client";
import { GET_ROLES_BY_ORG } from "../../../graphql/UserRoles/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";

function RoleTableGraphql() {
	const dashboardData = useDashBoardData();
	const [getRoles, { data: userRoles, loading }] = useLazyQuery(GET_ROLES_BY_ORG);
	console.log("data :>> ", userRoles);
	useEffect(() => {
		if (dashboardData) {
			getRoles({
				variables: {
					filter: { organization: dashboardData?.organization?.id },
				},
			});
		}
	}, [dashboardData]);

	return <RoleTableContainer userRoles={userRoles?.organizationRoles || []} />;
}

export default RoleTableGraphql;
