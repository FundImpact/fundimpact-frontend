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
	GET_BUDGET_PROJECTS_BY_ALLOCATION,
	GET_BUDGET_PROJECTS_BY_EXPENDITURE,
	GET_DELIVERABLE_PROJECTS_ACHIEVED,
	GET_IMPACTS_PROJECTS_ACHIEVED,
	GET_DONOR_BY_FUND_ALLOCATED,
	GET_DONOR_BY_FUND_RECEIVED,
} from "../../../../graphql/organizationDashboard/query";
import { useQuery } from "@apollo/client";

export function GetImpactOrgStatus(queryFilter: { variables: { filter: object } }) {
	let { data: achiveImpactVsTargetByOrg, loading: achiveImpactVsTargetByOrgLoading } = useQuery(
		GET_ACHIVEMENT_IMPACT_VS_TARGET,
		queryFilter
	);
	let { data: avgAchivementImpactByOrg, loading: avgAchivementImpactByOrgLoading } = useQuery(
		GET_AVG_ACHIVEMENT_IMPACT,
		queryFilter
	);
	let { data: totalAchivedImpactProjectByOrg } = useQuery(
		GET_TOTAL_ACHIEVED_IMPACT_PROJECT,
		queryFilter
	);
	let { data: totalImpactProjectByOrg } = useQuery(GET_TOTAL_IMPACT_PROJECT, queryFilter);

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

export function GetDeliverableOrgStatus(queryFilter: { variables: { filter: object } }) {
	let { data: achiveDeliverableVsTargetByOrg } = useQuery(
		GET_ACHIEVED_DELIVERABLE_VS_TARGET,
		queryFilter
	);
	let { data: avgAchivementDeliverableByOrg } = useQuery(
		GET_AVG_ACHIEVEMENT_DELIVERABLE,
		queryFilter
	);
	let { data: totalAchivedProjectByOrg } = useQuery(
		GET_TOTAL_ACHIEVED_DELIVERABLE_PROJECT,
		queryFilter
	);
	let { data: totalDeliverableByOrg } = useQuery(GET_TOTAL_DELIVERABLE, queryFilter);

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

export function GetBudgetOrgStatus(queryFilter: { variables: { filter: object } }) {
	let { data: budgetSpentValue } = useQuery(GET_BUDGET_SPEND_VALUE, queryFilter);
	let { data: budgetTargetSum } = useQuery(GET_BUDGET_TARGET_SUM, queryFilter);
	let { data: fundRecipetValuesByOrg } = useQuery(GET_FUND_RECEIVED_VALUE, queryFilter);

	return {
		budgetTargetSum: budgetTargetSum ? budgetTargetSum.budgetTargetSum : 0,
		budgetSpentValue: budgetSpentValue ? budgetSpentValue.budgetSpentValue : 0,
		fundRecipetValuesByOrg: fundRecipetValuesByOrg
			? fundRecipetValuesByOrg.fundRecipetValuesByOrg
			: 0,
	};
}

export function GetBudgetProjects(
	filter: string | undefined,
	queryFilter: { variables: { filter: object } }
) {
	let { data: projectExpenditureValue } = useQuery(
		GET_BUDGET_PROJECTS_BY_EXPENDITURE,
		queryFilter
	);
	let { data: projectAllocationValue } = useQuery(GET_BUDGET_PROJECTS_BY_ALLOCATION, queryFilter);

	return {
		data:
			projectExpenditureValue && filter === "Expenditure"
				? projectExpenditureValue.projectExpenditureValue
				: projectAllocationValue && filter === "Allocation"
				? projectAllocationValue.projectAllocationValue
				: null,
	};
}

export function GetDeliverableProjects(queryFilter: { variables: { filter: object } }) {
	let { data: deliverableAchieved } = useQuery(GET_DELIVERABLE_PROJECTS_ACHIEVED, queryFilter);

	return {
		deliverableAchieved: deliverableAchieved?.deliverableAchieved,
	};
}

export function GetImpactProjects(queryFilter: { variables: { filter: object } }) {
	let { data: impactAchieved } = useQuery(GET_IMPACTS_PROJECTS_ACHIEVED, queryFilter);

	return {
		impactAchieved: impactAchieved?.impactAchieved,
	};
}

export function GetDonors(
	filter: string | undefined,
	queryFilter: { variables: { filter: object } }
) {
	let { data: donorsAllocationValue } = useQuery(GET_DONOR_BY_FUND_ALLOCATED, queryFilter);
	let { data: donorsRecievedValue } = useQuery(GET_DONOR_BY_FUND_RECEIVED, queryFilter);
	return {
		data:
			donorsRecievedValue && filter === "Received"
				? donorsRecievedValue.donorsRecievedValue
				: donorsAllocationValue && filter === "Allocated"
				? donorsAllocationValue.donorsAllocationValue
				: null,
	};
}
