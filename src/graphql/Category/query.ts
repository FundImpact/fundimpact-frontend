import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
	query category {
		deliverableCategoryOrgs {
			id
			created_at
			updated_at
			name
			code
			description
			organization {
				name
			}
			deleted
			project_id {
				name
			}
			deliverable_type_id {
				id
				created_at
				updated_at
				name
			}
		}
	}
`;
