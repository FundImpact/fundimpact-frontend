import { gql } from "@apollo/client";

export const GET_DELIVERABLE_ORG_CATEGORY = gql`
	query getDeliverableCategoryByOrg($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableCategory(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			description
			code
			organization {
				id
				name
				address
				account {
					id
					name
					description
					account_no
				}
				short_name
				legal_name
				description
				organization_registration_type {
					id
					reg_type
				}
			}
		}
	}
`;

export const CREATE_DELIVERABLE_CATEGORY = gql`
	mutation createDeliverableCategory($input: DeliverableCategoryOrgInput!) {
		createDeliverableCategory(input: $input) {
			id
			name
			description
			code
			organization {
				id
				name
				address
				account {
					id
					name
					description
					account_no
				}
				short_name
				legal_name
				description
				organization_registration_type {
					id
					reg_type
				}
			}
		}
	}
`;

export const UPDATE_DELIVERABLE_CATEGORY = gql`
	mutation updateDeliverableCategory($id: ID!, $input: DeliverableCategoryOrgInput!) {
		updateDeliverableCategory(id: $id, input: $input) {
			id
			name
			description
			code
		}
	}
`;

export const GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG = gql`
	query getDeliverableCategoryByOrg($filter: JSON) {
		deliverableCategoryCount(where: $filter)
	}
`;

export const GET_DELIVERABLE_CATEGORY_PROJECT_COUNT = gql`
	query getprojectCountDelCatByOrg($filter: JSON) {
		projectCountDelCatByOrg(where: $filter)
	}
`;
