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
import { GET_ROLES_BY_ORG } from "../../../graphql/UserRoles/query";
import {
	ICreateOrganizationUserRoleVariables,
	ICreateOrganizationUserRole,
} from "../../../models/AddRole/mutation";
import { IGetUserRole } from "../../../models/access/query";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { MODULE_CODES } from "../../../utils/access";
import { FORM_ACTIONS } from "../constant";
import { useIntl } from "react-intl";
import FormDialog from "../../FormDialog";
import CommonForm from "../../CommonForm";
import { addRoleForm } from "./inputField.json";

const getInitialValues = (name: string, controllerActionHash: IControllerAction | {}): IAddRole => {
	let initialValues: IAddRole = {
		name,
		permissions: {},
		is_project_level: false,
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
//remove any
const createRole = async ({
	name,
	organizationId,
	permissions,
	createOrganizationUserRole,
	is_project_level,
}: {
	name: string;
	organizationId: string;
	permissions: any;
	createOrganizationUserRole: (
		options?: MutationFunctionOptions<ICreateOrganizationUserRole, any> | undefined
	) => Promise<
		FetchResult<ICreateOrganizationUserRole, Record<string, any>, Record<string, any>>
	>;
	is_project_level: boolean;
}) => {
	let uploadPermissions: any = { controllers: { upload: {} } };
	let usersPermissions: any = { controllers: {} };
	if ("upload" in permissions) {
		uploadPermissions.controllers.upload = permissions["upload"];
		delete permissions["upload"];
	}
	if ("userspermissions" in permissions) {
		usersPermissions.controllers.userspermissions = permissions["userspermissions"];
		delete permissions["userspermissions"];
	}
	if ("auth" in permissions) {
		usersPermissions.controllers.auth = permissions["auth"];
		delete permissions["auth"];
	}
	if ("user" in permissions) {
		usersPermissions.controllers.user = permissions["user"];
		delete permissions["user"];
	}
	await createOrganizationUserRole({
		variables: {
			id: organizationId,
			input: {
				name,
				permissions: {
					application: {
						controllers: permissions,
					},
					upload: uploadPermissions,
					"users-permissions": usersPermissions,
				},
				is_project_level,
			},
		},
		refetchQueries: [
			{
				query: GET_ROLES_BY_ORG,
				variables: {
					organization: organizationId,
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
}) => {
	const permissions = getSubmittedPermissions({ ...valuesSubmitted.permissions });
	try {
		formType == FORM_ACTIONS.CREATE &&
			(await createRole({
				name: valuesSubmitted.name,
				is_project_level: valuesSubmitted.is_project_level,
				createOrganizationUserRole,
				organizationId,
				permissions,
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
	open,
	handleClose,
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
	open: boolean;
	handleClose: () => void;
}) {
	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	const [controllerActionHash, setControllerActionHash] = useState<IControllerAction | {}>({});
	const intl = useIntl();
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
				formType,
			});
			handleClose();
		},
		[createOrganizationUserRole, dashboardData, notificationDispatch, formType, handleClose]
	);

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={roleCreationLoading}
			title={intl.formatMessage({
				id: "addRole",
				defaultMessage: "Add Role",
				description: `This text will be show when user want to add role`,
			})}
			subtitle=""
			workspace={""}
			project={""}
		>
			<CommonForm
				initialValues={getInitialValues("", controllerActionHash)}
				validate={validate}
				onCreate={onCreate}
				onCancel={handleClose}
				inputFields={addRoleForm}
				formAction={FORM_ACTIONS.CREATE}
				onUpdate={() => {}}
			/>
		</FormDialog>
	);
}

export default AddRoleFormContainer;
