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
			annual_year {
				name
			}
			financial_years_org {
				name
			}
			financial_years_donor {
				name
			}
			reporting_date
			grant_periods_project {
				name
			}
			conversion_factor
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
