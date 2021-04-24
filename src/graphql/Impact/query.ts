import { gql } from "@apollo/client";

export const GET_IMPACT_CATEGORY_BY_ORG = gql`
	query getImpactCategoryByOrg($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		impactCategoryOrgList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
			description
			shortname
			deleted
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

export const GET_IMPACT_UNIT_BY_ORG = gql`
	query getImpactUnitByOrg($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		impactUnitsOrgList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
			description
			target_unit
			prefix_label
			suffix_label
			deleted
		}
	}
`;

export const GET_IMPACT_CATEGORY_COUNT_BY_ORG = gql`
	query getimpactCategoryOrgCountByOrg($filter: JSON) {
		impactCategoryOrgCount(where: $filter)
	}
`;

export const GET_IMPACT_UNIT_COUNT_BY_ORG = gql`
	query getimpactUnitsOrgCount($filter: JSON) {
		impactUnitsOrgCount(where: $filter)
	}
`;

export const GET_IMPACT_UNIT_PROJECT_COUNT = gql`
	query getprojectCountImpUnit($filter: JSON) {
		projectCountImpUnit(where: $filter)
	}
`;
