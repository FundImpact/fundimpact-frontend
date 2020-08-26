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
