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
	query getProjBudgetTrackingsByProject($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		projBudgetTrackings(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			budget_targets_project {
				id
				name
			}
			amount
			note
			reporting_date

			annual_year {
				id
			}
		}
	}
`;

export const GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM = gql`
	query getProjBudgetTrackingTotalAmountByProject($filter: JSON) {
		projBudgetTrackingsTotalAmount(where: $filter)
	}
`;

export const GET_BUDGET_TARGET_PROJECT = gql`
	query getBudgettargetProject($filter: JSON) {
		projectBudgetTargets(where: $filter) {
			id
			name
			project {
				name
				id
			}
			budget_category_organization {
				id
				name
			}
			description
			total_target_amount
			donor {
				name
				id
			}
		}
	}
`;

export const GET_ORGANIZATION_BUDGET_CATEGORY = gql`
	query getorgBudgetCategoryByOrg($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		orgBudgetCategory(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			code
		}`;

export const GET_PROJECT_BUDGET_TARGETS_COUNT = gql`
	query getProjectBudgetTargetsCount($filter: JSON) {
		projectBudgetTargetsCount(where: $filter)
	}
`;

export const GET_PROJ_BUDGET_TRACINGS_COUNT = gql`
	query getProjBudgetTrackingsCount($filter: JSON) {
		projBudgetTrackingsCount(where: $filter)
	}
`;
