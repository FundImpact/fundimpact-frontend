import { gql } from "@apollo/client";

export const GET_DISTRICT_DATA = gql`
	query getDistricts($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		districts(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
			state {
				id
				name
			}
		}
	}
`;

export const GET_DISTRICT_OPTIONS = gql`
	query getDistricts($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		districts(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
		}
	}
`;

export const GET_DISTRICT_COUNT = gql`
	query getdistrictCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		districtsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;

export const CREATE_GEOGRAPHIES_DISTRICT = gql`
	mutation createGeographiesDistrict($input: createDistrictInput) {
		createDistrict(input: $input) {
			district {
				name
				code
				state {
					name
				}
			}
		}
	}
`;

export const UPDATE_GEOGRAPHIES_DISTRICT = gql`
	mutation updateGeographiesDistrict($input: updateDistrictInput) {
		updateDistrict(input: $input) {
			district {
				name
				code
				state {
					name
				}
			}
		}
	}
`;

export const DELETE_GEOGRAPHIES_DISTRICT = gql`
	mutation deletGeographiesDistrict($input: deleteDistrictInput) {
		deleteDistrict(input: $input) {
			district {
				name
				code
				state {
					name
				}
			}
		}
	}
`;
