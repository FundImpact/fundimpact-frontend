import { useQuery } from "@apollo/client";
import { List, ListItem, ListItemText, Button, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useDashBoardData, useDashboardDispatch } from "../../../contexts/dashboardContext";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
import { IOrganisationWorkspaces } from "../../../models/workspace/query";
import { setActiveWorkSpace, setProject } from "../../../reducers/dashboardReducer";
import ProjectListSkeleton from "../../Skeletons/projectList";
import Project from "../../Project/Project";
import { PROJECT_ACTIONS } from "../../Project/constants";
// import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
// import { setProject } from "../../../reducers/dashboardReducer";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		selectedProject: {
			backgroundColor: theme.palette.grey[100],
		},
		addProject: {
			color: "white",
		},
	})
);

export default function ProjectList({
	workspaceId,
	projectIndex,
	workspaces,
}: {
	workspaceId: any;
	projectIndex: number;
	workspaces: any;
}) {
	const classes = useStyles();
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	const filter: any = { variables: { filter: { workspace: workspaceId } } };
	const [openFormDialog, setOpenFormDialog] = React.useState<boolean>();
	const { data, loading } = useQuery(GET_PROJECTS_BY_WORKSPACE, filter);
	React.useEffect(() => {
		if (data && projectIndex === 0) {
			dispatch(setProject(data.orgProject[0]));
			dispatch(setActiveWorkSpace(data.orgProject[0]?.workspace));
		}
	}, [data, dispatch, projectIndex]);

	return (
		<>
			{loading ? (
				<ProjectListSkeleton />
			) : (
				<>
					{!data?.orgProject?.length && (
						<Button
							variant="contained"
							color="secondary"
							size="small"
							className={classes.addProject}
							onClick={() => setOpenFormDialog(true)}
						>
							Add project
						</Button>
					)}
					<List>
						{data &&
							data.orgProject &&
							data.orgProject.map(
								(project: {
									id: number;
									name: string;
									workspace: IOrganisationWorkspaces;
								}) => (
									<ListItem
										className={
											dashboardData?.project?.id === project.id
												? classes.selectedProject
												: ""
										}
										button
										key={project.id}
										onClick={() => {
											dispatch(setProject(project));
											dispatch(setActiveWorkSpace(project.workspace));
										}}
									>
										<ListItemText primary={project.name} />
									</ListItem>
								)
							)}
					</List>
					{openFormDialog && (
						<Project
							workspaces={workspaces}
							open={openFormDialog}
							handleClose={() => setOpenFormDialog(false)}
							type={PROJECT_ACTIONS.CREATE}
						/>
					)}
				</>
			)}
		</>
	);
}
