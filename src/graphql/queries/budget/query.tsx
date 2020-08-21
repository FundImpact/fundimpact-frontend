import { gql } from "@apollo/client";

export const GET_GRANT_PERIODS_PROJECT_LIST = gql`
	query getGrantPeriodsProjectByProjectDonor($filter: JSON) {
		grantPeriodsProjectList(where: $filter) {
			id
			name
		}
	}
`;

export const GET_PROJECT_BUDGET_TARCKING = gql`
	query {
		projBudgetTrackings {
			id
			budget_targets_project {
				id
				name
			}
			amount
			note
			reporting_date
			donor {
				id
				name
			}
			conversion_factor
			budget_targets_project {
				id
			}
			annual_year {
				id
			}
			financial_years_org {
				id
			}
			financial_years_donor {
				id
			}
			grant_periods_project {
				id
			}
			organization_currency {
				currency {
					name
				}
			}
			donor {
				name
			}
		}
	}
`;