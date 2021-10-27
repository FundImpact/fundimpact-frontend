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

export const CREATE_GEOGRAPHIES_STATE = gql`
	mutation createGeographiesState($input: createStateInput) {
		createState(input: $input) {
			state {
				name
				code
				country {
					name
				}
			}
		}
	}
`;

export const UPDATE_GEOGRAPHIES_STATE = gql`
	mutation updateGeographiesState($input: updateStateInput) {
		updateState(input: $input) {
			state {
				name
				code
				country {
					id
					name
				}
			}
		}
	}
`;

export const DELETE_GEOGRAPHIES_STATE = gql`
	mutation deletGeographiesState($input: deleteStateInput) {
		deleteState(input: $input) {
			state {
				name
				code
				country {
					name
				}
			}
		}
	}
`;
