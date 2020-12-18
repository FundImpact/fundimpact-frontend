import { useTheme } from "@material-ui/core/styles";
import { useIntl } from "react-intl";
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
	const intl = useIntl();

	const receievedLabel = intl.formatMessage({
		id: "receievedLabel",
		defaultMessage: "Receieved",
		description: `This text will be show on organization dashboard for received Label`,
	});

	const expenditureLabel = intl.formatMessage({
		id: "expenditureLabel",
		defaultMessage: "Expenditure",
		description: `This text will be show on organization dashboard for expenditure Label`,
	});

	const spendLabel = intl.formatMessage({
		id: "spendLabel",
		defaultMessage: "Spend",
		description: `This text will be show on organization dashboard for spend Label`,
	});

	const projectLabel = intl.formatMessage({
		id: "projectLabel",
		defaultMessage: "Project",
		description: `This text will be show on organization dashboard for project Label`,
	});

	const targetLabel = intl.formatMessage({
		id: "targetLabel",
		defaultMessage: "Target",
		description: `This text will be show on organization dashboard for target Label`,
	});

	const acheievdLabel = intl.formatMessage({
		id: "acheievdLabel",
		defaultMessage: "Acheievd",
		description: `This text will be show on organization dashboard for acheievd Label`,
	});

	const donorsLabel = intl.formatMessage({
		id: "donorsLabel",
		defaultMessage: "Donors",
		description: `This text will be show on organization dashboard for donors Label`,
	});

	const allocatedLabel = intl.formatMessage({
		id: "allocatedLabel",
		defaultMessage: "Allocated",
		description: `This text will be show on organization dashboard for allocated Label`,
	});

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
				loading,
			} = GetImpactOrgStatus({
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});

			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: totalImpactProjectByOrg,
				rightUpperTitle: `${totalAchivedImpactProjectByOrg} / ${orgProjectCount} ${projectLabel}`,
				firstBarHeading: `${avgAchivementImpactByOrg}% ${props.projectCardConfig.firstBarHeading}`,
				firstBarValue: Number(avgAchivementImpactByOrg),
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				chartConfig: {
					primarySegmentedMeasureData: [
						{ name: acheievdLabel, y: achiveImpactVsTargetByOrg },
					],
					qualitativeRangeData: [],
					comparativeErrorMeasureData: [
						{ name: targetLabel, y: totalImpactProjectByOrg },
					],
				},
				loading: loading,
				tooltip: props.tooltip ? props.tooltip : "",
			};
		}
		if (props.cardOf === CARD_OF.BUDGET) {
			let {
				budgetTargetSum,
				budgetSpentValue,
				fundRecipetValuesByOrg,
				completedProjectCount,
				orgProjectCount,
				loading,
			} = GetBudgetOrgStatus({
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});
			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: abbreviateNumber(budgetTargetSum),
				rightUpperTitle: `${completedProjectCount} / ${orgProjectCount} ${projectLabel}`,
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				chartConfig: {
					primarySegmentedMeasureData: [{ name: spendLabel, y: budgetSpentValue }],
					qualitativeRangeData: [
						{ name: "", y: 0 },
						{ name: receievedLabel, y: fundRecipetValuesByOrg },
					],
					comparativeErrorMeasureData: [{ name: targetLabel, y: budgetTargetSum }],
				},
				loading: loading,
				tooltip: props.tooltip ? props.tooltip : "",
			};
		}

		if (props.cardOf === CARD_OF.DELIVERABLE) {
			let {
				achiveDeliverableVsTargetByOrg,
				avgAchivementDeliverableByOrg,
				totalAchivedProjectByOrg,
				totalDeliverableByOrg,
				orgProjectCount,
				loading,
			} = GetDeliverableOrgStatus({
				variables: { filter: { organization: organization } },
				fetchPolicy: "cache-and-network",
			});

			projectCardConfig = {
				title: props.projectCardConfig.title,
				mainHeading: totalDeliverableByOrg,
				rightUpperTitle: `${totalAchivedProjectByOrg} / ${orgProjectCount} ${projectLabel}`,
				firstBarHeading: `${avgAchivementDeliverableByOrg}% ${props.projectCardConfig.firstBarHeading}`,
				firstBarValue: Number(avgAchivementDeliverableByOrg),
				secondBarHeading: props.projectCardConfig.secondBarHeading,
				chartConfig: {
					primarySegmentedMeasureData: [
						{ name: acheievdLabel, y: achiveDeliverableVsTargetByOrg },
					],
					qualitativeRangeData: [],
					comparativeErrorMeasureData: [{ name: targetLabel, y: totalDeliverableByOrg }],
				},
				loading: loading,
				tooltip: props.tooltip ? props.tooltip : "",
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
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});
			pieCardConfig.loading = loading;
			fetchedData = data;
		}
		if (props.cardOf === CARD_OF.DELIVERABLE) {
			let { data, loading } = GetDeliverableCategory(props.currentFilter?.base, {
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});
			pieCardConfig.loading = loading;
			fetchedData = data;
		}
		if (props.cardOf === CARD_OF.IMPACT) {
			let { data, loading } = GetImpactCategory(props.currentFilter?.base, {
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});
			pieCardConfig.loading = loading;
			fetchedData = data;
		}
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
				fetchPolicy: "cache-and-network",
			});

			budgetProject.expenditure?.forEach((expData: ProgressCardResponse) => {
				progressCardConfig.dataToDisplay.push({
					...expData,
					avg_value: expData.avg_value,
					avg_value_two: 0,
					label: expenditureLabel,
					labelTwo: receievedLabel,
				});
			});

			progressCardConfig.dataToDisplay.forEach(
				(displayData: ProgressCardResponse, index: number) => {
					budgetProject.allocation?.forEach((allData: ProgressCardResponse) => {
						if (allData.project_id === displayData.project_id) {
							displayData.avg_value_two = allData.avg_value;
						}
					});
				}
			);

			progressCardConfig.loading = loading;
		}
		if (props.cardOf === CARD_OF.DELIVERABLE) {
			let { deliverableAchieved } = GetDeliverableProjects({
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});
			progressCardConfig.dataToDisplay = deliverableAchieved;
		}
		if (props.cardOf === CARD_OF.IMPACT) {
			let { impactAchieved } = GetImpactProjects({
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});
			progressCardConfig.dataToDisplay = impactAchieved;
		}
		if (props.cardOf === CARD_OF.DONOR) {
			let { data: donors } = GetDonors(props.currentFilter?.base, {
				variables: {
					filter: { organization: organization },
				},
				fetchPolicy: "cache-and-network",
			});

			donors.allocation?.forEach((allData: ProgressCardResponse) => {
				progressCardConfig.dataToDisplay.push({
					...allData,
					sum: 0,
					sum_two: allData.sum,
				});
			});

			progressCardConfig.dataToDisplay.forEach(
				(displayData: ProgressCardResponse, index: number) => {
					donors.received?.forEach((recData: ProgressCardResponse) => {
						if (recData.id === displayData.id) {
							displayData.sum = recData.sum;
						}
					});
				}
			);

			progressCardConfig.noBarDisplayTitle = [donorsLabel, receievedLabel, allocatedLabel];
			progressCardConfig.noBarDisplay = true;
		}
	}

	return {
		projectCardConfig,
		pieCardConfig,
		progressCardConfig,
	};
}
