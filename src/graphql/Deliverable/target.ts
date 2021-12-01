import { gql } from "@apollo/client";

export const GET_DELIVERABLE_TARGETS = gql`
	query {
		deliverableTargetList {
			id
			name
			description
			deleted
			is_qualitative
			sub_target_required
			value_calculation
			value_qualitative_option
			deliverable_unit_org {
				id
				name
			}
			deliverable_category_org {
				id
				name
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

export const UPDATE_DELIVERABLE_TARGET = gql`
	mutation updateDeliverableTarget($id: ID!, $input: DeliverableTargetProjectInput!) {
		updateDeliverableTarget(id: $id, input: $input) {
			id
			name
			description
			deleted
			is_qualitative
			sub_target_required
			value_calculation
			value_qualitative_option
			project {
				id
				name
				short_name
				description
			}
			category {
				id
				name
			}
			unit {
				id
				name
			}
		}
	}
`;

export const GET_DELIVERABLE_TARGET_BY_PROJECT = gql`
	query getDeliverableTargetListByProject(
		$sort: String
		$limit: Int
		$start: Int
		$filter: JSON
	) {
		deliverableTargetList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			description
			type {
				id
				name
			}
			deleted
			is_qualitative
			sub_target_required
			value_calculation
			value_qualitative_option
			project_with_deliverable_targets {
				project {
					id
					name
				}
			}
			project {
				id
				name
				short_name
				description
			}
			unit {
				id
				name
			}
			category {
				id
				name
			}
		}
	}
`;
export const CREATE_DELIVERABLE_TARGET = gql`
	mutation createDeliverableTarget($input: DeliverableTargetProjectInput!) {
		createDeliverableTarget(input: $input) {
			id
			name
			description
			is_qualitative
			sub_target_required
			value_calculation
			value_qualitative_option
			project {
				id
				name
				short_name
				description
			}
			unit {
				id
				name
			}
			category {
				id
				name
			}
		}
	}
`;

export const GET_ACHIEVED_VALLUE_BY_TARGET = gql`
	query getDeliverableTrackingTotalValueByProject($filter: JSON) {
		deliverableTargetCount(where: $filter)
	}
`;

export const GET_DELIVERABLE_TARGETS_COUNT = gql`
	query getDeliverableTargetCountByProject($filter: JSON) {
		deliverableTargetCount(where: $filter)
	}
`;
