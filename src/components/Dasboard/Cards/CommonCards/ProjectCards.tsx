import { Grid, Box, Typography } from "@material-ui/core";
import React from "react";
import { ProjectCardConfig } from "../../../../models/cards/cards";
import BorderLinearProgress from "../../../BorderLinearProgress";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";

export function ProjectCard(projectCardConfig: ProjectCardConfig) {
	return (
		<>
			<Grid item md={5} justify="center">
				<Box ml={1}>
					<Box mt={2} ml={3}>
						<Typography variant="h6">{projectCardConfig.mainHeading}</Typography>
					</Box>
					{projectCardConfig.title && (
						<Typography variant="subtitle1">{projectCardConfig.title}</Typography>
					)}
				</Box>
			</Grid>
			<Grid item md={7}>
				<Box ml={1} mt={2} display="flex">
					<AssignmentTurnedInIcon color="secondary" />
					<Box ml={1}>
						<Typography variant="body1" noWrap>
							{" "}
							{projectCardConfig.rightUpperTitle}
						</Typography>
					</Box>
				</Box>
				{/* <BorderLinearProgress variant="determinate" value={60} /> */}
				<Box ml={1} mt={2}>
					{projectCardConfig.firstBarHeading && (
						<Typography variant="caption">
							{" "}
							{projectCardConfig.firstBarHeading}
						</Typography>
					)}
				</Box>
				<BorderLinearProgress
					variant="determinate"
					value={projectCardConfig.firstBarValue}
					color={"primary"}
				/>
			</Grid>

			<Grid item md={12}>
				<Box ml={1} mt={2}>
					{projectCardConfig.secondBarHeading && (
						<Typography variant="caption">
							{projectCardConfig.secondBarHeading}
						</Typography>
					)}
				</Box>
				<BorderLinearProgress
					variant="determinate"
					value={projectCardConfig.secondBarValue}
					color={"secondary"}
				/>
			</Grid>
		</>
	);
}
