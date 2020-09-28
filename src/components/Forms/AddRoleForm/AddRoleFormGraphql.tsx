import React, { useState, useEffect } from "react";
import AddRoleFormContainer from "./AddRoleFormContainer";
import { useMutation } from "@apollo/client";
import { CREATE_ORGANIZATION_USER_ROLE } from "../../../graphql/AddRole/mutation";
import {
	ICreateOrganizationUserRole,
	ICreateOrganizationUserRoleVariables,
} from "../../../models/AddRole/mutation";

function AddRoleFormGraphql() {
	const [createOrganizationUserRole, { loading }] = useMutation<
		ICreateOrganizationUserRole,
		ICreateOrganizationUserRoleVariables
	>(CREATE_ORGANIZATION_USER_ROLE);
	return (
		<AddRoleFormContainer
			roleCreationLoading={loading}
			createOrganizationUserRole={createOrganizationUserRole}
		/>
	);
}

export default AddRoleFormGraphql;
