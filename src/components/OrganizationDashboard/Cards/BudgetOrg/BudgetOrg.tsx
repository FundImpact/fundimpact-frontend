import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";

export default function BudgetOrgCard() {
	return (
		<Box>
			<Grid container>
				<Grid item md={5} justify="center">
					<Box ml={1}>
						<Box mt={2} ml={3}>
							<Typography variant="h6">2.4Cr</Typography>
						</Box>
						<Typography variant="subtitle2">Budget Target</Typography>
					</Box>
				</Grid>
				<Grid item md={7}>
					<Box ml={1} mt={2} display="flex">
						<AssignmentTurnedInIcon color="secondary" />
						<Box ml={1}>
							<Typography variant="body1" noWrap>
								{" "}
								6 / 12 Project
							</Typography>
						</Box>
					</Box>
					{/* <BorderLinearProgress variant="determinate" value={60} /> */}
					<Box ml={1} mt={2}>
						<Typography variant="caption"> 1.2Cr Spent</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={50} color={"primary"} />
				</Grid>
			</Grid>
			<Box mt={2}>
				<Box ml={1}>
					<Typography variant="caption">Fund Received</Typography>
				</Box>
				<BorderLinearProgress variant="determinate" value={90} color={"secondary"} />
			</Box>
		</Box>
	);
}
