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
	GET_BUDGET_CATEGORY_EXPENDITURE,
	GET_BUDGET_CATEGORY_TARGET,
	GET_DELIVERABLE_CATEGORY_ACHIEVED,
	GET_DELIVERABLE_CATEGORY_PROJECT,
	GET_IMPACT_CATEGORY_ACHIEVED,
	GET_IMPACT_CATEGORY_PROJECT,
	GET_COMPLETED_BUDGET_COUNT,
	GET_PROJECT_COUNT,
} from "../../../../graphql/organizationDashboard/query";
import { useQuery } from "@apollo/client";

export function GetImpactOrgStatus(queryFilter: {
	variables: { filter: object };
	fetchPolicy: "cache-and-network";
}) {
	let { data: achiveImpactVsTargetByOrg, loading: achiveImpactVsTargetByOrgLoading } = useQuery(
		GET_ACHIVEMENT_IMPACT_VS_TARGET,
		queryFilter
	);
	let { data: avgAchivementImpactByOrg, loading: avgAchivementImpactByOrgLoading } = useQuery(
		GET_AVG_ACHIVEMENT_IMPACT,
		queryFilter
	);
	let {
		data: totalAchivedImpactProjectByOrg,
		loading: totalAchivedImpactProjectByOrgLoading,
	} = useQuery(GET_TOTAL_ACHIEVED_IMPACT_PROJECT, queryFilter);

	let { data: totalImpactProjectByOrg, loading: totalImpactProjectByOrgLoading } = useQuery(
		GET_TOTAL_IMPACT_PROJECT,
		queryFilter
	);

	let { data: orgProjectCount, loading: orgProjectCountLoading } = useQuery(GET_PROJECT_COUNT);

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
		orgProjectCount: orgProjectCount ? orgProjectCount.orgProjectCount : 0,
		loading:
			orgProjectCountLoading ||
			totalImpactProjectByOrgLoading ||
			totalImpactProjectByOrgLoading ||
			achiveImpactVsTargetByOrgLoading ||
			avgAchivementImpactByOrgLoading,
	};
}

export function GetDeliverableOrgStatus(queryFilter: {
	variables: { filter: object };
	fetchPolicy: "cache-and-network";
}) {
	let {
		data: achiveDeliverableVsTargetByOrg,
		loading: achiveDeliverableVsTargetByOrgLoading,
	} = useQuery(GET_ACHIEVED_DELIVERABLE_VS_TARGET, queryFilter);

	let {
		data: avgAchivementDeliverableByOrg,
		loading: avgAchivementDeliverableByOrgLoading,
	} = useQuery(GET_AVG_ACHIEVEMENT_DELIVERABLE, queryFilter);

	let { data: totalAchivedProjectByOrg, loading: totalAchivedProjectByOrgLoading } = useQuery(
		GET_TOTAL_ACHIEVED_DELIVERABLE_PROJECT,
		queryFilter
	);

	let { data: totalDeliverableByOrg, loading: totalDeliverableByOrgLoading } = useQuery(
		GET_TOTAL_DELIVERABLE,
		queryFilter
	);

	let { data: orgProjectCount, loading: orgProjectCountLoading } = useQuery(GET_PROJECT_COUNT);

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
		orgProjectCount: orgProjectCount ? orgProjectCount.orgProjectCount : 0,
		loading:
			orgProjectCountLoading ||
			totalDeliverableByOrgLoading ||
			totalAchivedProjectByOrgLoading ||
			avgAchivementDeliverableByOrgLoading ||
			achiveDeliverableVsTargetByOrgLoading,
	};
}

export function GetBudgetOrgStatus(queryFilter: {
	variables: { filter: object };
	fetchPolicy: "cache-and-network";
}) {
	let { data: budgetSpentValue, loading: budgetSpentValueLoading } = useQuery(
		GET_BUDGET_SPEND_VALUE,
		queryFilter
	);

	let { data: budgetTargetSum, loading: budgetTargetSumLoading } = useQuery(
		GET_BUDGET_TARGET_SUM,
		queryFilter
	);

	let { data: fundRecipetValuesByOrg, loading: fundRecipetValuesByOrgLoading } = useQuery(
		GET_FUND_RECEIVED_VALUE,
		queryFilter
	);

	let { data: completedProjectCount, loading: completedProjectCountLoading } = useQuery(
		GET_COMPLETED_BUDGET_COUNT,
		queryFilter
	);

	let { data: orgProjectCount, loading: orgProjectCountLoading } = useQuery(GET_PROJECT_COUNT);
	return {
		budgetTargetSum: budgetTargetSum ? budgetTargetSum.budgetTargetSum : 0,
		budgetSpentValue: budgetSpentValue ? budgetSpentValue.budgetSpentValue : 0,
		fundRecipetValuesByOrg: fundRecipetValuesByOrg
			? fundRecipetValuesByOrg.fundRecipetValuesByOrg
			: 0,
		completedProjectCount: completedProjectCount
			? completedProjectCount.completedProjectCount
			: 0,
		orgProjectCount: orgProjectCount ? orgProjectCount.orgProjectCount : 0,
		loading:
			budgetSpentValueLoading ||
			fundRecipetValuesByOrgLoading ||
			budgetTargetSumLoading ||
			orgProjectCountLoading ||
			completedProjectCountLoading,
	};
}

