import { gql } from "@apollo/client";

export const GET_COUNTIES = gql`
	query getCountries($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		countries(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
		}
	}
`;
