import React, { useState } from "react";
import { Box, Typography, Divider } from "@material-ui/core";
import { useStyles } from "../styles";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORGANISATIONS, GET_WORKSPACES, GET_PROJECTS } from "../../../graphql/queries";
import { Skeleton } from "@material-ui/lab";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import IconButton from "@material-ui/core/IconButton";
import WorkspaceList from "./WorkspaceList/WorkspaceList";
import SimpleMenu from "../../Menu/Menu";
import "./sidebar.css";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function SideBar({ children }: { children: Function }) {
	const classes = useStyles();
	const { loading, error, data } = useQuery(GET_ORGANISATIONS);
	const [getWorkSpaces, { loading: workSpaceLoading, data: workSpaces }] = useLazyQuery(
		GET_WORKSPACES
	);
	const [getprojectsByWorkspace, { loading: projectloading, data: project }] = useLazyQuery(
		GET_PROJECTS
	);
	const [organisation, setOrganisation] = useState({ name: "", workSpaces: [] });

	React.useEffect(() => {
		if (data) {
			getWorkSpaces({});
		}
		if (workSpaces) {
			getprojectsByWorkspace();

			if (project) {
				let myOrganisation: any = {
					name: data.organisationList[0].name,
					id: data.organisationList[0].id,
				};
				myOrganisation.workSpaces = workSpaces.orgWorkspaces;
				myOrganisation.workSpaces = myOrganisation.workSpaces.map((workspace: any) => {
					let wsproject: any = [];
					project.orgProject.forEach((project: any) => {
						if (project.workspace.id === workspace.id) {
							wsproject.push(project);
						}
					});
					return { ...workspace, projects: wsproject };
				});
				setOrganisation(myOrganisation);
			}
		}
	}, [data, workSpaces, project]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const menuList = [
		{ listName: "Edit Organisation", Children: null },
		{ listName: "Add Workspace", Children: null },
	];
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			{loading ? (
				<Box mt={6}>
					<LinearProgress style={{ marginBottom: "3px" }} />
					<LinearProgress color="secondary" />
				</Box>
			) : (
				<div>
					<Box display="flex" m={2}>
						<Box flexGrow={1} ml={1}>
							{
								<Typography color="primary" gutterBottom variant="h6">
									{organisation.name}
								</Typography>
							}
						</Box>
						<Box>
							<IconButton
								edge="end"
								aria-label="edit"
								aria-controls={`organisationMenu`}
								aria-haspopup="true"
								onClick={handleClick}
							>
								<MoreVertOutlinedIcon />
							</IconButton>
							<SimpleMenu
								handleClose={handleClose}
								id={`organisationMenu`}
								anchorEl={anchorEl}
								menuList={menuList}
							/>
						</Box>
					</Box>
					<Divider />
					<WorkspaceList workSpaces={organisation.workSpaces} />
				</div>
			)}
		</Box>
	);
}
