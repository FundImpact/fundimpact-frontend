import { ApolloProvider, useApolloClient, useQuery } from "@apollo/client";
import { Box, Divider, MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import React, { useState } from "react";

import { GET_WORKSPACES_BY_ORG } from "../../../graphql/queries";
import { IGET_WORKSPACES_BY_ORG, IOrganisationWorkspaces } from "../../../models/workspace/query";
import { IWorkspace } from "../../../models/workspace/workspace";
import FIDialog from "../../Dialog/Dialog";
import SimpleMenu from "../../Menu/Menu";
import { PROJECT_ACTIONS } from "../../Project/constants";
import Project from "../../Project/Project";
import { WORKSPACE_ACTIONS } from "../../workspace/constants";
import Workspace from "../../workspace/Workspace";
import ProjectList from "../ProjectList/ProjectList";
import { useDashboardDispatch } from "../../../contexts/dashboardContext";
import { setActiveWorkSpace } from "../../../reducers/dashboardReducer";

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

function AddProject({ workspaces }: { workspaces: { id: number; name: string }[] }) {
	const [open, setOpen] = React.useState(false);
	const handleModalOpen = () => {
		setOpen(true);
	};
	const handleModalClose = () => {
		setOpen(false);
	};
	return (
		<div>
			<MenuItem onClick={handleModalOpen}>Add project</MenuItem>
			{open && (
				<FIDialog
					open={open}
					handleClose={() => handleModalClose()}
					header={"Create Project"}
					children={<Project type={PROJECT_ACTIONS.CREATE} workspaces={workspaces} />}
				/>
			)}
		</div>
	);
}

export default function WorkspaceList({ organization }: { organization: any }) {
	const apolloClient = useApolloClient();
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<any>([]);
	const [menuList, setMenuList] = React.useState<any>([]);

	const [editWorkspace, seteditWorkspace] = useState<IWorkspace | null>(null);
	const dispatch = useDashboardDispatch();
	const filter: any = { variables: { filter: { organization } } };

	const { data } = useQuery(GET_WORKSPACES_BY_ORG, filter);

	/**
	 * Apollo Client throws error if the readyQuery's query is not executed atleast once before
	 * it is being used. To prevent such errors, we need to catch them.
	 */
	let oldCachedData: IGET_WORKSPACES_BY_ORG | null = null;
	try {
		oldCachedData = apolloClient.readQuery<IGET_WORKSPACES_BY_ORG>(
			{
				query: GET_WORKSPACES_BY_ORG,
				variables: { ...filter.variables },
			},
			true
		);
	} catch (error) {}

	React.useEffect(() => {
		if (data && data.orgWorkspaces) {
			let array = [...menuList, { children: <AddProject workspaces={data.orgWorkspaces} /> }];
			setMenuList(array);
		}
	}, [data]);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
		let array = [...anchorEl];
		array[index] = event.currentTarget;
		setAnchorEl(array);
	};

	const handleClose = (index: number) => {
		let array = [...anchorEl];
		array[index] = null;
		setAnchorEl(array);
	};

	return (
		<React.Fragment>
			<List className={classes.workspace}>
				{oldCachedData &&
					oldCachedData.orgWorkspaces &&
					oldCachedData.orgWorkspaces.map(
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
											{menuList && (
												<SimpleMenu
													handleClose={() => handleClose(index)}
													id={`projectmenu${index}`}
													anchorEl={anchorEl[index]}
													menuList={menuList}
												>
													<MenuItem
														onClick={() => {
															const workpsaceToEdit = {
																...workspace,
																organization:
																	workspace["organization"]["id"],
															};
															seteditWorkspace(
																workpsaceToEdit as any
															);
															handleClose(index);
														}}
													>
														Edit Workspace{" "}
													</MenuItem>
												</SimpleMenu>
											)}
										</Box>
									</Box>
									<ProjectList workspaceId={workspace.id} />
									<Divider />
								</ListItem>
							);
						}
					)}
			</List>

			<ApolloProvider client={apolloClient}>
				{editWorkspace ? (
					// TODO: Need to changed organisation id to dynamic
					<Workspace
						organizationId={13}
						type={WORKSPACE_ACTIONS.UPDATE}
						data={editWorkspace}
						close={() => seteditWorkspace(null)}
					></Workspace>
				) : null}
			</ApolloProvider>
		</React.Fragment>
	);
}
