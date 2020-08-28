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
		}
	}
`;
