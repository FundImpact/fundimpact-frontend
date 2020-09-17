import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";
import UpdateIcon from "@material-ui/icons/Update";
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
				<Grid item md={5}>
					<Box m={1}>
						<Typography variant="subtitle2" noWrap>
							{title}
						</Typography>
					</Box>
				</Grid>
				<Grid item md={7}>
					<Grid container>
						<Grid item md={9}>
							<Box mt={1}>
								<BorderLinearProgress
									variant="determinate"
									value={percentage}
									color={color}
								/>
							</Box>
						</Grid>
						<Grid item md={3}>
							<Typography variant="caption">{`${percentage} %`}</Typography>
						</Grid>
						<Grid item md={4}></Grid>
						<Grid item md={8} xs={10}>
							<Box display="flex">
								<Box mt="1" mr="1">
									<UpdateIcon color="disabled" fontSize="small" />
								</Box>
								<Typography
									variant="caption"
									color="textSecondary"
									noWrap
								>{`${date}`}</Typography>
							</Box>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
}
