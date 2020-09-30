import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";
export default function CommonProgress({
	title,
	date,
	percentage,
	color = "primary",
	noBarDisplay = false,
}: {
	title: string;
	date: string;
	percentage: number;
	color?: "primary" | "secondary";
	noBarDisplay?: boolean;
}) {
	return (
		<Grid container>
			<Grid item md={5}>
				<Box m={1} mt={0}>
					<Typography variant="subtitle2" noWrap>
						{title}
					</Typography>
				</Box>
			</Grid>
			<Grid item md={7} container>
				{!noBarDisplay && (
					<>
						<Grid item md={10}>
							<Box mt={1}>
								<BorderLinearProgress
									variant="determinate"
									value={percentage}
									color={color}
								/>
							</Box>
						</Grid>
						<Grid item md={2} container justify="flex-start">
							<Typography variant="caption">{`${percentage}%`}</Typography>
						</Grid>
					</>
				)}
				{noBarDisplay && (
					<Grid item md={11} container justify="flex-end">
						<Typography variant="subtitle2" color="secondary">{`₹
						${percentage}`}</Typography>
					</Grid>
				)}
				{/* <Grid item md={11} justify="flex-end" container>
					<Box display="flex">
						<Typography
							variant="caption"
							color="textSecondary"
							noWrap
						>{`${getLastUpdatedInWords(new Date(date))}`}</Typography>
					</Box>
				</Grid> */}
			</Grid>
		</Grid>
	);
}
