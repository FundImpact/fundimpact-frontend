import { useTheme } from "@material-ui/core/styles";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import {
	CardProps,
	CategoryDataResponse,
	PieCardConfig,
	ProgressCardConfig,
	ProgressCardResponse,
	ProjectCardConfig,
} from "../../../../models/cards/cards";
import { ChartDataset } from "../../../../models/charts/pie/datatypes";
import { abbreviateNumber, getMyColor } from "../../../../utils";
import { CARD_OF, CARD_TYPES } from "../constants";
import {
	GetBudgetCategories,
	GetBudgetOrgStatus,
	GetBudgetProjects,
	GetDeliverableCategory,
	GetDeliverableOrgStatus,
	GetDeliverableProjects,
	GetDonors,
	GetImpactCategory,
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
		rightUpperTitle: "",
		chartConfig: {
			primarySegmentedMeasureData: [],
			qualitativeRangeData: [],
			comparativeErrorMeasureData: [],
		},
	};
	let pieCardConfig: PieCardConfig = {
		loading: true,
		pieData: {
			datasets: [
				{
					backgroundColor: [],
				},
			],
		},
		moreButtonLink: "",
	};
	let progressCardConfig: ProgressCardConfig = {
		dataToDisplay: [],
		dialogTitle: props.title,
		dialogFilterTitle: props.currentFilter?.label,
	};

	if (props.type === CARD_TYPES.PROJECT) {
		if (props.cardOf === CARD_OF.IMPACT) {
			let {
				achiveImpactVsTargetByOrg,
				avgAchivementImpactByOrg,
				totalAchivedImpactProjectByOrg,
				totalImpactProjectByOrg,
				orgProjectCount,
			} = GetImpactOrgStatus({ variables: { filter: { organization: organization } } });

			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: totalImpactProjectByOrg,
				rightUpperTitle: `${totalAchivedImpactProjectByOrg} / ${orgProjectCount} Project`,
				firstBarHeading: `${avgAchivementImpactByOrg}% ${props.projectCardConfig.firstBarHeading}`,
				firstBarValue: Number(avgAchivementImpactByOrg),
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				chartConfig: {
					primarySegmentedMeasureData: [
						{ name: "Achieved", y: achiveImpactVsTargetByOrg },
					],
					qualitativeRangeData: [],
					comparativeErrorMeasureData: [{ name: "Target", y: totalImpactProjectByOrg }],
				},
			};
		}
		if (props.cardOf === CARD_OF.BUDGET) {
			let {
				budgetTargetSum,
				budgetSpentValue,
				fundRecipetValuesByOrg,
				completedProjectCount,
				orgProjectCount,
			} = GetBudgetOrgStatus({
				variables: { filter: { organization: organization } },
			});
			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: abbreviateNumber(budgetTargetSum),
				rightUpperTitle: `${completedProjectCount} / ${orgProjectCount} Project`,
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				chartConfig: {
					primarySegmentedMeasureData: [{ name: "Spend", y: budgetSpentValue }],
					qualitativeRangeData: [{ name: "Received", y: fundRecipetValuesByOrg }],
					comparativeErrorMeasureData: [{ name: "Target", y: budgetTargetSum }],
				},
			};
		}

		if (props.cardOf === CARD_OF.DELIVERABLE) {
			let {
				achiveDeliverableVsTargetByOrg,
				avgAchivementDeliverableByOrg,
				totalAchivedProjectByOrg,
				totalDeliverableByOrg,
				orgProjectCount,
			} = GetDeliverableOrgStatus({ variables: { filter: { organization: organization } } });

			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: totalDeliverableByOrg,
				rightUpperTitle: `${totalAchivedProjectByOrg} / ${orgProjectCount} Project`,
				firstBarHeading: `${avgAchivementDeliverableByOrg}% ${props.projectCardConfig.firstBarHeading}`,
				firstBarValue: Number(avgAchivementDeliverableByOrg),
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				chartConfig: {
					primarySegmentedMeasureData: [
						{ name: "Achieved", y: achiveDeliverableVsTargetByOrg },
					],
					qualitativeRangeData: [],
					comparativeErrorMeasureData: [{ name: "Target", y: totalDeliverableByOrg }],
				},
			};
		}
	}

	if (props.type === CARD_TYPES.PIE) {
		pieCardConfig.moreButtonLink = props.pieCardConfig.moreButtonLink;
		let fetchedData;
		let labels: string[] = [];
		let datasetsData: ChartDataset[] = [
			{
				data: [],
				backgroundColor: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.grey[200],
				],
			},
		];

		if (props.cardOf === CARD_OF.BUDGET) {
			let { data, loading } = GetBudgetCategories(props.currentFilter?.base, {
				variables: { filter: { organization: organization } },
			});
			pieCardConfig.loading = loading;
			fetchedData = data;
		}
		if (props.cardOf === CARD_OF.DELIVERABLE) {
			let { data, loading } = GetDeliverableCategory(props.currentFilter?.base, {
				variables: { filter: { organization: organization } },
			});
			pieCardConfig.loading = loading;
			fetchedData = data;
		}
		if (props.cardOf === CARD_OF.IMPACT) {
			let { data, loading } = GetImpactCategory(props.currentFilter?.base, {
				variables: { filter: { organization: organization } },
			});
			pieCardConfig.loading = loading;
			fetchedData = data;
		}
		console.log("fetched", fetchedData);
		if (fetchedData === 0) {
			fetchedData = [];
		}
		fetchedData?.forEach((category: CategoryDataResponse, index: number) => {
			if (index > 2) {
				datasetsData[0].backgroundColor?.push(getMyColor());
			}
			labels.push(category.name);
			datasetsData[0].data?.push(
				category.count ? Number(category.count) : category.sum ? category.sum : 0
			);
		});
		pieCardConfig.pieData.labels = labels;
		pieCardConfig.pieData.datasets = datasetsData;
	}

	if (props.type === CARD_TYPES.PROGRESS) {
		if (props.cardOf === CARD_OF.BUDGET) {
			let { data: budgetProject, loading } = GetBudgetProjects({
				variables: { filter: { organization: organization } },
			});

			budgetProject.expenditure?.forEach((expData: ProgressCardResponse) => {
				budgetProject.allocation?.forEach((allData: ProgressCardResponse) => {
					if (expData.project_id === allData.project_id) {
						progressCardConfig.dataToDisplay.push({
							...expData,
							avg_value_two: allData.avg_value,
							label: "Expenditure",
							labelTwo: "Received",
						});
					}
				});
			});
			progressCardConfig.loading = loading;
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
			let { data: donors } = GetDonors(props.currentFilter?.base, {
				variables: { filter: { organization: organization } },
			});

			donors.received?.forEach((recData: ProgressCardResponse) => {
				donors.allocation?.forEach((allData: ProgressCardResponse) => {
					if (recData.id === allData.id) {
						progressCardConfig.dataToDisplay.push({
							...recData,
							sum_two: allData.sum,
						});
					}
				});
			});

			progressCardConfig.noBarDisplayTitle = ["Donors", "Received", "Allocated"];
			progressCardConfig.noBarDisplay = true;
		}
	}

	return {
		projectCardConfig,
		pieCardConfig,
		progressCardConfig,
	};
}
