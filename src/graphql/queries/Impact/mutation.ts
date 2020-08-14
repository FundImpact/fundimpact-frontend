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
