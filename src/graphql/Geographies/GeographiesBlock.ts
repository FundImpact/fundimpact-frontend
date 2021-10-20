import { gql } from "@apollo/client";

export const GET_BLOCK_DATA = gql`
	query getBlocks($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		blocks(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
			district {
				name
			}
		}
	}
`;
