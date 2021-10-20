import { gql } from "@apollo/client";

export const GET_VILLAGE_DATA = gql`
	query getVillage($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		villages(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
			block {
				name
			}
		}
	}
`;
