import { useLazyQuery } from "@apollo/client";
import { GET_USER_ROLES } from "../../graphql/User/query";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/userContext";
import { IGetUserRole } from "../../models/access/query";

const mapPermissionsControllerActionToPermission = (data: IGetUserRole) => {
	let userRoleHashObject: {
		[key: string]: { id: string; controller: string; action: string };
	} = {};
	data.role.permissions.forEach((permission) => {
		userRoleHashObject[permission.controller + "-" + permission.action] = { ...permission };
	});
	userRoleHashObject["setting-find"] = { id: "123123", controller: "setting", action: "find" };
	return userRoleHashObject;
};

function UserRoles() {
	const user = useAuth();
	const [getUserRoles, { data, loading, error }] = useLazyQuery<IGetUserRole>(GET_USER_ROLES);
	const [userRoleHash, setUserRoleHash] = useState<{
		[key: string]: { id: string; controller: string; action: string };
	}>({});

	useEffect(() => {
		if (user) {
			getUserRoles({
				variables: {
					id: user.user?.role?.id,
				},
			});
		}
	}, [user, getUserRoles]);

	useEffect(() => {
		if (data) {
			let userRoleHashTempObject: {
				[key: string]: { id: string; controller: string; action: string };
			} = mapPermissionsControllerActionToPermission(data);

			setUserRoleHash({ ...userRoleHashTempObject });
		}
	}, [data, setUserRoleHash]);

	return { data: userRoleHash, loading, error };
}

export default UserRoles;
