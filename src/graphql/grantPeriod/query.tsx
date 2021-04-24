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
