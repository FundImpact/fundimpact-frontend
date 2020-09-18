import { gql } from "@apollo/client";

export const GET_IMPACT_CATEGORY = gql`
	query {
		impactCategoryOrgList {
			id
			name
			code
			description
			shortname
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

export const GET_IMPACT_CATEGORY_PROJECT_COUNT = gql`
	query getProjectCountImpCatByOrg($filter: JSON) {
		projectCountImpCatByOrg(where: $filter)
	}
`;
