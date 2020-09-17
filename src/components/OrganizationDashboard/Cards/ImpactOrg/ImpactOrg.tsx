import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
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
						<Typography variant="subtitle1">
							<FormattedMessage
								id="impactOrgCardTitle"
								defaultMessage="Impacts"
								description="This text will be show on impact org card for target title"
							/>
						</Typography>
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
			<Box mt={1}>
				<Box ml={1}>
					<Typography variant="caption">
						<FormattedMessage
							id="impactOrgCardImpactsAchieved"
							defaultMessage="Impacts Achieved"
							description="This text will be show on budget category card for impacts achieved heading"
						/>
					</Typography>
				</Box>
				<BorderLinearProgress variant="determinate" value={60} color={"secondary"} />
			</Box>
		</Box>
	);
}
