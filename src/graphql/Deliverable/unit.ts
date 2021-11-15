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
			deleted
		}
	}
`;

export const CREATE_UNIT = gql`
	mutation createUnit($input: createUnitInput) {
		createUnit(input: $input) {
			unit {
				id
				created_at
				updated_at
				name
				code
				description
				type
			}
		}
	}
`;

export const GET_UNIT = gql`
	query unit($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		units(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			created_at
			updated_at
			name
			code
			description
			type
		}
	}
`;

export const GET_UNIT_COUNT = gql`
	query getunitCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		unitsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;

export const UPDATE_UNIT = gql`
	mutation updateUnit($input: updateUnitInput) {
		updateUnit(input: $input) {
			unit {
				id
				created_at
				updated_at
				name
				code
				description
				type
				sustainable_development_goal {
					name
					id
				}
			}
		}
	}
`;

export const DELETE_UNIT = gql`
	mutation deleteUnit($input: deleteUnitInput) {
		deleteUnit(input: $input) {
			unit {
				id
				created_at
				updated_at
				name
				code
				description
				type
				sustainable_development_goal {
					id
					name
				}
			}
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
			deleted
		}
	}
`;

export const GET_DELIVERABLE_UNIT_COUNT_BY_ORG = gql`
	query getdeliverableUnitOrgCountByOrg($filter: JSON) {
		deliverableUnitOrgCount(where: $filter)
	}
`;

export const GET_DELIVERABLE_UNIT_PROJECT_COUNT = gql`
	query getprojectCountDelUnit($filter: JSON) {
		projectCountDelUnit(where: $filter)
	}
`;
