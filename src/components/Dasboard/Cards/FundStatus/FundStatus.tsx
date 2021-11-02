import { useLazyQuery } from "@apollo/client";
import { Grid, Box, Typography } from "@material-ui/core";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import {
	GET_PROJECT_AMOUNT_RECEIVED,
	GET_PROJECT_AMOUNT_SPEND,
	GET_PROJECT_BUDGET_AMOUNT,
} from "../../../../graphql/project";
import { IFunds } from "./models/funds";
import { useIntl } from "react-intl";
import { ChartBullet, ChartThemeColor } from "@patternfly/react-charts";

// import { PieDataFormat } from "../../../../models/charts/pie/datatypes";
// import { DoughnutChart } from "../../../Charts";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		marginTop: theme.spacing(3),
	},
	fundTextIcon: {
		height: "12px",
	},
	txt: {
		fontSize: "12px",
		marginRight: "5px",
	},
}));

export default function FundStatus() {
	const intl = useIntl();

	const receivedLabel = intl.formatMessage({
		id: "receivedFundStatusCard",
		defaultMessage: "Received",
		description: `This text will be show on dashboard fund status card for fund Received`,
	});

	const approvedLabel = intl.formatMessage({
		id: "approvedFundStatusCard",
		defaultMessage: "Approved",
		description: `This text will be show on dashboard fund status card for fund approved`,
	});

	const spendLabel = intl.formatMessage({
		id: "spentFundStatusCard",
		defaultMessage: "Spent",
		description: `This text will be show on dashboard fund status card for fund spenty`,
	});

	const fundstatusLabel = intl.formatMessage({
		id: "FundStatusBulletTitle",
		defaultMessage: "Fund Status",
		description: `This text will be show on dashboard fund status card for fund status bullet chart on hover`,
	});

	/*
	const totalLabel = intl.formatMessage({
		id: "FundStatusTotalTitle",
		defaultMessage: "Total",
		description: `This text will be show on dashboard fund status card for total bullet chart`,
	});
 */

	const createFundDetails = (
		amountApproved: number,
		amountSpend: number,
		amountReceived: number,
		theme: Theme
	) => {
		const FUNDS_APPROVED: IFunds = {
			name: approvedLabel,
			amountToShow: undefined,
			color: theme.palette.error.dark,
		};

		const FUNDS_SPENT: IFunds = {
			name: spendLabel,
			amountToShow: undefined,
			color: theme.palette.success.main,
		};

		const FUNDS_RECEIVED: IFunds = {
			name: receivedLabel,
			amountToShow: undefined,
			color: theme.palette.grey[200],
		};

		/* const TOTAL_FUNDS: IFunds = {
			name: totalLabel,
			amountToShow: undefined,
			color: theme.palette.info.main,
		}; */

		// let pieData = {
		// 	labels: ["Approved", "Spend", "Received"],
		// 	datasets: [
		// 		{
		// 			backgroundColor: [
		// 				FUNDS_APPROVED.color,
		// 				FUNDS_SPENT.color,
		// 				FUNDS_RECEIVED.color,
		// 			],
		// 			data: [amountApproved, amountSpend, amountReceived],
		// 		},
		// 	],
		// };

		let BulletChartConfig = {
			comparativeErrorMeasureData: [{ name: approvedLabel, y: amountApproved }],
			primarySegmentedMeasureData: [{ name: spendLabel, y: amountSpend }],
			qualitativeRangeData: [
				{ name: "", y: 0 },
				{ name: receivedLabel, y: amountReceived },
			],
		};

		/*let totalAmount = amountApproved + amountSpend + amountReceived; */
		let details = [
			{
				...FUNDS_APPROVED,
				amountToShow:
					amountApproved > 999
						? (amountApproved / 1000).toFixed(1) + "K"
						: amountApproved + "",
				originalAmount: amountApproved,
			},
			{
				...FUNDS_RECEIVED,
				amountToShow:
					amountReceived > 999
						? (amountReceived / 1000).toFixed(1) + "K"
						: amountReceived + "",
				originalAmount: amountReceived,
			},
			{
				...FUNDS_SPENT,
				amountToShow:
					amountSpend > 999 ? (amountSpend / 1000).toFixed(1) + "K" : amountSpend + "",
				originalAmount: amountSpend,
			},
		];

		return { details, BulletChartConfig };
	};

	const dashboardData = useDashBoardData();
	const projectId = dashboardData?.project?.id;

	const classes = useStyles();
	const theme = useTheme();

	const [FUND_DETAILS, setFUND_DETAILS] = useState<IFunds[]>();

	// console.log("fund card render");

	let [GetProjectTotalBudget, { data: ProjectTotalBudgetApproved }] = useLazyQuery(
		GET_PROJECT_BUDGET_AMOUNT
	);

	let [GetProjectTotalSpend, { data: ProjectTotalSpendAmount }] = useLazyQuery(
		GET_PROJECT_AMOUNT_SPEND
	);
	let [GetProjectTotalReceived, { data: ProjectTotalRecievedAmount }] = useLazyQuery(
		GET_PROJECT_AMOUNT_RECEIVED
	);

	let [chartData, setChartData] = useState<any>();

	useEffect(() => {
		if (!ProjectTotalBudgetApproved) return;
		if (!ProjectTotalRecievedAmount) return;
		if (!ProjectTotalSpendAmount) return;

		const amountApproved = ProjectTotalBudgetApproved.projectBudgetTargetAmountSum;
		const amountSpend = ProjectTotalSpendAmount.projBudgetTrackingsTotalSpendAmount;
		const amountReceived = ProjectTotalRecievedAmount.fundReceiptProjectTotalAmount;
		const { details, BulletChartConfig } = createFundDetails(
			amountApproved,
			amountSpend,
			amountReceived,
			theme
		);
		setChartData(BulletChartConfig);
		setFUND_DETAILS(details);
	}, [ProjectTotalBudgetApproved, ProjectTotalSpendAmount, ProjectTotalRecievedAmount]);

	useEffect(() => {
		ProjectTotalBudgetApproved = ProjectTotalSpendAmount = ProjectTotalRecievedAmount = undefined;
		setFUND_DETAILS(undefined);

		if (projectId === undefined || projectId === null) return;
		GetProjectTotalBudget({ variables: { filter: { project: projectId } } });
		GetProjectTotalSpend({ variables: { filter: { project: projectId } } });
		GetProjectTotalReceived({ variables: { filter: { project: projectId } } });
	}, [projectId]);

	if (!ProjectTotalBudgetApproved || !ProjectTotalSpendAmount || !ProjectTotalRecievedAmount)
		return (
			<>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
			</>
		);
	// console.log("FUND_DETAILS", FUND_DETAILS);
	return (
		<Grid className={classes.root}>
			<ChartBullet
				ariaTitle={fundstatusLabel}
				comparativeErrorMeasureData={chartData?.comparativeErrorMeasureData}
				labels={({ datum }) => `${datum.name}: ${datum.y}`}
				padding={{
					left: 50, // Adjusted to accommodate labels
					right: 50,
					bottom: 115,
				}}
				primarySegmentedMeasureData={chartData?.primarySegmentedMeasureData}
				height={33}
				themeColor={ChartThemeColor.green}
				qualitativeRangeData={chartData?.qualitativeRangeData}
			/>
			<Grid container spacing={0} direction="row">
				{FUND_DETAILS?.map((fund, index) => (
					<Grid item xs={6} container={true} key={fund.name}>
						{/* <Box m={0} width="100%" display="inline"> */}
						<Box display="flex" alignItems="center">
							<FiberManualRecordIcon
								className={classes.fundTextIcon}
								style={{ color: fund.color }}
							/>
							<Box display="flex">
								<Typography className={classes.txt} variant="subtitle1">
									{fund.amountToShow}
								</Typography>
								<Typography className={classes.txt} variant="subtitle1">
									{fund.name}
								</Typography>
							</Box>
						</Box>
						{/* </Box> */}
					</Grid>
				))}

				{/* <Grid item xs={6}>
					<DoughnutChart data={chartData} />
				</Grid>*/}
			</Grid>
		</Grid>
	);
}
