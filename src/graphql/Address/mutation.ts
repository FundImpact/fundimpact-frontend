import { gql } from "@apollo/client";

export const CREATE_ADDRESS = gql`
	mutation createT4DAddress($input: createT4DAddressInput) {
		createT4DAddress(input: $input) {
			t4DAddress {
				id
				address_line_1
				address_line_2
				pincode
			}
		}
	}
`;
