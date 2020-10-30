import { gql } from "@apollo/client";

export const GET_DELIVERABLE_TARGETS = gql`
	query {
		deliverableTargetList {
			id
			name
			description
			target_value
			deliverable_category_unit {
				id
				deliverable_category_org {
					id
					name
					code
					description
					organization {
						id
						name
						account {
							id
							name
							description
							account_no
						}
						short_name
						legal_name
						description
						organization_registration_type {
							id
							reg_type
						}
					}
				}
				deliverable_units_org {
					id
					name
					description
					code
					unit_type
					prefix_label
					suffix_label
				}
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
			deliverable_category_unit {
				deliverable_category_org {
					id
					name
					code
					description
					organization {
						id
						name
						account {
							id
							name
							description
							account_no
						}
						short_name
						legal_name
						description
						organization_registration_type {
							id
							reg_type
						}
					}
				}
				deliverable_units_org {
					id
					name
					description
					code
					unit_type
					prefix_label
					suffix_label
				}
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

			deliverable_category_unit {
				deliverable_category_org {
					id
					name
					code
					description
					organization {
						id
						name
						account {
							id
							name
							description
							account_no
						}
						short_name
						legal_name
						description
						organization_registration_type {
							id
							reg_type
						}
					}
				}
				deliverable_units_org {
					id
					name
					description
					code
					unit_type
					prefix_label
					suffix_label
				}
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
export const CREATE_DELIVERABLE_TARGET = gql`
	mutation createDeliverableTarget($input: DeliverableTargetProjectInput!) {
		createDeliverableTarget(input: $input) {
			id
			name
			description
			target_value
			deliverable_category_unit {
				deliverable_category_org {
					id
					name
					code
					description
					organization {
						id
						name
						account {
							id
							name
							description
							account_no
						}
						short_name
						legal_name
						description
						organization_registration_type {
							id
							reg_type
						}
					}
				}
				deliverable_units_org {
					id
					name
					description
					code
					unit_type
					prefix_label
					suffix_label
				}
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

export const GET_ACHIEVED_VALLUE_BY_TARGET = gql`
	query getDeliverableTrackingTotalValueByProject($filter: JSON) {
		deliverableTrackingTotalValue(where: $filter)
	}
`;

export const GET_DELIVERABLE_TARGETS_COUNT = gql`
	query getDeliverableTargetCountByProject($filter: JSON) {
		deliverableTargetCount(where: $filter)
	}
`;
