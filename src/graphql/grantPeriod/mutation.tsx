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
			}
			project {
				id
				name
			}
		}
	}
`;

export const UPDATE_GRANT_PERIOD = gql`
	mutation updateGrantPeriodsProjectDetail($id: ID!, $input: GrantPeriodsProjectInput!) {
		updateGrantPeriodsProjectDetail(id: $id, input: $input) {
			id
			name
			short_name
			start_date
			end_date
			description
			deleted
			donor {
				id
				name
				deleted
			}
			project {
				id
				name
			}
		}
	}
`;
