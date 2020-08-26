import { gql } from "@apollo/client";

export const GET_IMPACT_CATEGORY_BY_ORG = gql`
	query getImpactCategoryByOrg($filter: JSON) {
		impactCategoryOrgList(where: $filter) {
			id
			name
		}
	}
`;
