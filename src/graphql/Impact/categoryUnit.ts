import { gql } from "@apollo/client";

export const GET_IMPACT_CATEGORY_UNIT = gql`
	query getImpactUnitByCategory($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		impactCategoryUnitList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			status
			impact_category_org {
				id
				name
				shortname
				code
				description
				deleted
			}
			impact_units_org {
				id
				name
				description
				code
				target_unit
				prefix_label
				suffix_label
				deleted
			}
		}
	}
`;

export const GET_IMPACT_CATEGORY_UNIT_COUNT = gql`
	query getimpactCategoryUnitListCountByCategory($filter: JSON) {
		impactCategoryUnitListCount(where: $filter)
	}
`;

export const UPDATE_IMPACT_CATEGORY_UNIT = gql`
	mutation updateImpactCategoryUnitInput($id: ID!, $input: ImpactCategoryUnitInput!) {
		updateImpactCategoryUnitInput(id: $id, input: $input) {
			id
			status
			impact_category_org {
				id
				name
				shortname
				code
				description
				organization {
					id
					name
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
			impact_units_org {
				id
				name
				description
				code
				target_unit
				prefix_label
				suffix_label
				organization {
					id
					name
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
	}
`;
