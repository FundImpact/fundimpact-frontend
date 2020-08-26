import { gql } from "@apollo/client";

export const CREATE_ORG_BUDGET_CATEGORY = gql`
	mutation createOrgBudgetCategory($input: BudgetCategoryOrganizationInput!) {
		createOrgBudgetCategory(input: $input) {
			id
			name
			code
		}
	}
`;

export const CREATE_PROJECT_BUDGET_TARGET = gql`
	mutation createProjectBudgetTarget($input: BudgetTargetsProjectInput!) {
		createProjectBudgetTarget(input: $input) {
			id
			name
			total_target_amount
			budget_category_organization {
				name
			}
		}
	}
`;

export const CREATE_PROJECT_BUDGET_TRACKING = gql`
	mutation createProjBudgetTracking($input: BudgetTrackingLineitemInput!) {
		createProjBudgetTracking(input: $input) {
			id
			amount
			note
			reporting_date
			budget_targets_project {
				id
				name
			}
			annual_year {
				id
				name
			}
		}
	}
`;

export const UPDATE_PROJECT_BUDGET_TRACKING = gql`
	mutation updateProjBudgetTracking($id: ID!, $input: BudgetTrackingLineitemInput!) {
		updateProjBudgetTracking(id: $id, input: $input) {
			id
			amount
			conversion_factor
			note
			reporting_date
			budget_targets_project {
				id
				name
				description
			}
			annual_year {
				id
				name
			}
			financial_years_donor {
				id
				name
				short_name
				start_date
				end_date
				donor {
					id
					name
				}
			}
			grant_periods_project {
				id
				name
				short_name
				start_date
				end_date
			}
		}
	}
`;

export const UPDATE_PROJECT_BUDGET_TARGET = gql`
	mutation updateProjectBudgetTarget($id: ID!, $input: BudgetTargetsProjectInput!) {
		updateProjectBudgetTarget(id: $id, input: $input) {
			id
			name
			total_target_amount
			conversion_factor
			organization_currency {
				currency {
					name
				}
			}
			project {
				name
			}
		}
	}
`;
