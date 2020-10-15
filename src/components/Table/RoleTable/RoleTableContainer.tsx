import React, { useState, useEffect } from "react";
import RoleTableView from "./RoleTableView";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { USER_PERMISSIONS_ACTIONS } from "../../../utils/access/modules/userPermissions/actions";
import { IControllerAction, IAddRolePermissions } from "../../../models/AddRole";
import { IGetUserRole } from "../../../models/access/query";
import {
	IUpdateOrganizationUserRole,
	IUpdateOrganizationUserRoleVariables,
} from "../../../models/AddRole/mutation";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { GET_ROLES_BY_ORG } from "../../../graphql/UserRoles/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";

const getControllerActionHashArr = (
	rolesPermissions: {
		roleId: string;
		roleName: string;
		permissions: IGetUserRole["getRolePemissions"];
	}[]
) =>
	rolesPermissions.map((rolePermissions) => ({
		roleId: rolePermissions.roleId,
		roleName: rolePermissions.roleName,
		controllerActionHash: rolePermissions.permissions.reduce(
			(
				controllerActionHash: IControllerAction,
				current: IGetUserRole["getRolePemissions"][0]
			) => {
				if (!controllerActionHash[current.controller as MODULE_CODES]) {
					controllerActionHash[current.controller as MODULE_CODES] = {};
				}
				controllerActionHash[current.controller as MODULE_CODES][current.action] = {
					enabled: current.enabled,
					policy: "",
				};
				return controllerActionHash;
			},
			{} as IControllerAction
		),
	}));

//check type and remove admin type
const onUpdate = async ({
	valuesSubmitted,
	updateOrganizationUserRole,
	notificationDispatch,
	numeberOfTimesRolesChanged,
}: {
	valuesSubmitted: { [key: string]: { name: string; permissions: {} | IControllerAction } };
	updateOrganizationUserRole: (
		options?:
			| MutationFunctionOptions<
					IUpdateOrganizationUserRole,
					IUpdateOrganizationUserRoleVariables
			  >
			| undefined
	) => Promise<
		FetchResult<IUpdateOrganizationUserRole, Record<string, any>, Record<string, any>>
	>;
	notificationDispatch: React.Dispatch<any>;
	numeberOfTimesRolesChanged: {
		[key: string]: number;
	};
}) => {
	for (let roleId in valuesSubmitted) {
		if (roleId in numeberOfTimesRolesChanged && numeberOfTimesRolesChanged[roleId] == 0) {
			continue;
		}
		try {
			await updateOrganizationUserRole({
				variables: {
					id: roleId,
					input: {
						name: valuesSubmitted[roleId].name,
						permissions: {
							application: { controllers: valuesSubmitted[roleId].permissions },
						},
					},
				},
			});
			notificationDispatch(setSuccessNotification(`${valuesSubmitted[roleId].name} updated`));
		} catch (err) {
			notificationDispatch(
				setErrorNotification(`${err.message} for role ${valuesSubmitted[roleId].name}`)
			);
		}
	}
};

const getActionObject = (action: {
	enabled: boolean;
	policy: "";
}): { enabled: boolean; policy: "" } => ({
	enabled: action.enabled,
	policy: "",
});

const getControllerObject = (controllerObject: {
	[key: string]: { enabled: boolean; policy: "" };
}) => {
	let newControllerObject: { [key: string]: { enabled: boolean; policy: "" } } = {};

	Object.keys(controllerObject).forEach((actionName) => {
		newControllerObject[actionName] = getActionObject(controllerObject[actionName]);
	});
	return newControllerObject;
};

const getRoleNameAndPermissionsObj = (
	roleName: string,
	controllerActionHash: IControllerAction
) => {
	let roleNameAndPermissionsObj: { name: string; permissions: IControllerAction | {} } = {
		name: roleName,
		permissions: {},
	};

	Object.keys(controllerActionHash).forEach((controllerName) => {
		(roleNameAndPermissionsObj.permissions as IControllerAction)[
			controllerName as MODULE_CODES
		] = getControllerObject(controllerActionHash[controllerName as MODULE_CODES]);
	});
	return roleNameAndPermissionsObj;
};

const getInitialValues = (
	controllerActionHashArr: {
		roleId: string;
		roleName: string;
		controllerActionHash: IControllerAction;
	}[]
) => {
	const initialValues: {
		[key: string]: { name: string; permissions: IControllerAction | {} };
	} = {};
	
	controllerActionHashArr.forEach((controllerActionHashContainer) => {
		initialValues[controllerActionHashContainer.roleId] = getRoleNameAndPermissionsObj(
			controllerActionHashContainer.roleName,
			controllerActionHashContainer.controllerActionHash
		);
	});
	return initialValues;
};

function RoleTableContainer({
	userRoles,
	loading,
	count,
	changePage,
	order,
	setOrder,
	rolesPermissions,
	updateOrganizationUserRole,
	updatingRole,
}: {
	loading: boolean;
	userRoles: { id: string; name: string; type: string }[];
	count: number;
	changePage: (prev?: boolean) => void;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	rolesPermissions: {
		roleName: string;
		roleId: string;
		permissions: IGetUserRole["getRolePemissions"];
	}[];
	updateOrganizationUserRole: (
		options?:
			| MutationFunctionOptions<
					IUpdateOrganizationUserRole,
					IUpdateOrganizationUserRoleVariables
			  >
			| undefined
	) => Promise<
		FetchResult<IUpdateOrganizationUserRole, Record<string, any>, Record<string, any>>
	>;
	updatingRole: boolean;
}) {
	const [page, setPage] = useState(0);
	const [controllerActionHashArr, setControllerActionHashArr] = useState<
		{ roleId: string; roleName: string; controllerActionHash: IControllerAction }[]
	>([]);
	const notificationDispatch = useNotificationDispatch();

	useEffect(() => {
		setControllerActionHashArr(getControllerActionHashArr(rolesPermissions));
	}, [rolesPermissions]);

	const userRoleEditAccess = userHasAccess(
		MODULE_CODES.USER_PERMISSIONS,
		USER_PERMISSIONS_ACTIONS.UPDATE_USER_PERMISSIONS
	);

	const onFormSubmit = async(
		valuesSubmitted: {
			[key: string]: { name: string; permissions: IControllerAction | {} };
		},
		numeberOfTimesRolesChanged: {
			[key: string]: number;
		}
	) => {
		await onUpdate({
			valuesSubmitted,
			updateOrganizationUserRole,
			notificationDispatch,
			numeberOfTimesRolesChanged,
		});
	};

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
			controllerActionHashArr={controllerActionHashArr}
			onUpdate={onFormSubmit}
			initialValues={getInitialValues(controllerActionHashArr)}
			updatingRole={updatingRole}
		/>
	);
}

export default RoleTableContainer;
