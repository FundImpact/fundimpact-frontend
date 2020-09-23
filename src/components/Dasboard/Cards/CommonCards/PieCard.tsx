import { Grid, Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { PieCardConfig } from "../../../../models/cards/cards";
import { PieChart } from "../../../Charts";
import MoreButton from "../../../OrganizationDashboard/Cards/MoreIconButton";

export function PieCard(pieCardConfig: PieCardConfig) {
	const { pieData, moreButtonLink } = pieCardConfig;
	if (!pieData) {
		return (
			<Grid item md={12}>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
			</Grid>
		);
	}
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
