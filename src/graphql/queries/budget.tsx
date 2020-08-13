import { gql } from "@apollo/client";

export const CREATE_ORG_BUDGET_CATEGORY = gql`
	mutation createOrgBudgetCategory($input: BudgetCategoryOrganizationInput!) {
		createOrgBudgetCategory(input: $input) {
			id
			name
			code
			description
			organization {
				id
				name
			}
		}
	}
`;

export const CREATE_ORGANIZATION_CURRENCY = gql`
	mutation createOrgCurrency($input: OrganizationCurrencyInput!) {
		createOrgCurrency(input: $input) {
			id
		}
	}
`;

export const GET_ORGANIZATION_BUDGET_CATEGORY = gql`
	query getOrganizationBudgetCategory {
		orgBudgetCategory {
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
			description
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

export const GET_BUDGET_TARGET_PROJECT = gql`
	query {
		budgetTargetsProjects {
			id
			name
			organization_currency {
				currency {
					name
				}
			}
			description
			project {
				name
			}
			total_target_amount
			conversion_factor
		}
	}
`;
