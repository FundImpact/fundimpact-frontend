import { gql } from "@apollo/client";

export const UPDATE_PASSWORD = gql`
	mutation resetUserPasswordInput($id: ID!, $input: resetPasswordInput) {
		resetUserPasswordInput(id: $id, input: $input) {
			id
			username
			name
			email
		}
	}
`;
