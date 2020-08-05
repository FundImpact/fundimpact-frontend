import { gql } from "@apollo/client";

export const CREATE_WORKSPACE = gql`
	mutation CreateWorkspace($payload: createWorkspaceInput) {
		createWorkspace(input: $payload) {
			workspace {
				id
				name
				short_name
				organisation {
					id
					name
				}
			}
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
