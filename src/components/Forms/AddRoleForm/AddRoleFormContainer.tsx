import React, { useCallback, useEffect, useState } from "react";
import AddRoleFormView from "./AddRoleFormView";
import { IAddRole, IControllerAction, IAddRolePermissions } from "../../../models/AddRole";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { GET_ROLES_BY_ORG, ORGANIZATION_ROLES_COUNT } from "../../../graphql/UserRoles/query";
import {
	ICreateOrganizationUserRoleVariables,
	ICreateOrganizationUserRole,
	IUpdateOrganizationUserRoleVariables,
	IUpdateOrganizationUserRole,
} from "../../../models/AddRole/mutation";
import { IGetUserRole } from "../../../models/access/query";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { MODULE_CODES } from "../../../utils/access";
import { useLocation, Navigate } from "react-router-dom";
import { FORM_ACTIONS } from "../constant";

const getInitialValues = (name: string, controllerActionHash: IControllerAction | {}): IAddRole => {
	let initialValues: IAddRole = {
		name,
		permissions: {},
	};
	for (let controller in controllerActionHash) {
		for (let action in (controllerActionHash as IControllerAction)[
			controller as MODULE_CODES
		]) {
			if (!initialValues.permissions.hasOwnProperty(controller)) {
				(initialValues.permissions as IAddRolePermissions)[controller as MODULE_CODES] = {};
			}
			(initialValues.permissions as IAddRolePermissions)[controller as MODULE_CODES][
				action
			] = (controllerActionHash as IControllerAction)[controller as MODULE_CODES][
				action
			].enabled;
		}
	}
	return initialValues;
};

const validate = (values: IAddRole) => {
	let errors: Partial<IAddRole> = {};
	if (!values.name) {
		errors.name = "Role is required";
	}

	return errors;
};

const getSubmittedPermissions = (permissions: {} | IAddRolePermissions): IControllerAction | {} => {
	const currentPermissions: IControllerAction | {} = {};

	for (let controller in permissions) {
		for (let action in (permissions as IAddRolePermissions)[controller as MODULE_CODES]) {
			if (!(controller in currentPermissions)) {
				(currentPermissions as IControllerAction)[controller as MODULE_CODES] = {};
			}
			(currentPermissions as IControllerAction)[controller as MODULE_CODES][action] = {
				enabled: (permissions as IAddRolePermissions)[controller as MODULE_CODES][action],
				policy: "",
			};
		}
	}
	return currentPermissions;
};

const createRole = async ({
	name,
	organizationId,
	permissions,
	createOrganizationUserRole,
}: {
	name: string;
	organizationId: string;
	permissions: {} | IControllerAction;
	createOrganizationUserRole: (
		options?:
			| MutationFunctionOptions<
					ICreateOrganizationUserRole,
					ICreateOrganizationUserRoleVariables
			  >
			| undefined
	) => Promise<
		FetchResult<ICreateOrganizationUserRole, Record<string, any>, Record<string, any>>
	>;
}) => {
	await createOrganizationUserRole({
		variables: {
			id: organizationId,
			input: {
				name,
				permissions: {
					application: {
						controllers: permissions,
					},
				},
			},
		},
		update: async (store, { data }) => {
			if (!data) {
				return;
			}
			try {
				let { createOrganizationUserRole } = data;
				const userRoles = store.readQuery<{
					organizationRoles: { name: string; id: string }[];
				}>({
					query: GET_ROLES_BY_ORG,
					variables: {
						filter: {
							organization: organizationId,
						},
					},
				});
				store.writeQuery<{ organizationRoles: { name: string; id: string }[] }>({
					query: GET_ROLES_BY_ORG,
					variables: {
						filter: {
							organization: organizationId,
						},
					},
					data: {
						organizationRoles: [
							createOrganizationUserRole,
							...(userRoles?.organizationRoles || []),
						],
					},
				});
			} catch (err) {
				console.log("err :>> ", err);
			}
			try {
				const count = await store.readQuery<{ organizationRolesCount: { count: number } }>({
					query: ORGANIZATION_ROLES_COUNT,
					variables: {
						filter: {},
					},
				});

				store.writeQuery<{ organizationRolesCount: { count: number } }>({
					query: ORGANIZATION_ROLES_COUNT,
					variables: {
						filter: {},
					},
					data: {
						organizationRolesCount: {
							count: (count && count.organizationRolesCount.count + 1) || 0,
						},
					},
				});

				let limit = 0;
				if (count) {
					limit = count.organizationRolesCount.count;
				}

				const dataRead = await store.readQuery<{
					organizationRoles: { id: string; name: string }[];
				}>({
					query: GET_ROLES_BY_ORG,
					variables: {
						filter: {
							organization: organizationId,
						},
						limit: limit > 10 ? 10 : limit,
						start: 0,
						sort: "name:ASC",
					},
				});

				let userRoles: {
					id: string;
					name: string;
				}[] = dataRead?.organizationRoles || [];

				store.writeQuery<{
					organizationRoles: { id: string; name: string }[];
				}>({
					query: GET_ROLES_BY_ORG,
					variables: {
						filter: {
							organization: organizationId,
						},
						limit: limit > 10 ? 10 : limit,
						start: 0,
						sort: "name:ASC",
					},
					data: {
						organizationRoles: [data.createOrganizationUserRole, ...userRoles],
					},
				});
			} catch (err) {
				console.log("err :>> ", err);
			}
		},
	});
};

