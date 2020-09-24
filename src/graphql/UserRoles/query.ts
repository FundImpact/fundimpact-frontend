import { gql } from "@apollo/client";

export const GET_ROLES_BY_ORG = gql`
	query getRole($id: ID!) {
		role(id: $id) {
			id
			name
			organization {
				id
				name
			}
			permissions {
				id
				controller
				action
			}
		}
	}
`;
