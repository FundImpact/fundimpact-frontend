import { gql } from "@apollo/client";

export const GET_DELIVERABLE_TARGETS = gql`
	query {
		deliverableTargetList {
			id
			name
			description
			target_value
			deleted
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
			target_value
			deleted
			project {
				id
				name
				short_name
				description
			}
			deliverable_unit_org {
				id
				name
			}
			deliverable_category_org {
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
			target_value
			deleted
			project {
				id
				name
				short_name
				description
			}
			deliverable_unit_org {
				id
				name
			}
			deliverable_category_org {
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
			target_value
			project {
				id
				name
				short_name
				description
			}
			deliverable_unit_org {
				id
				name
			}
			deliverable_category_org {
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
