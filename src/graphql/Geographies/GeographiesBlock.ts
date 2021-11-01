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

export const GET_BLOCK_COUNT = gql`
	query getblockCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		blocksConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;

export const CREATE_GEOGRAPHIES_BLOCK = gql`
	mutation createGeographiesBlock($input: createBlockInput) {
		createBlock(input: $input) {
			block {
				name
				code
				district {
					name
				}
			}
		}
	}
`;

export const UPDATE_GEOGRAPHIES_BLOCK = gql`
	mutation updateGeographiesBlock($input: updateBlockInput) {
		updateBlock(input: $input) {
			block {
				name
				code
				district {
					name
				}
			}
		}
	}
`;

export const DELETE_GEOGRAPHIES_BLOCK = gql`
	mutation deletGeographiesBlock($input: deleteBlockInput) {
		deleteBlock(input: $input) {
			block {
				name
				code
				district {
					name
				}
			}
		}
	}
`;
