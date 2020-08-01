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
	query getWorkspacesByOrganisation($filter: JSON) {
		orgWorkspaces(where: $filter) {
			id
			name
			organisation {
				id
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

export const GET_PROJECTS_BY_WORKSPACE = gql`
	query getProjectsByWorkspace($filter: JSON) {
		orgProject(where: $filter) {
			id
			name
			workspace {
				id
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
