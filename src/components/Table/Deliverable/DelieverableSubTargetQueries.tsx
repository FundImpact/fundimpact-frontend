import { gql } from "@apollo/client";

// QUERY
// -------------
export const GET_DELIVERABLE_SUBTARGETS = gql`
	query deliverableSubTargets($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableSubTargets(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			created_at
			updated_at
			project {
				id
				name
			}
			deliverable_target_project {
				id
				name
			}
			target_value
			timeperiod_end
			timeperiod_start
			financial_year_org {
				id
				name
			}

			annual_year {
				id
				name
			}
			financial_year_donor {
				id
				name
			}
			grant_periods_project {
				id
				name
			}
		}
	}
`;

// COUNT QUERY
// ----------

export const GET_DELIVERABLE_SUBTARGETS_COUNT = gql`
	query deliverableSubTargetsConnection($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableSubTargetsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
