import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION_USER_ROLE = gql`
	mutation createOrganizationUserRole($input: organizationUserRoleInput!) {
		createOrganizationUserRole(input: $input) {
			id
			name
		}
	}
`;
