import { gql } from "@apollo/client";

export const GET_FINANCIAL_YEARS_ORG = gql`
	query getfinancialYearsOrgListByOrg($filter: JSON) {
		financialYearsOrgList(where: $filter) {
			id
			name
			short_name
			start_date
			end_date
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
`;
