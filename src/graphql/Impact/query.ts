import { gql } from "@apollo/client";

export const GET_IMPACT_CATEGORY_BY_ORG = gql`
	query getImpactCategoryByOrg($filter: JSON) {
		impactCategoryOrgList(where: $filter) {
			id
			name
		}
	}
`;

export const GET_ALL_IMPACT_TARGET_AMOUNT = gql`
	query getImpactTargetProjectTotalAmount($filter: JSON) {
		impactTargetProjectTotalAmount(where: $filter)
	}
`;

export const GET_ALL_IMPACT_AMOUNT_SPEND = gql`
	query getImpactTrackingLineitemTotalSpendAmount($filter: JSON) {
		impactTrackingLineitemTotalSpendAmount(where: $filter)
	}
`;
