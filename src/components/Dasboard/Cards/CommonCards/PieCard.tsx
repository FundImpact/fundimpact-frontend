import { Grid, Box, Typography } from "@material-ui/core";
import React from "react";
import { PieCardConfig } from "../../../../models/cards/cards";
import BorderLinearProgress from "../../../BorderLinearProgress";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import { PieChart } from "../../../Charts";
import MoreButton from "../../../OrganizationDashboard/Cards/MoreIconButton";

export function PieCard(pieCardConfig: PieCardConfig) {
	const { pieData, moreButtonLink } = pieCardConfig;
	return (
		<>
			<Grid item md={12}>
				<Box p={1}>
					<PieChart data={pieData} />
				</Box>
			</Grid>
			<Grid item md={12} justify="flex-end" container>
				{moreButtonLink && <MoreButton link={moreButtonLink} />}
			</Grid>
		</>
	);
}
