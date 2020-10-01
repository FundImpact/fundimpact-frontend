import { useQuery } from "@apollo/client";
import { List, ListItem, ListItemText, Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useDashBoardData, useDashboardDispatch } from "../../../contexts/dashboardContext";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
import { IOrganisationWorkspaces } from "../../../models/workspace/query";
import { setProject } from "../../../reducers/dashboardReducer";
import ProjectListSkeleton from "../../Skeletons/projectList";
import Project from "../../Project/Project";
import { PROJECT_ACTIONS } from "../../Project/constants";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { PROJECT_ACTIONS as PROJECT_USER_ACCESS_ACTIONS } from "../../../utils/access/modules/project/actions";
import { useLocation, useNavigate } from "react-router";

// import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
// import { setProject } from "../../../reducers/dashboardReducer";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		selectedProject: {
			backgroundColor: theme.palette.action.selected,
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
	let { pathname } = useLocation();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (data && projectIndex === 0 && pathname === "/dashboard") {
			dispatch(setProject(data.orgProject[0]));
		}
	}, [data, dispatch, projectIndex, pathname]);

	const projectCreateAccess = userHasAccess(
		MODULE_CODES.PEOJECT,
		PROJECT_USER_ACCESS_ACTIONS.CREATE_PROJECT
	);

	return (
		<>
			{loading ? (
				<ProjectListSkeleton />
			) : (
				<>
					{!data?.orgProject?.length && projectCreateAccess && (
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
											if (pathname !== "/dashboard") navigate("/dashboard");
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
							workspace={dashboardData?.workspace?.id}
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
