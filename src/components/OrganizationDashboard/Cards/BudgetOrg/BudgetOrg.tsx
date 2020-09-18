import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
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
						<Typography variant="subtitle1">
							<FormattedMessage
								id="BudgetOrgCardTitle"
								defaultMessage="Budget Target"
								description="This text will be show on budget org card for target title"
							/>
						</Typography>
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
					<Typography variant="caption">
						{" "}
						<FormattedMessage
							id="BudgetOrgCardFundRecieved"
							defaultMessage="Fund Received"
							description="This text will be show on budget org card for fund receievd heading"
						/>
					</Typography>
				</Box>
				<BorderLinearProgress variant="determinate" value={50} color={"secondary"} />
			</Box>
		</Box>
	);
}