import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
	query category($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		categories(sort: $sort, limit: $limit, start: $start, where: $filter) {
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
