import { gql } from "@apollo/client";

export const CREATE_WORKSPACE = gql`
	mutation CreateWorkspace($payload: createWorkspaceInput) {
		createWorkspace(input: $payload) {
			workspace {
				id
				name
				short_name
				organization {
					id
					name
				}
			}
		}
	}
`;

export const UPDATE_WORKSPACE = gql`
	mutation UpdateWorkspace($workspaceID: ID!, $payload: editWorkspaceInput) {
		updateWorkspace(input: { where: { id: $workspaceID }, data: $payload }) {
			workspace {
				id
				name
				organization {
					name
					id
				}
			}
		}
	}
`;
