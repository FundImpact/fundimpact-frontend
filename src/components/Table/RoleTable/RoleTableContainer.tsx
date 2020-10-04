import React, { useState } from "react";
import RoleTableView from "./RoleTableView";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { USER_PERMISSIONS_ACTIONS } from "../../../utils/access/modules/userPermissions/actions";

function RoleTableContainer({
	userRoles,
	loading,
}: {
	loading: boolean;
	userRoles: { id: string; name: string; type: string }[];
}) {
	const [page, setPage] = useState(0);

	// const userRoleEditAccess = userHasAccess(
	// 	MODULE_CODES.USER_PERMISSIONS,
	// 	USER_PERMISSIONS_ACTIONS.UPDATE_USER_PERMISSIONS
	// );

	return (
		<RoleTableView
			userRoles={userRoles}
			userRoleEditAccess={true}
			loading={loading}
		/>
	);
}

export default RoleTableContainer;
