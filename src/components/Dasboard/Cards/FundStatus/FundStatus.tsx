import { useLazyQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../../../contexts/dashboardContext";
import {
	GET_PROJECT_BUDGET_AMOUNT,
	GET_PROJECT_TOTAL_RECIEVED,
	GET_PROJECT_TOTAL_SPENT,
} from "../../../../graphql/project";
import { PieDataFormat } from "../../../../models/charts/pie/datatypes";
import PieCharts from "../../../Charts/Pie/PieChart";
import { IFUNDS } from "./models/funds";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100vh",
	},
	fundTextIcon: {
		marginRight: theme.spacing(1),
		fontSize: 15,
	},
}));

const calculateFundDetails = () => {};

export default function FundStatus() {
	let mycolor: string;
	const dashboardData = useDashBoardData();
	const projectId = dashboardData?.project?.id;

	const classes = useStyles();
	const theme = useTheme();

	const FUNDS_APPROVED: IFUNDS = {
		name: "Approved",
		amount: undefined,
		color: theme.palette.secondary.main,
	};

	const FUNDS_SPENT: IFUNDS = {
		name: "SPEND",
		amount: undefined,
		color: theme.palette.primary.main,
	};

	const FUNDS_RECEIVED: IFUNDS = {
		name: "Received",
		amount: undefined,
		color: theme.palette.grey[200],
	};
	const [FUND_DETAILS, setFUND_DETAILS] = useState<IFUNDS[]>();

	console.log("fund card render");

	let [GetProjectTotalBudget, { data: ProjectTotalBudgetApproved }] = useLazyQuery(
		GET_PROJECT_BUDGET_AMOUNT,
		{}
	);

	let [GetProjectTotalSpend, { data: ProjectTotalSpendAmount }] = useLazyQuery(
		GET_PROJECT_TOTAL_SPENT,
		{}
	);
	let [GetProjectTotalReceived, { data: ProjectTotalRecievedAmount }] = useLazyQuery(
		GET_PROJECT_TOTAL_RECIEVED,
		{}
	);

	let [chartData, setChartData] = useState<PieDataFormat>();

	useEffect(() => {
		if (ProjectTotalBudgetApproved === undefined || ProjectTotalBudgetApproved === null) return;
		if (ProjectTotalRecievedAmount === undefined || ProjectTotalRecievedAmount === null) return;
		if (ProjectTotalSpendAmount === undefined || ProjectTotalSpendAmount === null) return;
		const amountApproved = ProjectTotalBudgetApproved.projectBudgetTargetAmountSum;
		const amountSpend = ProjectTotalSpendAmount.projBudgetTrackingsTotalSpendAmount;
		const amountReceived = ProjectTotalRecievedAmount.fundReceiptProjectTotalAmount;
		console.log({
			ProjectTotalBudgetApproved,
			ProjectTotalSpendAmount,
			ProjectTotalRecievedAmount,
		});

		let pieData = {
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
		setChartData(pieData);
		let details = [
			{ ...FUNDS_APPROVED, amount: amountApproved },
			{ ...FUNDS_RECEIVED, amount: amountReceived },
			{ ...FUNDS_SPENT, amount: amountSpend },
		];
		// setFUND_DETAILS(details);
	}, [ProjectTotalBudgetApproved, ProjectTotalSpendAmount, ProjectTotalRecievedAmount]);

	useEffect(() => {
		if (projectId === undefined || projectId === null) return;

		GetProjectTotalBudget({ variables: { filter: { project: projectId } } });
		GetProjectTotalSpend({ variables: { filter: { project: projectId } } });
		GetProjectTotalReceived({ variables: { filter: { project: projectId } } });
	}, [projectId]);

	if (!FUND_DETAILS) return null;

	return (
		<Box mt={1} className={classes.root}>
			<Grid container spacing={0} direction="row">
				<Grid item xs={5}>
					{FUND_DETAILS.map((fund, index) => (
						<>
							<Box m={0} display="inline" key={fund.name}>
								<Typography variant="subtitle1">
									<FiberManualRecordIcon
										className={classes.fundTextIcon}
										style={{ color: fund.color }}
									/>
									{`${fund.amount} ${fund.name}`}
								</Typography>
							</Box>
						</>
					))}
				</Grid>
				<Grid item xs={7}>
					<PieCharts data={chartData} />
				</Grid>
			</Grid>
		</Box>
	);
}
