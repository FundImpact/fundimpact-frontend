import { gql } from "@apollo/client";

export const GET_DELIVERABLE_SUB_TARGETS = gql`
	query deliverableSubTargets($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableSubTargets(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			created_at
			updated_at
			project {
				id
				name
			}
			deliverable_target_project {
				id
				name
				is_qualitative
				sub_target_required
				value_calculation
				value_qualitative_option
			}
			donor {
				id
				name
			}
			target_value
			target_value_qualitative
			timeperiod_end
			timeperiod_start
			financial_year_org {
				id
				name
			}
			financial_year_donor {
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
					is_qualitative
					sub_target_required
					value_calculation
					value_qualitative_option
				}
				target_value
				target_value_qualitative
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
					is_qualitative
					sub_target_required
					value_calculation
					value_qualitative_option
				}
				target_value
				target_value_qualitative
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

export const GET_DELIVERABLE_SUB_TARGETS_COUNT = gql`
	query deliverableSubTargetsConnection($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableSubTargetsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
				sum {
					target_value
				}
			}
		}
	}
`;
