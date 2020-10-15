import React, { useEffect, useState } from "react";
import RoleTableContainer from "./RoleTableContainer";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ROLES_BY_ORG } from "../../../graphql/UserRoles/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { IGetUserRole } from "../../../models/access/query";
import { UPDATE_ORGANIZATION_USER_ROLE } from "../../../graphql/AddRole/mutation";
import {
	IUpdateOrganizationUserRoleVariables,
	IUpdateOrganizationUserRole,
} from "../../../models/AddRole/mutation";

function RoleTableGraphql({ tableFilterList }: { tableFilterList?: { [key: string]: string } }) {
	const dashboardData = useDashBoardData();
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [rolesPermissions, setRolesPermissions] = useState<
		{ roleId: string; roleName: string; permissions: IGetUserRole["getRolePemissions"] }[]
	>([]);

	const [updateOrganizationUserRole, { loading: updatingRole }] = useMutation<
		IUpdateOrganizationUserRole,
		IUpdateOrganizationUserRoleVariables
	>(UPDATE_ORGANIZATION_USER_ROLE);

	// useEffect(() => {
	// 	let newFilterListObject: { [key: string]: string } = {};
	// 	for (let key in tableFilterList) {
	// 		if (tableFilterList[key] && tableFilterList[key].length) {
	// 			newFilterListObject[key] = tableFilterList[key];
	// 		}
	// 	}
	// }, [tableFilterList, dashboardData]);

	const [getUserRoles, { data: userRoles, loading: fetchingUserRoles }] = useLazyQuery<{
		organizationRoles: { id: string; name: string; type: string }[];
	}>(GET_ROLES_BY_ORG, {
		onCompleted: async (userRoles) => {
			getRolePermissions({
				variables: {
					filter: {
						role: userRoles.organizationRoles[0].id,
					},
				},
			});
		},
	});

	const [
		getRolePermissions,
		{ loading: fetchingRolePermissions, refetch: getAsyncRolesAndPermissions },
	] = useLazyQuery<IGetUserRole>(GET_USER_ROLES);

	let adminRoletype = `admin-org-${dashboardData?.organization?.id}`;

	useEffect(() => {
		if (getAsyncRolesAndPermissions && userRoles) {
			Promise.all(
				userRoles.organizationRoles
					.filter((role) => role.type != adminRoletype)
					.map((role) =>
						getAsyncRolesAndPermissions({ filter: { role: role.id } }).then(
							(response) => ({
								roleId: role.id,
								roleName: role.name,
								response,
							})
						)
					)
			).then((rolesPermissions) => {
				setRolesPermissions(
					rolesPermissions.map((rolePermissions) => {
						return {
							roleId: rolePermissions.roleId,
							roleName: rolePermissions.roleName,
							permissions: rolePermissions.response?.data?.getRolePemissions || [],
						};
					})
				);
			});
		}
	}, [getAsyncRolesAndPermissions, userRoles, setRolesPermissions]);

	useEffect(() => {
		if (dashboardData?.organization?.id) {
			getUserRoles({
				variables: {
					organization: dashboardData?.organization?.id,
				},
			});
		}
	}, [dashboardData]);

	// console.log('rolesPermissions	 :>> ', rolesPermissions	);

	return (
		<RoleTableContainer
			loading={fetchingUserRoles || fetchingRolePermissions}
			userRoles={
				userRoles?.organizationRoles.filter(
					(role: { type: string }) => role.type != adminRoletype
				) || []
			}
			count={100}
			changePage={(prev?: boolean) => {}}
			order={order}
			setOrder={setOrder}
			rolesPermissions={rolesPermissions}
			updateOrganizationUserRole={updateOrganizationUserRole}
			updatingRole={updatingRole}
		/>
	);
}

export default RoleTableGraphql;
