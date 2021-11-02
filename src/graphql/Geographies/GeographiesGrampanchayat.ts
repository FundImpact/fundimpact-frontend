import { gql } from "@apollo/client";

export const GET_GRAMPANCHAYAT_DATA = gql`
	query getGrampanchayat($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		grampanchayats(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
		}
	}
`;

export const GET_GRAMPANCHAYAT_COUNT = gql`
	query getgrampanchayatCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		grampanchayatsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;

export const CREATE_GEOGRAPHIES_GRAMPANCHAYAT = gql`
	mutation createGeographiesGrampanchayat($input: createGrampanchayatInput) {
		createGrampanchayat(input: $input) {
			grampanchayat {
				name
				code
				district {
					name
				}
			}
		}
	}
`;

export const UPDATE_GEOGRAPHIES_GRAMPANCHAYAT = gql`
	mutation updateGeographiesBlock($input: updateGrampanchayatInput) {
		updateGrampanchayat(input: $input) {
			grampanchayat {
				name
				code
				district {
					name
				}
			}
		}
	}
`;

export const DELETE_GEOGRAPHIES_GRAMPANCHAYAT = gql`
	mutation deletGeographiesGrampanchayat($input: deleteGrampanchayatInput) {
		deleteGrampanchayat(input: $input) {
			grampanchayat {
				name
				code
				district {
					name
				}
			}
		}
	}
`;
