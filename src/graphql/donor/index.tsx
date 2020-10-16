import { gql } from "@apollo/client";

export const GET_ORG_DONOR = gql`
	query getOrgDonorByOrg($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		orgDonors(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			country {
				id
				name
			}
			legal_name
			short_name
		}
	}
`;

export const GET_DONOR_COUNT = gql`
	query getorgDonorsCountByOrg($filter: JSON) {
		orgDonorsCount(where: $filter)
	}
`;
