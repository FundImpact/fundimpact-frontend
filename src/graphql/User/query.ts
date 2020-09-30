import { gql } from "@apollo/client";

export const GET_USER_ROLES = gql`
	query getRole($filter: JSON) {
		getRolePemissions(where: $filter) {
			id
			controller
			action
			enabled
		}
	}
`;

export const GET_USER_DETAILS = gql`
	query userCustomer {
		userCustomer {
			id
			username
			email
			provider
			confirmed
			blocked
			role {
				id
				name
			}
			name
			account {
				id
				name
				account_no
			}
			theme
			organization {
				id
				name
			}
		}
	}
`;
