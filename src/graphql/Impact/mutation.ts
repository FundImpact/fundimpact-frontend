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

export const CREATE_IMPACT_CATEGORY_UNIT = gql`
	mutation createImpactCategoryUnitInput($input: ImpactCategoryUnitInput!) {
		createImpactCategoryUnitInput(input: $input) {
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

export const UPDATE_IMPACT_UNIT_ORG = gql`
	mutation updateImpactUnitsOrgInput($id: ID!, $input: ImpactUnitsOrgInput!) {
		updateImpactUnitsOrgInput(id: $id, input: $input) {
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

export const UPDATE_IMPACT_CATEGORY_ORG = gql`
	mutation updateImpactCategoryOrgInput($id: ID!, $input: ImpactCategoryOrgInput!) {
		updateImpactCategoryOrgInput(id: $id, input: $input) {
			id
			name
			code
			shortname
			description
		}
	}
`;
