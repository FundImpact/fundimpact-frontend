import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";

export default function CommonProgress({
	title,
	date,
	percentage,
	color = "primary",
}: {
	title: string;
	date: string;
	percentage: number;
	color?: "primary" | "secondary";
}) {
	return (
		<Box m={1}>
			<Grid container>
				<Grid item md={3}>
					<Box m={1}>
						<Typography variant="subtitle2">{title}</Typography>
					</Box>
				</Grid>
				<Grid item md={9}>
					<Box ml={1}>
						<Typography variant="caption">{`updated at ${date}`}</Typography>
					</Box>
					<BorderLinearProgress variant="determinate" value={percentage} color={color} />
				</Grid>
			</Grid>
		</Box>
	);
}
