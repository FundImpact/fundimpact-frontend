import React from "react";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { Box, Typography, Grid } from "@material-ui/core";
import PieCharts from "../../../Charts/Pie/PieChart";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100vh",
	},
	fundTextIcon: {
		marginRight: theme.spacing(1),
		fontSize: 15,
	},
}));

const funds = [
	{ name: "approved", percentage: 100, amount: "10k" },
	{ name: "spent", percentage: 60, amount: "6k" },
	{ name: "received", percentage: 40, amount: "4k" },
];
export default function FundStatus() {
	let mycolor: string;
	const classes = useStyles();
	const theme = useTheme();
	return (
		<Box mt={1} className={classes.root}>
			<Grid container spacing={0} direction="row">
				<Grid item xs={5}>
					{funds.map((fund, index) => {
						if (index === 2) mycolor = theme.palette.secondary.main;
						if (index === 1) mycolor = theme.palette.primary.main;
						if (index === 0) mycolor = theme.palette.grey[200];
						return (
							<Box m={0} display="inline" key={index}>
								<Typography variant="subtitle1">
									<FiberManualRecordIcon
										className={classes.fundTextIcon}
										style={{ color: mycolor }}
									/>
									{`${fund.amount} ${fund.name}`}
								</Typography>
							</Box>
						);
					})}
				</Grid>
				<Grid item xs={7}>
					<PieCharts />
				</Grid>
			</Grid>
		</Box>
	);
}