const updateRole = async ({
	name,
	permissions,
	updateOrganizationUserRole,
	roleId,
}: {
	name: string;
	permissions: {} | IControllerAction;
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
	roleId: string;
}) => {
	await updateOrganizationUserRole({
		variables: {
			id: roleId,
			input: {
				name,
				permissions: {
					application: {
						controllers: permissions,
					},
				},
			},
		},
		refetchQueries: [
			{
				query: GET_USER_ROLES,
				variables: {
					filter: {
						role: roleId,
					},
				},
			},
		],
	});
};

const onFormSubmit = async ({
	valuesSubmitted,
	createOrganizationUserRole,
	organizationId,
	notificationDispatch,
	formType,
	updateOrganizationUserRole,
	roleId,
}: {
	valuesSubmitted: IAddRole;
	createOrganizationUserRole: (
		options?:
			| MutationFunctionOptions<
					ICreateOrganizationUserRole,
					ICreateOrganizationUserRoleVariables
			  >
			| undefined
	) => Promise<
		FetchResult<ICreateOrganizationUserRole, Record<string, any>, Record<string, any>>
	>;
	organizationId: string;
	notificationDispatch: React.Dispatch<any>;
	formType: FORM_ACTIONS;
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
	roleId: string;
}) => {
	const permissions = getSubmittedPermissions({ ...valuesSubmitted.permissions });
	try {
		formType == FORM_ACTIONS.CREATE &&
			(await createRole({
				name: valuesSubmitted.name,
				createOrganizationUserRole,
				organizationId,
				permissions,
			}));

		formType == FORM_ACTIONS.UPDATE &&
			(await updateRole({
				name: valuesSubmitted.name,
				updateOrganizationUserRole,
				permissions,
				roleId,
			}));

		notificationDispatch(
			setSuccessNotification(
				`Role ${formType == FORM_ACTIONS.CREATE ? "Created" : "Updated"} Successfully`
			)
		);
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
};

const getControllerActionHash = (
	controllerActionArr: IGetUserRole["getRolePemissions"],
	formType: FORM_ACTIONS
) => {
	return controllerActionArr.reduce(
		(
			controllerActionHash: IControllerAction,
			current: IGetUserRole["getRolePemissions"][0]
		) => {
			if (!controllerActionHash[current.controller as MODULE_CODES]) {
				controllerActionHash[current.controller as MODULE_CODES] = {};
			}
			controllerActionHash[current.controller as MODULE_CODES][current.action] = {
				enabled: formType == FORM_ACTIONS.CREATE ? false : current.enabled,
				policy: "",
			};
			return controllerActionHash;
		},
		{} as IControllerAction
	);
};

function AddRoleFormContainer({
	createOrganizationUserRole,
	roleCreationLoading,
	formType,
	userRoleData,
	updateOrganizationUserRole,
}: {
	roleCreationLoading: boolean;
	createOrganizationUserRole: (
		options?:
			| MutationFunctionOptions<
					ICreateOrganizationUserRole,
					ICreateOrganizationUserRoleVariables
			  >
			| undefined
	) => Promise<
		FetchResult<ICreateOrganizationUserRole, Record<string, any>, Record<string, any>>
	>;
	formType: FORM_ACTIONS;
	userRoleData?: IGetUserRole;
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
}) {
	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	const [controllerActionHash, setControllerActionHash] = useState<IControllerAction | {}>({});
	const [redirect, setRedirect] = useState<boolean>(false);
	const location = useLocation();
	const roleId = (location?.state as { role: string; name: string })?.role;
	const roleName = (location?.state as { role: string; name: string })?.name;
	useEffect(() => {
		if (userRoleData) {
			setControllerActionHash(
				getControllerActionHash(userRoleData.getRolePemissions, formType)
			);
		}
	}, [userRoleData]);
	const onCreate = useCallback(
		async (valuesSubmitted: IAddRole) => {
			await onFormSubmit({
				valuesSubmitted,
				createOrganizationUserRole,
				organizationId: dashboardData?.organization?.id || "",
				notificationDispatch: notificationDispatch,
				updateOrganizationUserRole,
				formType,
				roleId,
			});
			setRedirect(true);
		},
		[
			createOrganizationUserRole,
			updateOrganizationUserRole,
			dashboardData,
			notificationDispatch,
			setRedirect,
			formType,
		]
	);

	if (redirect) {
		return <Navigate to="/settings/user_roles" />;
	}

	return (
		<AddRoleFormView
			initialValues={getInitialValues(roleName || "", controllerActionHash)}
			validate={validate}
			onCreate={onCreate}
			roleCreationLoading={roleCreationLoading}
			controllerActionHash={controllerActionHash}
			formType={formType}
			onCancel={() => {
				setRedirect(true);
			}}
		/>
	);
}

export default AddRoleFormContainer;
