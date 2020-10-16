import { gql } from "@apollo/client";

export const GET_IMPACT_CATEGORY_UNIT = gql`
	query getImpactUnitByCategory($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		impactCategoryUnitList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			impact_category_org {
				id
				name
				shortname
				code
				description
			}
			impact_units_org {
				id
				name
				description
				code
				target_unit
				prefix_label
				suffix_label
			}
		}
	}
`;

export const GET_IMPACT_CATEGORY_UNIT_COUNT = gql`
	query getimpactCategoryUnitListCountByCategory($filter: JSON) {
		impactCategoryUnitListCount(where: $filter)
	}
`;
