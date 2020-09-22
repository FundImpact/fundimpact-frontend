import { gql } from "@apollo/client";

export const GET_TOTAL_IMPACT_PROJECT = gql`
	query getTotalImpactProjectByOrg($filter: JSON) {
		totalImpactProjectByOrg(where: $filter)
	}
`;

export const GET_TOTAL_ACHIEVED_IMPACT_PROJECT = gql`
	query getTotalAchivedImpactProjectByOrg($filter: JSON) {
		totalAchivedImpactProjectByOrg(where: $filter)
	}
`;

export const GET_AVG_ACHIVEMENT_IMPACT = gql`
	query getAvgAchivementImpactByOrg($filter: JSON) {
		avgAchivementImpactByOrg(where: $filter)
	}
`;

export const GET_ACHIVEMENT_IMPACT_VS_TARGET = gql`
	query getAchiveImpactVsTargetByOrg($filter: JSON) {
		achiveImpactVsTargetByOrg(where: $filter)
	}
`;

export const GET_BUDGET_TARGET_SUM = gql`
	query getBudgetTargetSum($filter: JSON) {
		budgetTargetSum(where: $filter)
	}
`;

export const GET_BUDGET_SPEND_VALUE = gql`
	query getBudgetSpentValue($filter: JSON) {
		budgetSpentValue(where: $filter)
	}
`;

export const GET_FUND_RECEIVED_VALUE = gql`
	query getFundRecipetValuesByOrg($filter: JSON) {
		fundRecipetValuesByOrg(where: $filter)
	}
`;

export const GET_TOTAL_DELIVERABLE = gql`
	query getTotalDeliverableByOrg($filter: JSON) {
		totalDeliverableByOrg(where: $filter)
	}
`;

export const GET_ACHIEVED_DELIVERABLE_VS_TARGET = gql`
	query getAchiveDeliverableVsTargetByOrg($filter: JSON) {
		achiveDeliverableVsTargetByOrg(where: $filter)
	}
`;

export const GET_AVG_ACHIEVEMENT_DELIVERABLE = gql`
	query getAvgAchivementDeliverableByOrg($filter: JSON) {
		avgAchivementDeliverableByOrg(where: $filter)
	}
`;

export const GET_TOTAL_ACHIEVED_DELIVERABLE_PROJECT = gql`
	query getTotalAchivedProjectByOrg($filter: JSON) {
		totalAchivedProjectByOrg(where: $filter)
	}
`;
