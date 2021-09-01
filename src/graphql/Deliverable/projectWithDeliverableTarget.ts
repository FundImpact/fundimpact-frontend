import { gql } from "@apollo/client";

export const CREATE_PROJECT_WITH_DELIVERABLE_TARGET = gql`
	mutation createProjectWithDeliverableTarget($input: createProjectWithDeliverableTargetInput!) {
		createProjectWithDeliverableTarget(input: $input) {
			projectWithDeliverableTarget {
				id
				created_at
				updated_at
				project {
					id
					name
				}
				deliverable_target_project {
					id
					name
				}
			}
		}
	}
`;
