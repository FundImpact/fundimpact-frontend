import { Grid, Box, Typography, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import { ProjectCardConfig } from "../../../../models/cards/cards";
import BorderLinearProgress from "../../../BorderLinearProgress";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import { Skeleton } from "@material-ui/lab";
import { ChartBullet, ChartThemeColor } from "@patternfly/react-charts";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useIntl } from "react-intl";

export function ProjectCard(projectCardConfig: ProjectCardConfig) {
	const { chartConfig, tooltip } = projectCardConfig;
	const intl = useIntl();
	if (projectCardConfig.loading) {
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
	let overallLabel = intl.formatMessage({
		id: "overallLabelCards",
		defaultMessage: "Overall",
		description: "This text will be show on cards for top label",
	});
	return (
		<>
			<Grid item xs={12} container justify="flex-end">
				<Box color="text.disabled" mr={1}>
					<IconButton size="small">
						<Tooltip title={tooltip || ""}>
							<InfoOutlinedIcon fontSize="small" />
						</Tooltip>
					</IconButton>
				</Box>
			</Grid>
			<Grid item md={6} justify="center" container>
				<Box ml={1}>
					<Box mt={2} ml={3}>
						<Typography variant="h6">{projectCardConfig.mainHeading}</Typography>
					</Box>
					{projectCardConfig.title && (
						<Typography variant="subtitle1" noWrap>
							{projectCardConfig.title}
						</Typography>
					)}
				</Box>
			</Grid>
			<Grid item md={5}>
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
				{projectCardConfig.firstBarValue ? (
					<>
						<Box ml={1} mt={2}>
							{projectCardConfig.firstBarHeading && (
								<Typography variant="caption" noWrap>
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
					</>
				) : null}
			</Grid>

			<Grid item md={12}>
				<Box
					style={{ height: "60px", width: "100%" }}
					mt={projectCardConfig.firstBarValue ? 2 : 3}
				>
					<ChartBullet
						ariaTitle={projectCardConfig.secondBarHeading}
						comparativeErrorMeasureData={chartConfig?.comparativeErrorMeasureData}
						labels={({ datum }: { datum: { name: string; y: string } }) =>
							`${datum.name}: ${datum.y}`
						}
						padding={{
							left: 10,
							right: 10,
							bottom: 100,
						}}
						primarySegmentedMeasureData={chartConfig?.primarySegmentedMeasureData}
						height={100}
						themeColor={ChartThemeColor.green}
						qualitativeRangeData={chartConfig?.qualitativeRangeData}
					/>
				</Box>
			</Grid>
		</>
	);
}
