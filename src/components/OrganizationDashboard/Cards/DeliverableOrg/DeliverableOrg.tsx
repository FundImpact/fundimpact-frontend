import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import BorderLinearProgress from "../../../BorderLinearProgress";

export default function DeliverableOrgCard() {
	return (
		<Box>
			<Grid container>
				<Grid item md={5} justify="center">
					<Box ml={1}>
						<Box mt={2} ml={3}>
							<Typography variant="h6">246</Typography>
						</Box>
						<Typography variant="subtitle1">
							<FormattedMessage
								id="deliverableOrgCardTitle"
								defaultMessage="Deliverables"
								description="This text will be show on deliverable org card for target title"
							/>
						</Typography>
					</Box>
				</Grid>
				<Grid item md={7}>
					<Box ml={1} mt={1}>
						<Typography variant="caption"> 6 Project (Target Achieved)</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={60} />
					<Box ml={1} mt={1}>
						<Typography variant="caption">80% Avg. Progress</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={80} color={"primary"} />
				</Grid>
			</Grid>
			<Box mt={2}>
				<Box ml={1}>
					<Typography variant="caption">
						<FormattedMessage
							id="deliverableOrgCardDeliveranleAchieved"
							defaultMessage="Deliveranle Achieved"
							description="This text will be show on budget category card for deliveranle achieved heading"
						/>
					</Typography>
				</Box>
				<BorderLinearProgress variant="determinate" value={50} color={"secondary"} />
			</Box>
		</Box>
	);
}
