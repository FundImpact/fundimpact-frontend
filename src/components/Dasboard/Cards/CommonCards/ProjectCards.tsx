import { Grid, Box, Typography } from "@material-ui/core";
import React from "react";
import { ProjectCardConfig } from "../../../../models/cards/cards";
import BorderLinearProgress from "../../../BorderLinearProgress";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import { Skeleton } from "@material-ui/lab";

export function ProjectCard(projectCardConfig: ProjectCardConfig) {
	if (!projectCardConfig.mainHeading) {
		return (
			<>
				<Grid item md={5}>
					<Skeleton variant="text" animation="wave"></Skeleton>
					<Skeleton variant="text" animation="wave"></Skeleton>
				</Grid>
				<Grid item md={7}>
					<Box ml={1}>
						<Skeleton variant="text" animation="wave"></Skeleton>
						<Skeleton variant="text" animation="wave"></Skeleton>
						<Skeleton variant="text" animation="wave"></Skeleton>
						<Skeleton variant="text" animation="wave"></Skeleton>
					</Box>
				</Grid>
				<Grid item md={12}>
					<Skeleton variant="text" animation="wave"></Skeleton>
					<Skeleton variant="text" animation="wave"></Skeleton>
				</Grid>
			</>
		);
	}
	return (
		<>
			<Grid item md={5} justify="center" container>
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
