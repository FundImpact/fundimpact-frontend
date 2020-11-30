import { gql } from "@apollo/client";

export const CREATE_CONTACT = gql`
	mutation createT4DContact($input: createT4DContactInput) {
		createT4DContact(input: $input) {
			t4DContact {
				id
				addresses
				phone_numbers
				emails
				contact_type
				label
			}
		}
	}
`;

export const UPDATE_CONTACT = gql`
	mutation updateT4DContact($input: updateT4DContactInput) {
		updateT4DContact(input: $input) {
			t4DContact {
				id
				addresses
				phone_numbers
				emails
				contact_type
				label
			}
		}
	}
`;
