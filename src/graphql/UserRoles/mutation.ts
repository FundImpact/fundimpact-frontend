import { gql } from "@apollo/client";

export const INVITE_USER = gql`
	mutation inviteUser($input: inviteUserInput!) {
		inviteUser(input: $input) {
			email
			message
		}
	}
`;
