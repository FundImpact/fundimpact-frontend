import { gql, useQuery } from "@apollo/client";

export const GET_ORGANISATIONS = gql`
	query GetOrganisation {
		organisations {
			id
			name
		}
	}
`;

export const GET_WORKSPACES_BY_ORG = gql`
	query getWorkspaces($orgId: ID!) {
		workspaces(where: { organisation: $orgId }) {
			name
			id
			organisation {
				name
			}
		}
	}
`;
