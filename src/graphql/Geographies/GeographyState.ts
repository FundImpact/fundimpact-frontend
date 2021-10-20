import { gql } from "@apollo/client";

export const GET_STATE_DATA = gql`
	query getStates($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		states(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
		}
	}
`;
