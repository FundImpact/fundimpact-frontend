import { useLazyQuery } from "@apollo/client";
import { GET_USER_ROLES } from "../../graphql/User/query";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/userContext";
import { IGetUserRole } from "../../models/access/query";

const getCustomFrontendUserHash = () => ({
	"setting-find": {
		id: "123123",
		controller: "setting",
		action: "find",
		enabled: true,
	},
});

const mapPermissionsControllerActionToPermission = (data: IGetUserRole) => {
	let userRoleHashObject: {
		[key: string]: { id: string; controller: string; action: string; enabled: boolean };
	} = getCustomFrontendUserHash();
	data.getRolePemissions.forEach((permission) => {
		userRoleHashObject[permission.controller + "-" + permission.action] = { ...permission };
	});
	return userRoleHashObject;
};

function UserRoles() {
	const user = useAuth();
	const [getUserRoles, { loading, error }] = useLazyQuery<IGetUserRole>(GET_USER_ROLES, {
		onCompleted: (data) => {
			let userRoleHashTempObject: {
				[key: string]: { id: string; controller: string; action: string; enabled: boolean };
			} = mapPermissionsControllerActionToPermission(data);

			setUserRoleHash({ ...userRoleHashTempObject });
		},
	});
	// console.log('error :>> ', error);
	const [userRoleHash, setUserRoleHash] = useState<{
		[key: string]: { id: string; controller: string; action: string; enabled: boolean };
	}>({});
	// console.log("userRoleHash :>> ", userRoleHash);
	useEffect(() => {
		if (user) {
			getUserRoles({
				variables: {
					filter: {
						role: user.user?.role?.id,
					},
				},
			});
		}
	}, [user, getUserRoles]);
	// console.log("useRoleHash", userRoleHash);

	return { data: userRoleHash, loading, error };
}

export default UserRoles;
