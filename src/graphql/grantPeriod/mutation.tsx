import { gql } from "@apollo/client";

export const CREATE_GRANT_PERIOD = gql`
	mutation createGrantPeriodsProjectDetail($input: GrantPeriodsProjectInput!) {
		createGrantPeriodsProjectDetail(input: $input) {
			id
			name
			short_name
			start_date
			end_date
			description
			donor {
				id
				name
				short_name
				legal_name
			}
			project {
				id
				name
				short_name
				description
			}
		}
	}
`;
