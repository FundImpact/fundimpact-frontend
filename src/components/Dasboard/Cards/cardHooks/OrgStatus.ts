import React from "react";
import {
	GET_ACHIVEMENT_IMPACT_VS_TARGET,
	GET_AVG_ACHIVEMENT_IMPACT,
	GET_TOTAL_ACHIEVED_IMPACT_PROJECT,
	GET_TOTAL_IMPACT_PROJECT,
	GET_BUDGET_SPEND_VALUE,
	GET_BUDGET_TARGET_SUM,
	GET_FUND_RECEIVED_VALUE,
	GET_ACHIEVED_DELIVERABLE_VS_TARGET,
	GET_AVG_ACHIEVEMENT_DELIVERABLE,
	GET_TOTAL_ACHIEVED_DELIVERABLE_PROJECT,
	GET_TOTAL_DELIVERABLE,
} from "../../../../graphql/organizationDashboard/query";
import { useQuery } from "@apollo/client";

export function GetImpactOrgStatus(filter: { variables: { filter: object } }) {
	let { data: achiveImpactVsTargetByOrg } = useQuery(GET_ACHIVEMENT_IMPACT_VS_TARGET, filter);
	let { data: avgAchivementImpactByOrg } = useQuery(GET_AVG_ACHIVEMENT_IMPACT, filter);
	let { data: totalAchivedImpactProjectByOrg } = useQuery(
		GET_TOTAL_ACHIEVED_IMPACT_PROJECT,
		filter
	);
	let { data: totalImpactProjectByOrg } = useQuery(GET_TOTAL_IMPACT_PROJECT, filter);

	return {
		achiveImpactVsTargetByOrg: achiveImpactVsTargetByOrg
			? achiveImpactVsTargetByOrg.achiveImpactVsTargetByOrg
			: 0,
		avgAchivementImpactByOrg: avgAchivementImpactByOrg
			? avgAchivementImpactByOrg.avgAchivementImpactByOrg
			: 0,
		totalAchivedImpactProjectByOrg: totalAchivedImpactProjectByOrg
			? totalAchivedImpactProjectByOrg.totalAchivedImpactProjectByOrg
			: 0,
		totalImpactProjectByOrg: totalImpactProjectByOrg
			? totalImpactProjectByOrg.totalImpactProjectByOrg
			: 0,
	};
}

export function GetDeliverableOrgStatus(filter: { variables: { filter: object } }) {
	let { data: achiveDeliverableVsTargetByOrg } = useQuery(
		GET_ACHIEVED_DELIVERABLE_VS_TARGET,
		filter
	);
	let { data: avgAchivementDeliverableByOrg } = useQuery(GET_AVG_ACHIEVEMENT_DELIVERABLE, filter);
	let { data: totalAchivedProjectByOrg } = useQuery(
		GET_TOTAL_ACHIEVED_DELIVERABLE_PROJECT,
		filter
	);
	let { data: totalDeliverableByOrg } = useQuery(GET_TOTAL_DELIVERABLE, filter);

	return {
		achiveDeliverableVsTargetByOrg: achiveDeliverableVsTargetByOrg
			? achiveDeliverableVsTargetByOrg.achiveDeliverableVsTargetByOrg
			: 0,
		avgAchivementDeliverableByOrg: avgAchivementDeliverableByOrg
			? avgAchivementDeliverableByOrg.avgAchivementDeliverableByOrg
			: 0,
		totalAchivedProjectByOrg: totalAchivedProjectByOrg
			? totalAchivedProjectByOrg.totalAchivedProjectByOrg
			: 0,

		totalDeliverableByOrg: totalDeliverableByOrg
			? totalDeliverableByOrg.totalDeliverableByOrg
			: 0,
	};
}

export function GetBudgetOrgStatus(filter: { variables: { filter: object } }) {
	let { data: budgetSpentValue } = useQuery(GET_BUDGET_SPEND_VALUE, filter);
	let { data: budgetTargetSum } = useQuery(GET_BUDGET_TARGET_SUM, filter);
	let { data: fundRecipetValuesByOrg } = useQuery(GET_FUND_RECEIVED_VALUE, filter);
	console.log("adchavjcma cljbk", budgetTargetSum, budgetSpentValue, fundRecipetValuesByOrg);
	return {
		budgetTargetSum: budgetTargetSum?.budgetTargetSum,
		budgetSpentValue: budgetSpentValue?.budgetSpentValue,
		fundRecipetValuesByOrg: fundRecipetValuesByOrg?.fundRecipetValuesByOrg,
	};
}
