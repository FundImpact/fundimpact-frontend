import React, { useState, useEffect } from "react";
import AddRoleFormContainer from "./AddRoleFormContainer";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_ORGANIZATION_USER_ROLE } from "../../../graphql/AddRole/mutation";
import {
	ICreateOrganizationUserRole,
	ICreateOrganizationUserRoleVariables,
} from "../../../models/AddRole/mutation";
import { useLocation } from "react-router-dom";
import { FORM_ACTIONS } from "../../../models/constants";
import { IGetUserRole } from "../../../models/access/query";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { useAuth } from "../../../contexts/userContext";

function AddRoleFormGraphql() {
	const [createOrganizationUserRole, { loading }] = useMutation<
		ICreateOrganizationUserRole,
		ICreateOrganizationUserRoleVariables
	>(CREATE_ORGANIZATION_USER_ROLE);

	const user = useAuth();
	const location = useLocation();

	const [getUserRoles, { data: userRoleData }] = useLazyQuery<IGetUserRole>(GET_USER_ROLES);

	useEffect(() => {
		if (user) {
			getUserRoles({
				variables: {
					filter: {
						role: (location?.state as { role: string })?.role || user.user?.role?.id,
					},
				},
			});
		}
	}, [user, getUserRoles]);

	return (
		<AddRoleFormContainer
			roleCreationLoading={loading}
			createOrganizationUserRole={createOrganizationUserRole}
			userRoleData={userRoleData}
			formType={
				(location?.state as { role: string })?.role
					? FORM_ACTIONS.UPDATE
					: FORM_ACTIONS.CREATE
			}
		/>
	);
}

export default AddRoleFormGraphql;
