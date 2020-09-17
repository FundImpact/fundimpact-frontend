import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";

export default function ImpactOrgCard() {
	return (
		<Box>
			<Grid container>
				<Grid item md={5} justify="center">
					<Box ml={1}>
						<Box mt={2} ml={2}>
							<Typography variant="h6">256</Typography>
						</Box>
						<Typography variant="subtitle2">Impacts</Typography>
					</Box>
				</Grid>
				<Grid item md={7}>
					<Box ml={1} mt={1}>
						<Typography variant="caption"> 8 Project (Target Achieved)</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={40} />
					<Box ml={1} mt={1}>
						<Typography variant="caption">60% Avg. Progress</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={60} color={"primary"} />
				</Grid>
			</Grid>
			<Box mt={2}>
				<Box ml={1}>
					<Typography variant="caption">Impacts Achieved</Typography>
				</Box>
				<BorderLinearProgress variant="determinate" value={60} color={"secondary"} />
			</Box>
		</Box>
	);
}
