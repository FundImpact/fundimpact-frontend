import { gql } from "@apollo/client";

export const CREATE_CONTACT = gql`
	mutation createT4DContact($input: createT4DContactInput) {
		createT4DContact(input: $input) {
			t4DContact {
				id
				email
				email_other
				phone
				phone_other
			}
		}
	}
`;

export const UPDATE_CONTACT = gql`
	mutation updateT4DContact($input: updateT4DContactInput) {
		updateT4DContact(input: $input) {
			t4DContact {
				id
				email
				email_other
				phone
				phone_other
				contact_type
			}
		}
	}
`;
