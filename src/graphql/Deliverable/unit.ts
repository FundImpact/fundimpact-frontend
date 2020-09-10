import { gql } from "@apollo/client";

export const CREATE_DELIVERABLE_UNIT = gql`
	mutation createDeliverableUnitOrg($input: DeliverableUnitsOrgInput!) {
		createDeliverableUnitOrg(input: $input) {
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
	}
`;

export const GET_DELIVERABLE_UNIT_BY_ORG = gql`
	query getdeliverableUnitByOrg($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableUnitOrg(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			description
			code
			unit_type
			prefix_label
			suffix_label
		}
	}
`;

export const UPDATE_DELIVERABLE_UNIT_ORG = gql`
	mutation updateDeliverableUnitOrg($id: ID!, $input: DeliverableUnitsOrgInput!) {
		updateDeliverableUnitOrg(id: $id, input: $input) {
			id
			name
			description
			code
			unit_type
			prefix_label
			suffix_label
		}
	}
`;

export const GET_DELIVERABLE_UNIT_COUNT_BY_ORG = gql`
	query getdeliverableUnitOrgCountByOrg($filter: JSON) {
		deliverableUnitOrgCount(where: $filter)
	}
`;
