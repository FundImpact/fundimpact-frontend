import { gql } from "@apollo/client";

export const CREATE_ORG_BUDGET_CATEGORY = gql`
	mutation createOrgBudgetCategory($input: BudgetCategoryOrganizationInput!) {
		createOrgBudgetCategory(input: $input) {
			id
			name
			code
			project_id {
				name
				id
			}
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
			budget_sub_target {
				id
				budget_targets_project {
					id
					name
				}
			}
			annual_year {
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
			financial_year_donor {
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
			note
			reporting_date
			deleted
			budget_sub_target {
				id
				budget_targets_project {
					id
					name
					deleted
				}
			}
			annual_year {
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
			financial_year_donor {
				id
				name
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
			project {
				name
			}
		}
	}
`;

export const UPDATE_ORG_BUDGET_CATEGORY = gql`
	mutation updateOrgBudgetCategory($id: ID!, $input: BudgetCategoryOrganizationInput) {
		updateOrgBudgetCategory(id: $id, input: $input) {
			id
			name
			code
			description
			deleted
			project_id {
				name
				id
			}
		}
	}
`;

export const CREATE_BUDGET_SUB_TARGET = gql`
	mutation createBudgetSubTarget($input: createBudgetSubTargetInput!) {
		createBudgetSubTarget(input: $input) {
			budgetSubTarget {
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
				geo_region_id {
					id
					name
				}
			}
		}
	}
`;

export const UPDATE_BUDGET_SUB_TARGET = gql`
	mutation updateBudgetSubTarget($input: updateBudgetSubTargetInput!) {
		updateBudgetSubTarget(input: $input) {
			budgetSubTarget {
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

export const CREATE_PROJECT_WITH_BUDGET_TARGET = gql`
	mutation createProjectWithBudgetTarget($input: createProjectWithBudgetTargetInput!) {
		createProjectWithBudgetTarget(input: $input) {
			projectWithBudgetTarget {
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
			}
		}
	}
`;
