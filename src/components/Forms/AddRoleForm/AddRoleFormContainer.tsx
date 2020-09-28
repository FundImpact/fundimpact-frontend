import React, { useCallback } from "react";
import AddRoleFormView from "./AddRoleFormView";
import { IAddRole } from "../../../models/AddRole";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
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

const getInitialValues = (): IAddRole => {
	return {
		name: "",
	};
};

const validate = (values: IAddRole) => {
	let errors: Partial<IAddRole> = {};
	if (!values.name) {
		errors.name = "Role is required";
	}

	return errors;
};

const onFormSubmit = async ({
	valuesSubmitted,
	createOrganizationUserRole,
	organizationId,
	notificationDispatch,
	resetForm,
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
}) => {
	try {
		await createOrganizationUserRole({
			variables: {
				id: organizationId,
				input: {
					name: valuesSubmitted.name,
				},
			},
			update: async (store, { data }) => {
				try {
					const userRoles = await store.readQuery<{
						roles: { id: string; role: string }[];
					}>({
						query: GET_ROLES_BY_ORG,
						variables: {
							filter: {
								organization: organizationId,
							},
						},
					});

					if (data) {
						const createdUserRole = data.createOrganizationUserRole;

						store.writeQuery<{
							roles: { id: string; role: string }[];
						}>({
							query: GET_ROLES_BY_ORG,
							variables: {
								filter: {
									organization: organizationId,
								},
							},
							data: {
								roles: [createdUserRole, ...(userRoles?.roles || [])],
							},
						});
					}
				} catch (err) {
					console.log("err :>> ", err);
				}
			},
		});

		resetForm && resetForm({ values: getInitialValues() });

		notificationDispatch(setSuccessNotification("Role Added Successfully"));
	} catch (err) {
		notificationDispatch(setErrorNotification("Error Occured While Adding Role"));
	}
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
				resetForm,
			}),
		[createOrganizationUserRole]
	);

	return (
		<AddRoleFormView
			getInitialValues={getInitialValues}
			validate={validate}
			onCreate={onCreate}
			roleCreationLoading={roleCreationLoading}
		/>
	);
}

export default AddRoleFormContainer;
