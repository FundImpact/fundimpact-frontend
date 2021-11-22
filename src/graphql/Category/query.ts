import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
	query category($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		categories(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			created_at
			updated_at
			name
			code
			description
			type
			project_id {
				id
				name
			}
		}
	}
`;

export const GET_CATEGORY_TYPES = gql`
	query getdeliverableTypes($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableTypes(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			created_at
			updated_at
			name
			is_active
			deliverable_type {
				id
				created_at
				updated_at
				name
			}
			weight
			deliverable_types {
				id
				is_active
			}
		}
	}
`;
