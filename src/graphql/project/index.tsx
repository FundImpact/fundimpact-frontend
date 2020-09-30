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

export const GET_PROJECT_AMOUNT_SPEND = gql`
	query getProjectBudgetTargetSpendAmount($filter: JSON) {
		projBudgetTrackingsTotalSpendAmount(where: $filter)
	}
`;

export const GET_PROJECT_AMOUNT_RECEIVED = gql`
	query getFundReceiptProjectTotalAmount($filter: JSON) {
		fundReceiptProjectTotalAmount(where: $filter)
	}
`;

export const GET_ALL_DELIVERABLES_TARGET_AMOUNT = gql`
	query getDeliverableTargetTotalAmountByProject($filter: JSON) {
		deliverableTargetTotalAmount(where: $filter)
	}
`;

export const GET_ALL_DELIVERABLES_SPEND_AMOUNT = gql`
	query getDeliverableTrackingTotalSpendAmountByProject($filter: JSON) {
		deliverableTrackingTotalSpendAmount(where: $filter)
	}
`;

export const GET_IMPACT_TARGET_SDG_COUNT = gql`
	query getImpactTargetSdgCount($filter: JSON) {
		impactTargetSdgCount(where: $filter)
	}
`;
