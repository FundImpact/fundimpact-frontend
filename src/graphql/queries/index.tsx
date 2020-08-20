import { gql } from "@apollo/client";

export const GET_ORGANISATIONS = gql`
	query {
		organizationList {
			id
			name
			short_name
			organization_registration_type {
				id
				reg_type
			}
			account {
				id
				name
			}
		}
	}
`;

// TODO: The fields for workspaces must match with the Create Workspace Mutation
export const GET_WORKSPACES_BY_ORG = gql`
	query getWorkspacesByOrganisation($filter: JSON) {
		orgWorkspaces(where: $filter) {
			id
			name
			short_name
			description
			organization {
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
			organization {
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

export const GET_ORG_CURRENCIES = gql`
	query {
		orgCurrencies {
			id
			currency {
				name
			}
		}
	}
`;
