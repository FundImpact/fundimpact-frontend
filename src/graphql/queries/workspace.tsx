import { gql } from "@apollo/client";

export const CREATE_WORKSPACE = gql`
	mutation CreateWorkspace($payload: Input) {
		createWorkspace(input: $payload) {
			id
			name
			short_name
			organisation
		}
	}
`;

export const UPDATE_WORKSPACE = gql`
	mutation UpdateWorkspace($workspaceID: ID, $payload: Input) {
		createWorkspace(input: $payload) {
			id
			name
			short_name
			organisation
		}
	}
`;
