import { useApolloClient, useQuery } from "@apollo/client";
import { Box, Divider, MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import React, { useState } from "react";

import { useDashboardDispatch } from "../../../contexts/dashboardContext";
import { GET_WORKSPACES_BY_ORG } from "../../../graphql";
import { IOrganisation } from "../../../models/organisation/types";
import { IGET_WORKSPACES_BY_ORG, IOrganisationWorkspaces } from "../../../models/workspace/query";
import { IWorkspace } from "../../../models/workspace/workspace";
import { setActiveWorkSpace } from "../../../reducers/dashboardReducer";
import SimpleMenu from "../../Menu/Menu";
import { PROJECT_ACTIONS } from "../../Project/constants";
import Project from "../../Project/Project";
import WorkspaceListSkeleton from "../../Skeletons/WorkspaceListSkeleton";
import { WORKSPACE_ACTIONS } from "../../workspace/constants";
import Workspace from "../../workspace/Workspace";
import ProjectList from "../ProjectList/ProjectList";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		workspace: {
			"& :hover": {
				"& $workspaceEditIcon": {
					opacity: 1,
				},
			},
		},
		workspaceList: {
			display: "flex",
			flexDirection: "column",
			alignItems: "initial",
		},
		workspaceEditIcon: {
			opacity: 0,
		},
		workspaceListText: {
			color: theme.palette.primary.main,
		},
	})
);

export default function WorkspaceList({ organizationId }: { organizationId: IOrganisation["id"] }) {
	const apolloClient = useApolloClient();
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<any>([]);
	const filter: { variables: { filter: { organization: IOrganisation["id"] } } } = {
		variables: { filter: { organization: organizationId } },
	};
	const [projectDialogOpen, setProjectDialogOpen] = useState<boolean>(false);
	const [editWorkspace, seteditWorkspace] = useState<IWorkspace | null>(null);
	const dispatch = useDashboardDispatch();

	useQuery(GET_WORKSPACES_BY_ORG, filter);

	/**
	 * Apollo Client throws error if the readyQuery's query is not executed atleast once before
	 * it is being used. To prevent such errors, we need to catch them.
	 */
	let cachedWorkspaces: IGET_WORKSPACES_BY_ORG | null = null;
	try {
		cachedWorkspaces = apolloClient.readQuery<IGET_WORKSPACES_BY_ORG>(
			{
				query: GET_WORKSPACES_BY_ORG,
				variables: { ...filter.variables },
			},
			true
		);
	} catch (error) {}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
		let array = [...anchorEl];
		array[index] = event.currentTarget;
		setAnchorEl(array);
	};

	const closeMenuItems = (index: number) => {
		let array = [...anchorEl];
		array[index] = null;
		setAnchorEl(array);
	};

	if (!cachedWorkspaces || !cachedWorkspaces.orgWorkspaces)
		return <WorkspaceListSkeleton></WorkspaceListSkeleton>;

	return (
		<React.Fragment>
			<List className={classes.workspace}>
				{cachedWorkspaces.orgWorkspaces.map(
					(workspace: IOrganisationWorkspaces, index: number) => {
						return (
							<ListItem className={classes.workspaceList} key={workspace.id}>
								<Box display="flex">
									<Box flexGrow={1}>
										<ListItemText
											primary={workspace.name}
											className={classes.workspaceListText}
										/>
									</Box>
									<Box>
										<IconButton
											className={classes.workspaceEditIcon}
											aria-controls={`projectmenu${index}`}
											aria-haspopup="true"
											onClick={(e) => {
												handleClick(e, index);
												dispatch(setActiveWorkSpace(workspace));
											}}
										>
											<EditOutlinedIcon fontSize="small" />
										</IconButton>
										<SimpleMenu
											handleClose={() => closeMenuItems(index)}
											id={`projectmenu${index}`}
											anchorEl={anchorEl[index]}
										>
											<MenuItem
												onClick={() => {
													const workpsaceToEdit = {
														...workspace,
														organization:
															workspace["organization"]["id"],
													};
													seteditWorkspace(workpsaceToEdit as any);
													closeMenuItems(index);
												}}
											>
												Edit Workspace
											</MenuItem>
											<MenuItem
												onClick={() => {
													setProjectDialogOpen(true);
													closeMenuItems(index);
												}}
											>
												Add Project
											</MenuItem>
										</SimpleMenu>
									</Box>
								</Box>
								<ProjectList
									workspaceId={workspace.id}
									workspaces={cachedWorkspaces?.orgWorkspaces}
									projectIndex={index}
								/>
								<Divider />
							</ListItem>
						);
					}
				)}
			</List>

			{projectDialogOpen ? (
				<Project
					type={PROJECT_ACTIONS.CREATE}
					workspaces={cachedWorkspaces.orgWorkspaces}
					open={projectDialogOpen}
					handleClose={() => setProjectDialogOpen(false)}
				/>
			) : null}
			{editWorkspace ? (
				<Workspace
					organizationId={organizationId}
					type={WORKSPACE_ACTIONS.UPDATE}
					data={editWorkspace}
					close={() => seteditWorkspace(null)}
				></Workspace>
			) : null}
		</React.Fragment>
	);
}
