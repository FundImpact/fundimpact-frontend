import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
	mutation createOrgProject($input: ProjectInput!) {
		createOrgProject(input: $input) {
			id
			name
			workspace {
				id
				name
			}
		}
	}
`;

export const UPDATE_PROJECT = gql`
	mutation updateOrgProject($id: ID!, $input: ProjectInput!) {
		updateOrgProject(id: $id, input: $input) {
			id
			name
			workspace {
				id
				name
			}
		}
	}
`;

export const GET_PROJECT_BY_ID = gql`
	query getProject($id: ID!) {
		project(id: $id) {
			id
			name
			short_name
			description
		}
	}
`;

export const GET_PROJ_DONORS = gql`
	query getProjectDonorsByDonor($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		projectDonors(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			donor {
				id
				name
			}
		}
	}
`;

export const GET_PROJECT_BUDGET_AMOUNT = gql`
	query getProjectBudgetTargetAmountSum($filter: JSON) {
		projectBudgetTargetAmountSum(where: $filter)
	}
`;

export const GET_PROJECT_TOTAL_SPENT = gql`
	query getProjectBudgetTargetAmountSum($filter: JSON) {
		projBudgetTrackingsTotalSpendAmount(where: $filter)
	}
`;

export const GET_PROJECT_TOTAL_RECIEVED = gql`
	query getProjectBudgetTargetAmountSum($filter: JSON) {
		fundReceiptProjectTotalAmount(where: $filter)
	}
`;
