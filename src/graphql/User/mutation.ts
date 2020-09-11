import { gql } from "@apollo/client";

export const UPDATE_USER_DETAILS = gql`
	mutation updateUserCustomerInput($id: ID!, $input: editUserInput) {
		updateUserCustomerInput(id: $id, input: $input) {
			id
			username
			name
			email
			provider
			role {
				id
				name
			}
			account {
				id
				name
			}
		}
	}
`;
