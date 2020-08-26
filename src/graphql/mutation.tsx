import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION_CURRENCY = gql`
	mutation createOrgCurrency($input: OrganizationCurrencyInput!) {
		createOrgCurrency(input: $input) {
			id
		}
	}
`;
