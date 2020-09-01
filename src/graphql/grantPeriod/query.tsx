import { gql } from "@apollo/client";

export const FETCH_GRANT_PERIODS = gql`
	query {
		grantPeriodsProjectList {
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
