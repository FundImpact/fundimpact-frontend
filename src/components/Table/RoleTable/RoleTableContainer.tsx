import React, { useState } from "react";
import RoleTableView from "./RoleTableView";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { USER_PERMISSIONS_ACTIONS } from "../../../utils/access/modules/userPermissions/actions";

function RoleTableContainer({
	userRoles,
	loading,
	count,
	changePage,
	order,
	setOrder,
}: {
	loading: boolean;
	userRoles: { id: string; name: string; type: string }[];
	count: number;
	changePage: (prev?: boolean) => void;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}) {
	const [page, setPage] = useState(0);

	// const userRoleEditAccess = userHasAccess(
	// 	MODULE_CODES.USER_PERMISSIONS,
	// 	USER_PERMISSIONS_ACTIONS.UPDATE_USER_PERMISSIONS
	// );

	return (
		<RoleTableView
			userRoles={userRoles}
			page={page}
			setPage={setPage}
			changePage={changePage}
			count={count}
			userRoleEditAccess={userRoleEditAccess}
			loading={loading}
			order={order}
			setOrder={setOrder}
		/>
	);
}

export default RoleTableContainer;
