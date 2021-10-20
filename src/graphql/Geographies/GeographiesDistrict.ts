import { gql } from "@apollo/client";

export const GET_DISTRICT_DATA = gql`
	query getDistricts($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		districts(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
			state {
				name
			}
		}
	}
`;
