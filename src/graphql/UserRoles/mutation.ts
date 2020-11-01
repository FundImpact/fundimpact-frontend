import { gql } from "@apollo/client";

export const INVITE_USER = gql`
	mutation inviteUser($input: inviteUserInput!) {
		inviteUser(input: $input) {
			id
			email
			message
		}
	}
`;

export const ASSIGN_PROJECT_TO_USER = gql`
	mutation createOrgUserProject($input: UserProjectInput!) {
		createOrgUserProject(input: $input) {
			id
			project {
				id
				name
				workspace {
					id
					name
				}
			}
		}
	}
`;

export const UNASSIGN_PROJECTS_ASSIGNED_TO_USER = gql`
	mutation deleteOrgUserProject($id: ID!, $input: UserProjectInput!) {
		deleteOrgUserProject(input: $input, id: $id) {
			id
			project {
				id
				name
				workspace {
					id
					name
				}
			}
		}
	}
`;
