import React, { useState, useEffect } from "react";
import AddRoleFormContainer from "./AddRoleFormContainer";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
	CREATE_ORGANIZATION_USER_ROLE,
	UPDATE_ORGANIZATION_USER_ROLE,
} from "../../../graphql/AddRole/mutation";
import {
	ICreateOrganizationUserRole,
	ICreateOrganizationUserRoleVariables,
	IUpdateOrganizationUserRoleVariables,
	IUpdateOrganizationUserRole,
} from "../../../models/AddRole/mutation";
import { useLocation } from "react-router-dom";
import { FORM_ACTIONS } from "../../../models/constants";
import { IGetUserRole } from "../../../models/access/query";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { useAuth } from "../../../contexts/userContext";

function AddRoleFormGraphql({ open, handleClose }: { open: boolean; handleClose: () => void }) {
	const [createOrganizationUserRole, { loading: creatingRole }] = useMutation<
		ICreateOrganizationUserRole,
		ICreateOrganizationUserRoleVariables
	>(CREATE_ORGANIZATION_USER_ROLE);

	const [updateOrganizationUserRole, { loading: updatingRole }] = useMutation<
		IUpdateOrganizationUserRole,
		IUpdateOrganizationUserRoleVariables
	>(UPDATE_ORGANIZATION_USER_ROLE);

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
			roleCreationLoading={creatingRole || updatingRole}
			createOrganizationUserRole={createOrganizationUserRole}
			updateOrganizationUserRole={updateOrganizationUserRole}
			userRoleData={userRoleData}
			formType={FORM_ACTIONS.CREATE}
			open={open}
			handleClose={handleClose}
		/>
	);
}

export default AddRoleFormGraphql;
