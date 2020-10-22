import { gql } from "@apollo/client";

export const CREATE_INDIVIDUAL = gql`
	mutation createT4DIndividual($input: createT4DIndividualInput) {
		createT4DIndividual(input: $input) {
			t4DIndividual {
				id
				name
			}
		}
	}
`;
