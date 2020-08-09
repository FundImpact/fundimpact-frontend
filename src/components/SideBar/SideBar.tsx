import { ApolloProvider, useApolloClient, useQuery } from "@apollo/client";
import { Box, Divider, List, MenuItem, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import React, { useEffect } from "react";

import { client } from "../../config/grapql";
import { GET_ORGANISATIONS } from "../../graphql/queries";
import { useStyles } from "../Dasboard/styles";
import SimpleMenu from "../Menu/Menu";
import { WORKSPACE_ACTIONS } from "../workspace/constants";
import Workspace from "../workspace/Workspace";
import WorkspaceList from "./WorkspaceList/WorkspaceList";

export default function SideBar({ children }: { children?: Function }) {
	const apolloClient = useApolloClient();
	const classes = useStyles();
	const { loading, data } = useQuery(GET_ORGANISATIONS);
	React.useEffect(() => {
		if (data) console.log(data);
	}, [data]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [viewWorkspace, setViewWorkspace] = React.useState<boolean>(false);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const openWorkspaceComponent = () => {
		setViewWorkspace(true);
	};

	const menuList = [
		{ children: <MenuItem>Edit Orgnisation</MenuItem> },
		{ children: <MenuItem onClick={openWorkspaceComponent}>Add Workspace</MenuItem> },
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
									{data.organisationList[0].name}
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

					{data && data.organisationList[0].id && (
						<ApolloProvider client={apolloClient}>
							<WorkspaceList organisation={data.organisationList[0].id} />
						</ApolloProvider>
					)}
					<List></List>
					<ApolloProvider client={apolloClient}>
						{viewWorkspace ? (
							<Workspace
								organisationId={data.organisationList[0].id}
								type={WORKSPACE_ACTIONS.CREATE}
								close={() => setViewWorkspace(false)}
							></Workspace>
						) : null}
					</ApolloProvider>
				</div>
			)}
		</Box>
	);
}
