import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
	mutation createOrgProject($input: ProjectInput!) {
		createOrgProject(input: $input) {
			id
			name
			workspace {
				id
				name
			}
		}
	}
`;

export const UPDATE_PROJECT = gql`
	mutation updateOrgProject($id: ID!, $input: ProjectInput!) {
		updateOrgProject(id: $id, input: $input) {
			id
			name
			workspace {
				id
				name
			}
		}
	}
`;

export const GET_PROJECT = gql`
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
