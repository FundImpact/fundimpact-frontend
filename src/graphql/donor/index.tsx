import { gql } from "@apollo/client";

export const GET_ORG_DONOR = gql`
	query {
		orgDonors {
			id
			name
			country {
        id
				name
			}
      short_name
      legal_name
		}
	}
`;
