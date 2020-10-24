import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, IconButton, CircularProgress } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { PROJECT_ACTIONS } from "../../Project/constants";
import Project from "../../Project/Project";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_WORKSPACES_BY_ORG, GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
import { IGET_WORKSPACES_BY_ORG } from "../../../models/workspace/query";
import { Navigate } from "react-router";

const useStyles = makeStyles((theme: Theme) => ({
	contentBox: {
		background: theme.palette.action.selected,
	},
	addIconContainer: {
		alignSelf: "center",
		textAlign: "center",
	},
}));

function NoProjectCreated({
	setRedirectToDashboard,
}: {
	setRedirectToDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const classes = useStyles();
	const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
	const dashboardData = useDashBoardData();
	const [getWorkSpaces, { data: workSpaces, loading: fetchingWorkspaces }] = useLazyQuery<
		IGET_WORKSPACES_BY_ORG
	>(GET_WORKSPACES_BY_ORG);

	const [getProjects, { data: projects, refetch }] = useLazyQuery(GET_PROJECTS_BY_WORKSPACE, {
		fetchPolicy: "network-only",
	});

	useEffect(() => {
		getProjects();
	}, []);

	useEffect(() => {
		if (projects?.orgProject?.length) {
			setRedirectToDashboard(true);
		}
	}, [projects, setRedirectToDashboard]);

	useEffect(() => {
		if (dashboardData) {
			getWorkSpaces();
		}
	}, [dashboardData]);

	if (fetchingWorkspaces || !dashboardData) {
		return (
			<Box
				position="fixed"
				left="50%"
				top="50%"
				style={{ transform: "translate(-50%, -50%)" }}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box p={2}>
			<Project
				type={PROJECT_ACTIONS.CREATE}
				workspaces={workSpaces?.orgWorkspaces || []}
				open={projectDialogOpen}
				workspace={workSpaces?.orgWorkspaces[0]?.id || ""}
				handleClose={() => {
					setProjectDialogOpen(false);
				}}
				reftechOnSuccess={refetch}
			/>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h4">Welcome To FundImpact</Typography>
				</Grid>
				<Grid item xs={12}>
					<Box p={2} className={classes.contentBox}>
						<Grid container>
							<Grid item xs={2} className={classes.addIconContainer}>
								<IconButton
									color="inherit"
									onClick={() => setProjectDialogOpen(true)}
								>
									<AddCircleOutlineIcon fontSize="large" />
								</IconButton>
							</Grid>
							<Grid item xs={10}>
								<Typography variant="h6">Let's get started!</Typography>
								<Typography>
									Please add a project to start tracking funds and impact <br />
									<span
										style={{ cursor: "pointer" }}
										onClick={() => setProjectDialogOpen(true)}
									>
										Click here
									</span>{" "}
									to create a new project.
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

export default NoProjectCreated;
