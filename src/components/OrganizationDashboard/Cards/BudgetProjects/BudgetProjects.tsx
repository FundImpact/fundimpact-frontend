import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100vh",
	},
}));
export default function BudgetProjectsCard() {
	const classes = useStyles();
	const [filterByExperditureOrAllocation, setFilterByExpenditureOrAllocation] = useState<
		string
	>();
	return (
		<Box>
			<Typography color="primary" gutterBottom>
				Projects By Expenditure
			</Typography>
			<Grid container>
				<Grid container>
					<Grid item md={6}>
						<Box mt={2} ml={3}>
							<Typography variant="h6">Expenditure</Typography>
						</Box>
						<Box mt={2} ml={3}>
							<Typography variant="h6">|</Typography>
						</Box>
						<Box mt={2} ml={3}>
							<Typography variant="h6">Allocation</Typography>
						</Box>
					</Grid>
					<Grid item md={6}></Grid>
				</Grid>
				{/* <Grid item md={5} justify="center">
					<Box ml={1}>
						<Box mt={2} ml={3}>
							<Typography variant="h6">2.4Cr</Typography>
						</Box>
						<Typography variant="subtitle1">Budget Target</Typography>
					</Box>
				</Grid>
				<Grid item md={7}></Grid> */}
			</Grid>
			<Box mt={1}>
				<Box ml={1}>
					<Typography variant="caption">Fund Received</Typography>
				</Box>
				<BorderLinearProgress variant="determinate" value={90} color={"secondary"} />
			</Box>
		</Box>
	);
}
