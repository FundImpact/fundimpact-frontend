import { gql } from "@apollo/client";

export const CREATE_IMPACT_SUB_TARGET = gql`
	mutation createImpactSubTarget($input: createImpactSubTargetInput!) {
		createImpactSubTarget(input: $input) {
			impactSubTarget {
				id
				created_at
				updated_at
				project {
					id
					name
				}
				impact_target_project {
					id
					name
				}
				target_value
				timeperiod_start
				annual_year {
					id
					name
				}
				financial_year_org {
					id
					name
				}
				financial_year_donor {
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

export const UPDATE_IMPACT_SUB_TARGET = gql`
	mutation updateImpactSubTarget($input: updateImpactSubTargetInput!) {
		updateImpactSubTarget(input: $input) {
			impactSubTarget {
				id
				created_at
				updated_at
				project {
					id
					name
				}
				impact_target_project {
					id
					name
				}
				target_value
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
	}
`;
