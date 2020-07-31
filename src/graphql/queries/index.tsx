import { gql } from "@apollo/client";

export const GET_ORGANISATIONS = gql`
	query {
		organisationList {
			id
			name
			short_name
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
export const GET_WORKSPACES = gql`
	query getWorkspaceAndProject {
		orgWorkspaces {
			id
			name
			organisation {
				name
			}
		}
	}
`;

export const GET_PROJECTS = gql`
	query {
		orgProject {
			id
			name
			workspace {
				id
				name
			}
		}
	}
`;
