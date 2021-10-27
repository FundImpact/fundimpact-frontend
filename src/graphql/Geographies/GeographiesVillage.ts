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

export const CREATE_GEOGRAPHIES_VILLAGE = gql`
	mutation createGeographiesVillage($input: createVillageInput) {
		createVillage(input: $input) {
			village {
				name
				code
				block {
					name
				}
			}
		}
	}
`;

export const UPDATE_GEOGRAPHIES_VILLAGE = gql`
	mutation createGeographiesVillage($input: updateVillageInput) {
		updateVillage(input: $input) {
			village {
				name
				code
				block {
					name
				}
			}
		}
	}
`;

export const DELETE_GEOGRAPHIES_VILLAGE = gql`
	mutation deletGeographiesVillage($input: deleteVillageInput) {
		deleteVillage(input: $input) {
			village {
				name
				code
				block {
					name
				}
			}
		}
	}
`;
