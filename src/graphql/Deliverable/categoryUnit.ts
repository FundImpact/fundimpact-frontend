import { gql } from "@apollo/client";

export const CREATE_CATEGORY_UNIT = gql`
	mutation createDeliverableCategoryUnitInput($input: DeliverableCategoryUnitInput!) {
		createDeliverableCategoryUnitInput(input: $input) {
			id
			deliverable_category_org {
				id
				name
				description
				code
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
		}
	}
`;

export const GET_CATEGORY_UNIT = gql`
	query getDeliverableCategoryUnitByCategory(
		$sort: String
		$limit: Int
		$start: Int
		$filter: JSON
	) {
		deliverableCategoryUnitList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			status
			deliverable_category_org {
				id
				name
				description
				code
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
				deleted
			}
			deliverable_units_org {
				id
				name
				description
				code
				unit_type
				prefix_label
				suffix_label
				deleted
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
		}
	}
`;

export const GET_DELIVERABLE_CATEGORY_UNIT_COUNT = gql`
	query getdeliverableCategoryUnitCountByCategory($filter: JSON) {
		deliverableCategoryUnitCount(where: $filter)
	}
`;

export const UPDATE_DELIVERABLE_CATEGPRY_UNIT = gql`
	mutation updateDeliverableCategoryUnitInput($id: ID!, $input: DeliverableCategoryUnitInput!) {
		updateDeliverableCategoryUnitInput(id: $id, input: $input) {
			id
			status
			deliverable_category_org {
				id
				name
				description
				code
				deleted
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
				deleted
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
		}
	}
`;
