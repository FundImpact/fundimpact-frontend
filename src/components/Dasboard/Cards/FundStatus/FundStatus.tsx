import { useLazyQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../../../contexts/dashboardContext";
import {
	GET_PROJECT_AMOUNT_RECEIVED,
	GET_PROJECT_AMOUNT_SPEND,
	GET_PROJECT_BUDGET_AMOUNT,
} from "../../../../graphql/project";
import { PieDataFormat } from "../../../../models/charts/pie/datatypes";
import { DoughnutChart } from "../../../Charts";
import { IFunds } from "./models/funds";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100vh",
	},
	fundTextIcon: {
		marginRight: theme.spacing(1),
		fontSize: 15,
	},
}));

export default function FundStatus() {
	const intl = useIntl();

	const createFundDetails = (
		amountApproved: number,
		amountSpend: number,
		amountReceived: number,
		theme: Theme
	) => {
		const FUNDS_APPROVED: IFunds = {
			name: intl.formatMessage({
				id: "approvedFundStatusCard",
				defaultMessage: "Approved",
				description: `This text will be show on dashboard fund status card for fund approved`,
			}),
			amountToShow: undefined,
			color: theme.palette.grey[200],
		};

		const FUNDS_SPENT: IFunds = {
			name: intl.formatMessage({
				id: "spentFundStatusCard",
				defaultMessage: "Spent",
				description: `This text will be show on dashboard fund status card for fund spenty`,
			}),
			amountToShow: undefined,
			color: theme.palette.primary.main,
		};

		const FUNDS_RECEIVED: IFunds = {
			name: intl.formatMessage({
				id: "receivedFundStatusCard",
				defaultMessage: "Received",
				description: `This text will be show on dashboard fund status card for fund Received`,
			}),
			amountToShow: undefined,
			color: theme.palette.secondary.main,
		};

		let pieData = {
			labels: ["Approved", "Spend", "Received"],
			datasets: [
				{
					backgroundColor: [
						FUNDS_APPROVED.color,
						FUNDS_SPENT.color,
						FUNDS_RECEIVED.color,
					],
					data: [amountApproved, amountSpend, amountReceived],
				},
			],
		};

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

		return { pieData, details };
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

	let [chartData, setChartData] = useState<PieDataFormat>();

	useEffect(() => {
		if (!ProjectTotalBudgetApproved) return;
		if (!ProjectTotalRecievedAmount) return;
		if (!ProjectTotalSpendAmount) return;

		const amountApproved = ProjectTotalBudgetApproved.projectBudgetTargetAmountSum;
		const amountSpend = ProjectTotalSpendAmount.projBudgetTrackingsTotalSpendAmount;
		const amountReceived = ProjectTotalRecievedAmount.fundReceiptProjectTotalAmount;
		const { pieData, details } = createFundDetails(
			amountApproved,
			amountSpend,
			amountReceived,
			theme
		);
		setChartData(pieData);
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

	if (!FUND_DETAILS)
		return (
			<>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
			</>
		);

	return (
		<Box className={classes.root}>
			<Grid container spacing={0} direction="row">
				<Grid item xs={6} container={true} alignContent="center">
					{FUND_DETAILS.map((fund, index) => (
						<React.Fragment key={fund.name}>
							<Box m={0} width="100%" display="inline">
								<Box display="flex">
									<FiberManualRecordIcon
										className={classes.fundTextIcon}
										style={{ color: fund.color }}
									/>
									{/* {`${fund.amountToShow} ${fund.name}`} */}
									<Box display="flex">
										<Box mr={1}>
											<Typography variant="subtitle1">
												{fund.amountToShow}
											</Typography>
										</Box>
										<Typography variant="subtitle1">{fund.name}</Typography>
									</Box>
								</Box>
							</Box>
						</React.Fragment>
					))}
				</Grid>
				<Grid item xs={6}>
					<DoughnutChart data={chartData} />
				</Grid>
			</Grid>
		</Box>
	);
}
