import { gql } from "@apollo/client";

export const CREATE_PROJECT_WITH_IMPACT_TARGET = gql`
	mutation createProjectWithImpactTarget($input: createProjectWithImpactTargetInput!) {
		createProjectWithImpactTarget(input: $input) {
			projectWithImpactTarget {
				id
				created_at
				updated_at
				project {
					id
					name
				}
				impact_target_project {
					id
					name
				}
			}
		}
	}
`;
