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
						address
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
	query getDeliverableTargetListByProject($filter: JSON) {
		deliverableTargetList(where: $filter) {
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
						address
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
						address
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
