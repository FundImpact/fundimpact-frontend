import { gql } from "@apollo/client";

export const FETCH_GRANT_PERIODS = gql`
	query getGrantPeriodsProjectByProjectDonor($filter: JSON) {
		grantPeriodsProjectList(where: $filter) {
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
