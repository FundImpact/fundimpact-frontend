import { gql } from "@apollo/client";

// export const GET_COUNTRY_DATA = gql`
// 	query getCountryData($sort: String, $limit: Int, $start: Int, $filter: JSON) {
// 		getCountries(sort: $sort, limit: $limit, start: $start, where: $filter) {
// 			id
// 			name
// 			code
// 		}
// 	}
// `;

export const GET_COUNTRY_DATA = gql`
	query getCountries($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		countries(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
		}
	}
`;

export const GET_COUNTRY_COUNT = gql`
	query getcountryCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		countriesConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;

export const CREATE_GEOGRAPHIES_COUNTRY = gql`
	mutation createGeographiesCountry($input: createCountryInput) {
		createCountry(input: $input) {
			country {
				name
				code
			}
		}
	}
`;

export const UPDATE_GEOGRAPHIES_COUNTRY = gql`
	mutation updateGeographiesCountry($input: updateCountryInput) {
		updateCountry(input: $input) {
			country {
				id
				created_at
				updated_at
				name
				code
			}
		}
	}
`;

export const DELETE_GEOGRAPHIES_COUNTRY = gql`
	mutation deletGeographiesCountry($input: deleteCountryInput) {
		deleteCountry(input: $input) {
			country {
				name
				code
				states {
					name
				}
			}
		}
	}
`;
