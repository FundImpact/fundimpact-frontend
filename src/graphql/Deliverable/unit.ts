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
