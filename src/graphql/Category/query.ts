import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
	query category {
		category {
			id
			created_at
			updated_at
			name
			code
			description
			type
		}
	}
`;
