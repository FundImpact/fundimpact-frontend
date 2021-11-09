import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
	mutation createDeliverableCategoryOrg($input: createDeliverableCategoryOrgInput) {
		createDeliverableCategoryOrg(input: $input) {
			deliverableCategoryOrg {
				id
				name
				code
				description
				project_id {
					id
					name
				}
			}
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation updateDeliverableCategoryOrg($input: updateDeliverableCategoryOrgInput) {
		updateDeliverableCategoryOrg(input: $input) {
			deliverableCategoryOrg {
				id
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
					name
				}
			}
		}
	}
`;

export const DELETE_CATEGORY = gql`
	mutation deleteDeliverableCategoryOrg($input: deleteDeliverableCategoryOrgInput) {
		deleteDeliverableCategoryOrg(input: $input) {
			deliverableCategoryOrg {
				id
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
					name
				}
			}
		}
	}
`;
