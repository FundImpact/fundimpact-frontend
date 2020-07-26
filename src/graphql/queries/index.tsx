import { gql, useQuery } from "@apollo/client";

export const GET_ORGANISATIONS = gql`
	query GetOrganisation {
		organisations {
			id
			name
		}
	}
`;
