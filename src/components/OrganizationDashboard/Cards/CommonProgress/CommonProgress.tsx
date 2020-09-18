import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";
import { getLastUpdatedInWords } from "../../../../utils/index";
export default function CommonProgress({
	title,
	date,
	percentage,
	color = "primary",
	size = "xs",
}: {
	title: string;
	date: string;
	percentage: number;
	color?: "primary" | "secondary";
	size?: "xs" | "md" | "lg";
}) {
	return (
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
					<Grid item md={size === "xs" ? 4 : size === "md" ? 5 : 7}></Grid>
					<Grid item md={size === "xs" ? 8 : size === "md" ? 7 : 5}>
						<Box display="flex">
							{/* <Box mt="1" mr="1">
								<UpdateIcon color="disabled" fontSize="small" />
							</Box> */}
							<Typography
								variant="caption"
								color="textSecondary"
								noWrap
							>{`${getLastUpdatedInWords(new Date(date))}`}</Typography>
						</Box>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
