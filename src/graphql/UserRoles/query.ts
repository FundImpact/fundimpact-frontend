import { gql } from "@apollo/client";

export const GET_ROLES_BY_ORG = gql`
	query getRoles($filter: JSON) {
		roles(where: $filter) {
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
