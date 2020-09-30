import React, { useCallback, useEffect, useState } from "react";
import AddRoleFormView from "./AddRoleFormView";
import { IAddRole, IControllerAction, IAddRolePermissions } from "../../../models/AddRole";
import { MutationFunctionOptions, FetchResult, useLazyQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { FormikState } from "formik";
import { GET_ROLES_BY_ORG } from "../../../graphql/UserRoles/query";
import {
	ICreateOrganizationUserRoleVariables,
	ICreateOrganizationUserRole,
} from "../../../models/AddRole/mutation";
import { useAuth } from "../../../contexts/userContext";
import { IGetUserRole } from "../../../models/access/query";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { MODULE_CODES } from "../../../utils/access";

const getInitialValues = (controllerActionHash: IControllerAction | {}): IAddRole => {
	let initialValues: IAddRole = {
		name: "",
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
			] = false;
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

const onFormSubmit = async ({
	valuesSubmitted,
	createOrganizationUserRole,
	organizationId,
	notificationDispatch,
	resetForm,
	controllerActionHash,
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
	resetForm?: (nextState?: Partial<FormikState<any>> | undefined) => void;
	controllerActionHash: IControllerAction | {};
}) => {
	const permissions = getSubmittedPermissions({ ...valuesSubmitted.permissions });
	try {
		await createOrganizationUserRole({
			variables: {
				id: organizationId,
				input: {
					name: valuesSubmitted.name,
					permissions: {
						application: {
							controllers: permissions,
						},
					},
				},
			},
			update: (store, { data }) => {
				try {
					if (data) {
						let { createOrganizationUserRole } = data;
						const userRoles = store.readQuery<{
							roles: { name: string; id: string }[];
						}>({
							query: GET_ROLES_BY_ORG,
							variables: {
								filter: {
									organization: organizationId,
								},
							},
						});
						store.writeQuery<{ roles: { name: string; id: string }[] }>({
							query: GET_ROLES_BY_ORG,
							variables: {
								filter: {
									organization: organizationId,
								},
							},
							data: {
								roles: [createOrganizationUserRole, ...(userRoles?.roles || [])],
							},
						});
					}
				} catch (err) {
					console.log("err :>> ", err);
				}
			},
		});

		resetForm && resetForm({ values: getInitialValues(controllerActionHash) });

		notificationDispatch(setSuccessNotification("Role Added Successfully"));
	} catch (err) {
		notificationDispatch(setErrorNotification("Error Occured While Adding Role"));
	}
};

const getControllerActionHash = (controllerActionArr: IGetUserRole["getRolePemissions"]) => {
	return controllerActionArr.reduce(
		(
			controllerActionHash: IControllerAction,
			current: IGetUserRole["getRolePemissions"][0]
		) => {
			if (!controllerActionHash[current.controller as MODULE_CODES]) {
				controllerActionHash[current.controller as MODULE_CODES] = {};
			}
			controllerActionHash[current.controller as MODULE_CODES][current.action] = {
				enabled: false,
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
}) {
	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	const user = useAuth();
	const [getUserRoles, { data: userRoleData, loading, error }] = useLazyQuery<IGetUserRole>(
		GET_USER_ROLES
	);
	const [controllerActionHash, setControllerActionHash] = useState<IControllerAction | {}>({});

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

	useEffect(() => {
		if (userRoleData) {
			setControllerActionHash(getControllerActionHash(userRoleData.getRolePemissions));
		}
	}, [userRoleData]);
	const onCreate = useCallback(
		(
			valuesSubmitted: IAddRole,
			{
				resetForm,
			}: { resetForm?: (nextState?: Partial<FormikState<any>> | undefined) => void }
		) =>
			onFormSubmit({
				valuesSubmitted,
				createOrganizationUserRole,
				organizationId: dashboardData?.organization?.id || "",
				notificationDispatch: notificationDispatch,
				controllerActionHash,
				resetForm,
			}),
		[createOrganizationUserRole, dashboardData, notificationDispatch, controllerActionHash]
	);

	return (
		<AddRoleFormView
			initialValues={getInitialValues(controllerActionHash)}
			validate={validate}
			onCreate={onCreate}
			roleCreationLoading={roleCreationLoading}
			controllerActionHash={controllerActionHash}
		/>
	);
}

export default AddRoleFormContainer;
