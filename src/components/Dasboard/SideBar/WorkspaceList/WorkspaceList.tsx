import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { Box, Divider } from "@material-ui/core";
import CreateProject from "../../../Forms/CreateProject/createProject";
import OrganisationForm from "../../../Forms/OrganisationForm/OrganisationForm";
import SimpleMenu from "../../../Menu/Menu";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
			maxWidth: 752,
		},
		demo: {
			backgroundColor: theme.palette.background.paper,
		},
		title: {
			margin: theme.spacing(4, 0, 2),
		},
		workspaceList: {
			display: "flex",
			flexDirection: "column",
			alignItems: "initial",
		},
		workspaceListText: {
			color: theme.palette.primary.main,
		},
	})
);

export default function WorkspaceList() {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<any>([]);

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
	const workspaces = [
		{
			name: "WORKSPACE 1",
			projects: ["Project One", "Another Project", "One another Project"],
		},
		{
			name: "WORKSPACE 2",
			projects: ["Project One", "Another Project", "One another Project"],
		},
		{
			name: "WORKSPACE 3",
			projects: ["Project One", "Another Project", "One another Project"],
		},
		{
			name: "WORKSPACE 4",
			projects: ["Project One", "Another Project", "One another Project"],
		},
	];
	const menuList = [
		{ listName: "Edit Workspace", children: <OrganisationForm /> },
		{ listName: "Add / Edit Project", children: <CreateProject /> },
	];
	return (
		<List>
			{workspaces.map((workspace, index) => {
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
									aria-controls={`projectmenu${index}`}
									aria-haspopup="true"
									onClick={(e) => {
										handleClick(e, index);
									}}
								>
									<EditOutlinedIcon fontSize="small" />
								</IconButton>
								<SimpleMenu
									handleClose={() => handleClose(index)}
									id={`projectmenu${index}`}
									anchorEl={anchorEl[index]}
									menuList={menuList}
								/>
							</Box>
						</Box>
						<List>
							{workspace.projects.map((project) => {
								return (
									<ListItem button>
										<ListItemText primary={project} />
									</ListItem>
								);
							})}
						</List>
						<Divider />
					</ListItem>
				);
			})}
		</List>
	);
}
