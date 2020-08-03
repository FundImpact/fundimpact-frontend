import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { Box, Divider, MenuItem } from "@material-ui/core";
import Project from "../../../Project/Project";
import { useQuery } from "@apollo/client";
import SimpleMenu from "../../../Menu/Menu";
import FIDialog from "../../../Dialog/Dialoag";
import { PROJECT_ACTIONS } from "../../../Project/constants";
import ProjectList from "../ProjectList/ProjectList";
import { GET_WORKSPACES_BY_ORG } from "../../../../graphql/queries/index";

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
		"& .workspaceList:hover .workspaceEditIcon": {
			opacity: 1,
		},
		workspaceEditIcon: {
			opacity: 0,
		},
		workspaceListText: {
			color: theme.palette.primary.main,
		},
	})
);

function AddProject({ workspace }: { workspace: any }) {
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
					children={<Project type={PROJECT_ACTIONS.CREATE} workspace={workspace} />}
				/>
			)}
		</div>
	);
}

export default function WorkspaceList({ organisation }: { organisation: any }) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<any>([]);
	const filter: any = { filter: organisation };
	const [menuList, setMenuList] = React.useState<any>([
		{ children: <MenuItem>Edit Workspace </MenuItem> },
	]);
	const { data, loading, error } = useQuery(GET_WORKSPACES_BY_ORG, filter);
	React.useEffect(() => {
		if (data && data.orgWorkspaces) {
			console.log(data);
			let array = [...menuList, { children: <AddProject workspace={data.orgWorkspaces} /> }];
			setMenuList([...array]);
		}
	}, [data]);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: any) => {
		let array = [...anchorEl];
		array[index] = event.currentTarget;
		setAnchorEl(array);
	};

	const handleClose = (index: any) => {
		let array = [...anchorEl];
		array[index] = null;
		setAnchorEl(array);
	};

	return (
		<List className={classes.workspace}>
			{data &&
				data.orgWorkspaces &&
				data.orgWorkspaces.map((workspace: any, index: number) => {
					return (
						<ListItem className={classes.workspaceList}>
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
							<List>
								<ProjectList workspaceId={workspace.id} />
							</List>
							<Divider />
						</ListItem>
					);
				})}
		</List>
	);
}
