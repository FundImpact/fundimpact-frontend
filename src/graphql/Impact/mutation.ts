import { gql } from "@apollo/client";

export const CREATE_IMPACT_CATEGORY_ORG_INPUT = gql`
	mutation createImpactCategoryOrgInput($input: ImpactCategoryOrgInput!) {
		createImpactCategoryOrgInput(input: $input) {
			id
			name
			code
		}
	}
`;

export const CREATE_IMPACT_UNITS_ORG_INPUT = gql`
	mutation createImpactUnitsOrgInput($input: ImpactUnitsOrgInput!) {
		createImpactUnitsOrgInput(input: $input) {
			id
			name
			code
			description
			target_unit
			prefix_label
			suffix_label
		}
	}
`;
