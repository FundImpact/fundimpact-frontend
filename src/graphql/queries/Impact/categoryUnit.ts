import { gql } from "@apollo/client";

export const GET_IMPACT_CATEGORY_UNIT = gql`
	query getImpactUnitByCategory($filter: JSON) {
		impactCategoryUnitList(where: $filter) {
			id
			impact_category_org {
				id
				name
				shortname
				code
				description
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
	}
`;