export function GetBudgetProjects(queryFilter: {
	variables: { filter: object };
	fetchPolicy: "cache-and-network";
}) {
	let { data: projectExpenditureValue, loading } = useQuery(
		GET_BUDGET_PROJECTS_BY_EXPENDITURE,
		queryFilter
	);
	let { data: projectAllocationValue, loading: projectAllcoationLoading } = useQuery(
		GET_BUDGET_PROJECTS_BY_ALLOCATION,
		queryFilter
	);

	return {
		data: {
			expenditure: projectExpenditureValue?.projectExpenditureValue,
			allocation: projectAllocationValue?.projectAllocationValue,
		},
		loading: projectAllcoationLoading || loading,
	};
}

export function GetDeliverableProjects(queryFilter: {
	variables: { filter: object };
	fetchPolicy: "cache-and-network";
}) {
	let { data: deliverableAchieved } = useQuery(GET_DELIVERABLE_PROJECTS_ACHIEVED, queryFilter);

	return {
		deliverableAchieved: deliverableAchieved?.deliverableAchieved,
	};
}

export function GetImpactProjects(queryFilter: {
	variables: { filter: object };
	fetchPolicy: "cache-and-network";
}) {
	let { data: impactAchieved } = useQuery(GET_IMPACTS_PROJECTS_ACHIEVED, queryFilter);

	return {
		impactAchieved: impactAchieved?.impactAchieved,
	};
}

export function GetDonors(
	filter: string | undefined,
	queryFilter: { variables: { filter: object }; fetchPolicy: "cache-and-network" }
) {
	let { data: donorsAllocationValue } = useQuery(GET_DONOR_BY_FUND_ALLOCATED, queryFilter);
	let { data: donorsRecievedValue } = useQuery(GET_DONOR_BY_FUND_RECEIVED, queryFilter);
	return {
		data: {
			received: donorsRecievedValue?.donorsRecievedValue,
			allocation: donorsAllocationValue?.donorsAllocationValue,
		},
	};
}

export function GetBudgetCategories(
	filter: string | undefined,
	queryFilter: { variables: { filter: object }; fetchPolicy: "cache-and-network" }
) {
	let { data: budgetCategoryTarget, loading: budgetCategoryTargetLoading } = useQuery(
		GET_BUDGET_CATEGORY_TARGET,
		queryFilter
	);
	let { data: budgetCategoryExpenditure, loading: budgetCategoryExpenditureLoading } = useQuery(
		GET_BUDGET_CATEGORY_EXPENDITURE,
		queryFilter
	);

	return {
		data:
			budgetCategoryTarget && filter === "Allocation"
				? budgetCategoryTarget.budgetCategoryTarget
				: budgetCategoryExpenditure && filter === "Expenditure"
				? budgetCategoryExpenditure.budgetCategoryExpenditure
				: null,
		loading: budgetCategoryTargetLoading || budgetCategoryExpenditureLoading,
	};
}

export function GetDeliverableCategory(
	filter: string | undefined,
	queryFilter: { variables: { filter: object }; fetchPolicy: "cache-and-network" }
) {
	let {
		data: deliverableCategoryProjectCount,
		loading: deliverableCategoryProjectCountLoading,
	} = useQuery(GET_DELIVERABLE_CATEGORY_PROJECT, queryFilter);

	let {
		data: deliverableCategoryAchievedTarget,
		loading: deliverableCategoryAchievedTargetLoading,
	} = useQuery(GET_DELIVERABLE_CATEGORY_ACHIEVED, queryFilter);

	return {
		data:
			deliverableCategoryProjectCount && filter === "Projects"
				? deliverableCategoryProjectCount.deliverableCategoryProjectCount
				: deliverableCategoryAchievedTarget && filter === "Achieved"
				? deliverableCategoryAchievedTarget.deliverableCategoryAchievedTarget
				: null,
		loading: deliverableCategoryProjectCountLoading || deliverableCategoryAchievedTargetLoading,
	};
}

export function GetImpactCategory(
	filter: string | undefined,
	queryFilter: { variables: { filter: object }; fetchPolicy: "cache-and-network" }
) {
	let { data: impactCategoryProjectCount, loading: impactCategoryProjectCountLoading } = useQuery(
		GET_IMPACT_CATEGORY_PROJECT,
		queryFilter
	);
	let {
		data: impactCategoryAchievedValue,
		loading: impactCategoryAchievedValueLoading,
	} = useQuery(GET_IMPACT_CATEGORY_ACHIEVED, queryFilter);

	return {
		data:
			impactCategoryProjectCount && filter === "Projects"
				? impactCategoryProjectCount.impactCategoryProjectCount
				: impactCategoryAchievedValue && filter === "Achieved"
				? impactCategoryAchievedValue.impactCategoryAchievedValue
				: null,
		loading: impactCategoryProjectCountLoading || impactCategoryAchievedValueLoading,
	};
}
