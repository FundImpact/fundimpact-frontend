import { useApolloClient, useQuery } from "@apollo/client";
import { Box, Divider, MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import React, { useEffect } from "react";

import { GET_WORKSPACES_BY_ORG } from "../../../graphql/queries";
import { IGET_WORKSPACES_BY_ORG } from "../../../models/workspace/queries";
import FIDialog from "../../Dialog/Dialog";
import SimpleMenu from "../../Menu/Menu";
import { PROJECT_ACTIONS } from "../../Project/constants";
import Project from "../../Project/Project";
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

export default function WorkspaceList({ organisation }: { organisation: any }) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<any>([]);
	const filter: any = { variables: { filter: { organisation } } };
	const [menuList, setMenuList] = React.useState<any>([
		{ children: <MenuItem>Edit Workspace </MenuItem> },
	]);
	const apolloClient = useApolloClient();
	const { data } = useQuery(GET_WORKSPACES_BY_ORG, filter);
	let oldCachedData: IGET_WORKSPACES_BY_ORG | null = null;
	try {
		oldCachedData = apolloClient.readQuery<IGET_WORKSPACES_BY_ORG>({
			query: GET_WORKSPACES_BY_ORG,
			variables: { ...filter.variables },
		});
	} catch (error) {}

	useEffect(() => {
		console.log(`cache workspaces list`, oldCachedData);
	}, [oldCachedData]);

	React.useEffect(() => {
		if (data && data.orgWorkspaces) {
			console.log(data);
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
		<List className={classes.workspace}>
			{oldCachedData &&
				oldCachedData.orgWorkspaces &&
				oldCachedData.orgWorkspaces.map(
					(workspace: { id: number; name: string }, index: number) => {
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
											/>
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
	);
}
