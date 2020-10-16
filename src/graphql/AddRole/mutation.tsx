import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION_USER_ROLE = gql`
	mutation createOrganizationUserRole($input: organizationUserRoleInput!) {
		createOrganizationUserRole(input: $input) {
			organization {
				id
				name
			}
		}
	}
`;

export const UPDATE_ORGANIZATION_USER_ROLE = gql`
	mutation updateOrganizationUserRole($id: ID!, $input: organizationUserRoleInput!) {
		updateOrganizationUserRole(id: $id, input: $input) {
			id
			name
			type
			organization {
				id
				name
			}
			permissions {
				id
				controller
				action
				enabled
			}
		}
	}
`;
