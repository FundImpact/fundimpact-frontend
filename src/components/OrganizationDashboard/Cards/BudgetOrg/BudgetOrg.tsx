import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100vh",
	},
}));
export default function BudgetOrgCard() {
	const classes = useStyles();
	return (
		<Box>
			<Grid container>
				<Grid item md={5} justify="center">
					<Box ml={1}>
						<Box mt={2} ml={3}>
							<Typography variant="h6">2.4Cr</Typography>
						</Box>
						<Typography variant="subtitle1">Budget Target</Typography>
					</Box>
				</Grid>
				<Grid item md={7}>
					<Box ml={1} mt={1}>
						<Typography variant="caption"> 6 Project (Target Fund Received)</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={60} />
					<Box ml={1} mt={1}>
						<Typography variant="caption"> 1.2Cr Spent</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={50} color={"primary"} />
				</Grid>
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
