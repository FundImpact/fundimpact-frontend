import { gql } from "@apollo/client";

export const GET_DELIVERABLE_ORG_CATEGORY = gql`
	query deliverableCategoryOrgs($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableCategoryOrgs(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
			description
			project_id {
				id
				name
			}
			deliverable_type_id {
				id
				name
			}
		}
	}
`;

export const GET_DELIVERABLE_ORG_CATEGORY_COUNT = gql`
	query deliverableCategoryOrgsConnection {
		deliverableCategoryOrgsConnection {
			aggregate {
				count
			}
		}
	}
`;
