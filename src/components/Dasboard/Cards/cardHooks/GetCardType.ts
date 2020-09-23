import { useTheme } from "@material-ui/core/styles";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import {
	CardProps,
	PieCardConfig,
	ProgressCardConfig,
	ProjectCardConfig,
} from "../../../../models/cards/cards";
import { abbreviateNumber } from "../../../../utils";
import { CARD_OF, CARD_TYPES } from "../constants";
import {
	GetBudgetOrgStatus,
	GetBudgetProjects,
	GetDeliverableOrgStatus,
	GetDeliverableProjects,
	GetDonors,
	GetImpactOrgStatus,
	GetImpactProjects,
} from "./OrgDashboardQuery";

export function GetCardTypeAndValues(props: CardProps) {
	const dashboardData = useDashBoardData();
	const organization = dashboardData?.organization?.id;
	const theme = useTheme();
	let projectCardConfig: ProjectCardConfig = {
		mainHeading: "",
		title: "",
		firstBarHeading: "",
		secondBarHeading: "",
		firstBarValue: 0,
		secondBarValue: 0,
		rightUpperTitle: "",
	};
	let pieCardConfig: PieCardConfig = {
		pieData: {
			datasets: [
				{
					backgroundColor: [
						theme.palette.primary.main,
						theme.palette.secondary.main,
						theme.palette.grey[200],
					],
					data: [500, 200, 300],
				},
			],
		},
		moreButtonLink: "",
	};
	let progressCardConfig: ProgressCardConfig = {
		dataToDisplay: [],
		dialogTitle: props.title,
	};

	if (props.type === CARD_TYPES.PROJECT) {
		if (props.cardOf === CARD_OF.IMPACT) {
			let {
				achiveImpactVsTargetByOrg,
				avgAchivementImpactByOrg,
				totalAchivedImpactProjectByOrg,
				totalImpactProjectByOrg,
			} = GetImpactOrgStatus({ variables: { filter: { organization: organization } } });

			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: totalImpactProjectByOrg,
				rightUpperTitle: `${totalAchivedImpactProjectByOrg} / ${totalImpactProjectByOrg} Project`,
				firstBarHeading: `${avgAchivementImpactByOrg} % ${props.projectCardConfig.firstBarHeading}`,
				firstBarValue: Number(avgAchivementImpactByOrg),
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				secondBarValue: Number(achiveImpactVsTargetByOrg),
			};
		}
		if (props.cardOf === CARD_OF.BUDGET) {
			let { budgetTargetSum, budgetSpentValue, fundRecipetValuesByOrg } = GetBudgetOrgStatus({
				variables: { filter: { organization: organization } },
			});

			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: abbreviateNumber(budgetTargetSum),
				rightUpperTitle: `${0} / ${39} Project`,
				firstBarHeading: `${abbreviateNumber(budgetSpentValue)} ${
					props.projectCardConfig.firstBarHeading
				}`,
				firstBarValue:
					budgetSpentValue && budgetTargetSum
						? (budgetSpentValue / budgetTargetSum) * 100
						: 0,
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				secondBarValue: Number(fundRecipetValuesByOrg),
			};
		}

		if (props.cardOf === CARD_OF.DELIVERABLE) {
			let {
				achiveDeliverableVsTargetByOrg,
				avgAchivementDeliverableByOrg,
				totalAchivedProjectByOrg,
				totalDeliverableByOrg,
			} = GetDeliverableOrgStatus({ variables: { filter: { organization: organization } } });

			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: totalDeliverableByOrg,
				rightUpperTitle: `${totalAchivedProjectByOrg} / ${totalDeliverableByOrg} Project`,
				firstBarHeading: `${avgAchivementDeliverableByOrg} % ${props.projectCardConfig.firstBarHeading}`,
				firstBarValue: Number(avgAchivementDeliverableByOrg),
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				secondBarValue: Number(achiveDeliverableVsTargetByOrg),
			};
		}
	}

	if (props.type === CARD_TYPES.PIE) {
		pieCardConfig.moreButtonLink = props.pieCardConfig.moreButtonLink;
	}

	if (props.type === CARD_TYPES.PROGRESS) {
		if (props.cardOf === CARD_OF.BUDGET) {
			let { data: budgetProject } = GetBudgetProjects(props.currentFilter, {
				variables: { filter: { organization: organization } },
			});
			progressCardConfig.dataToDisplay = budgetProject;
		}
		if (props.cardOf === CARD_OF.DELIVERABLE) {
			let { deliverableAchieved } = GetDeliverableProjects({
				variables: { filter: { organization: organization } },
			});
			progressCardConfig.dataToDisplay = deliverableAchieved;
		}
		if (props.cardOf === CARD_OF.IMPACT) {
			let { impactAchieved } = GetImpactProjects({
				variables: { filter: { organization: organization } },
			});
			progressCardConfig.dataToDisplay = impactAchieved;
		}
		if (props.cardOf === CARD_OF.DONOR) {
			let { data: donors } = GetDonors(props.currentFilter, {
				variables: { filter: { organization: organization } },
			});
			progressCardConfig.dataToDisplay = donors;
		}
	}

	return {
		projectCardConfig,
		pieCardConfig,
		progressCardConfig,
	};
}
