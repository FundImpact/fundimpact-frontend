import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
	query yearTags($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		yearTags(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			type
			start_date
			end_date
		}
	}
`;
