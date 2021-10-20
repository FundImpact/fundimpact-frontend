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
