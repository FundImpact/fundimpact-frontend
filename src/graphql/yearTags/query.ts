import { gql } from "@apollo/client";

export const GET_YEARTAGS = gql`
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

export const GET_YEARTAGS_COUNT = gql`
	query yearTagsCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		yearTagsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
				totalCount
			}
		}
	}
`;

export const GET_YEARTAG_COUNTRIES_BY_YEARTAG_ID = gql`
	query yearTagCountries($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		yearTagsCountries(sort: $sort, limit: $limit, start: $start, where: $filter) {
			country {
				id
				name
				code
			}
			year_tag {
				id
				created_at
				updated_at
				type
				name
			}
		}
	}
`;

export const GET_YEAR_TAG_DONOR_FINANCIAL_YEAR = gql`
	query yearTagDonor($id: ID!) {
		yearTagDonor(id: $id) {
			id
			name
			type
			start_date
			end_date
		}
	}
`;

export const GET_YEAR_TAG_ORGANIZATION_FINANCIAL_YEAR = gql`
	query yearTagOrganization($id: ID!) {
		yearTagOrganization(id: $id) {
			id
			name
			type
			start_date
			end_date
		}
	}
`;

// export const GET_YEARTAG_COUNTRIES_BY_YEARTAG_ID = gql`
// 	query yearTagCountries($sort: String, $limit: Int, $start: Int, $filter: JSON) {
// 		yearTagsCountries(sort: $sort, limit: $limit, start: $start, where: $filter) {
// 			country {
// 				id
// 				name
// 				code
// 			}
// 		}
// 	}
// `;
