import React from "react";
import RoleTableView from "./RoleTableView";

function RoleTableContainer({
	userRoles,
}: {
	userRoles: { id: string; name: string; type: string }[];
}) {
	return <RoleTableView userRoles={userRoles} />;
}

export default RoleTableContainer;
