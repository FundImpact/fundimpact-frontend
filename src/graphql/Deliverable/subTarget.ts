import { gql } from "@apollo/client";

export const GET_DELIVERABLE_SUB_TARGETS = gql`
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
			grant_periods_project {
				id
				name
			}
		}
	}
`;

export const CREATE_DELIVERABLE_SUB_TARGET = gql`
	mutation createDeliverableSubTarget($input: createDeliverableSubTargetInput!) {
		createDeliverableSubTarget(input: $input) {
			deliverableSubTarget {
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
				grant_periods_project {
					id
					name
				}
			}
		}
	}
`;

export const UPDATE_DELIVERABLE_SUB_TARGET = gql`
	mutation updateDeliverableSubTarget($input: updateDeliverableSubTargetInput!) {
		updateDeliverableSubTarget(input: $input) {
			deliverableSubTarget {
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
				grant_periods_project {
					id
					name
				}
			}
		}
	}
`;
