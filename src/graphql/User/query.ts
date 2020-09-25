import { gql } from "@apollo/client";

export const GET_USER_ROLES = gql`
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
				enabled
			}
		}
	}
`;
