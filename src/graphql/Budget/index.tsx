import { gql } from "@apollo/client";

export const GET_GRANT_PERIODS_PROJECT_LIST = gql`
	query getGrantPeriodsProjectByProjectDonor($filter: JSON) {
		grantPeriodsProjectList(where: $filter) {
			id
			name
			short_name
			start_date
			end_date
			description
			deleted
			donor {
				id
				name
				deleted
			}
			project {
				id
				name
			}
		}
	}
`;

export const GET_PROJECT_BUDGET_TARCKING = gql`
	query budgetTrackingLineitems($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		budgetTrackingLineitems(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			budget_targets_project {
				id
				name
				deleted
			}
			budget_sub_target {
				id
				target_value
			}
			amount
			note
			reporting_date
			annual_year {
				name
				id
			}
			fy_org {
				id
				name
			}
			financial_year_donor {
				id
				name
			}
			financial_year_org {
				id
				name
			}
			grant_periods_project {
				id
				name
			}
			fy_donor {
				id
				name
			}
			timeperiod_start
			timeperiod_end
			attachments {
				id
				name
				size
				caption
				url
				ext
				created_at
			}
			deleted
		}
	}
`;

export const GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM = gql`
	query getProjBudgetTrackingTotalAmountByProject($filter: JSON) {
		projBudgetTrackingsTotalAmount(where: $filter)
	}
`;

export const GET_BUDGET_TARGET_PROJECT = gql`
	query getProjectBudgetTargetsByProject($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		projectBudgetTargets(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			project {
				name
				id
			}
			project_with_budget_targets {
				project {
					id
					name
				}
			}
			budget_category_organization {
				id
				name
				deleted
			}
			description
			total_target_amount
			donor {
				name
				id
				country {
					id
				}
			}
			deleted
		}
	}
`;

export const GET_PROJECT_BUDGET_TARGETS_COUNT = gql`
	query getProjectBudgetTargetsCount($filter: JSON) {
		projectBudgetTargetsCount(where: $filter)
	}
`;

export const GET_PROJ_BUDGET_TRACINGS_COUNT = gql`
	query budgetTrackingLineitemsConnection(
		$sort: String
		$limit: Int
		$start: Int
		$filter: JSON
	) {
		budgetTrackingLineitemsConnection(
			sort: $sort
			limit: $limit
			start: $start
			where: $filter
		) {
			aggregate {
				count
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
			description
			deleted
		}
	}
`;

export const GET_ORG_BUDGET_CATEGORY_COUNT = gql`
	query getorgBudgetCategoryCountByOrg($filter: JSON) {
		orgBudgetCategoryCount(where: $filter)
	}
`;

export const GET_BUDGET_CATEGORY_PROJECT_COUNT = gql`
	query getProjectCountBudgetCatByOrg($filter: JSON) {
		projectCountBudgetCatByOrg(where: $filter)
	}
`;

export const GET_BUDGET_SUB_TARGETS = gql`
	query budgetSubTargets($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		budgetSubTargets(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			created_at
			updated_at
			project {
				id
				name
			}
			budget_targets_project {
				id
				name
			}
			target_value
			timeperiod_end
			timeperiod_start
			donor {
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
`;

export const GET_BUDGET_SUB_TARGETS_COUNT = gql`
	query budgetSubTargetsConnection($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		budgetSubTargetsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
