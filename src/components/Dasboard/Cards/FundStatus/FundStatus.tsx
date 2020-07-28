import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Typography, Grid } from "@material-ui/core";
import PieCharts from "../../../Charts/Pie/PieChart";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100vh",
	},
}));

const funds = [
	{ name: "approved", percentage: 100, amount: "10k" },
	{ name: "spent", percentage: 60, amount: "6k" },
	{ name: "received", percentage: 40, amount: "4k" },
];
export default function FundStatus() {
	const classes = useStyles();
	return (
		<Box mt={1} className={classes.root}>
			<Grid container spacing={1} direction="row">
				<Grid xs={6}>
					{funds.map((fund) => {
						return (
							<Box ml={1}>
								<Typography variant="subtitle1" gutterBottom>
									{`${fund.amount} ${fund.name}`}
								</Typography>
							</Box>
						);
					})}
				</Grid>
				<Grid xs={6}>
					<PieCharts />
				</Grid>
			</Grid>
		</Box>
	);
}
