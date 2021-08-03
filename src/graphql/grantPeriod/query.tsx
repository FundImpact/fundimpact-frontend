import { gql } from "@apollo/client";
/*
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
*/
export const FETCH_GRANT_PERIODS = gql`
	query grantPeriodsProjects($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		grantPeriodsProjects(sort: $sort, limit: $limit, start: $start, where: $filter) {
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

export const FETCH_GRANT_PERIODS_COUNT = gql`
	query grantPeriodsProjectsConnection($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		grantPeriodsProjectsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
