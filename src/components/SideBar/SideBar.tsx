import { useQuery } from "@apollo/client";
import { Box, Divider, List, MenuItem, Typography, Avatar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import React, { useEffect } from "react";

import { useDashBoardData, useDashboardDispatch } from "../../contexts/dashboardContext";
import { GET_ORGANISATIONS } from "../../graphql";
import { IOrganisationFetchResponse } from "../../models/organisation/query";
import { setOrganisation } from "../../reducers/dashboardReducer";
import { sidePanelStyles } from "../Dasboard/styles";
import SimpleMenu from "../Menu/Menu";
import SidebarSkeleton from "../Skeletons/SidebarSkeleton";
import { WORKSPACE_ACTIONS } from "../workspace/constants";
import Workspace from "../workspace/Workspace";
import WorkspaceList from "./WorkspaceList/WorkspaceList";
import { userHasAccess, MODULE_CODES } from "../../utils/access";
import { WORKSPACE_ACTIONS as WORKSPACE_USER_ACCESS_ACTIONS } from "../../utils/access/modules/workspaces/actions";

let menuList: { children: JSX.Element }[] = [];

export default function SideBar({ children }: { children?: Function }) {
	const classes = sidePanelStyles();
	const { data } = useQuery<IOrganisationFetchResponse>(GET_ORGANISATIONS);
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();

	React.useEffect(() => {
		if (data) {
			const { organizations } = data;
			if (organizations) {
				dispatch(setOrganisation(organizations[0]));
			}
		}
	}, [data, dispatch]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [shouldCreateWorkspace, setViewWorkspace] = React.useState<boolean>(false);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const openWorkspaceComponent = () => {
		setViewWorkspace(true);
		handleClose();
	};

	const workspaceCreateAccess = userHasAccess(
		MODULE_CODES.WORKSPACE,
		WORKSPACE_USER_ACCESS_ACTIONS.CREATE_WORKSPACE
	);

	useEffect(() => {
		if (workspaceCreateAccess) {
			menuList = [
				{ children: <MenuItem onClick={openWorkspaceComponent}>Add Workspace</MenuItem> },
			];
		}
	}, [workspaceCreateAccess]);

	if (!dashboardData?.organization) return <SidebarSkeleton></SidebarSkeleton>;
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			{!dashboardData?.organization ? (
				<Box mt={6}>
					<LinearProgress style={{ marginBottom: "3px" }} />
					<LinearProgress color="secondary" />
				</Box>
			) : (
				<div>
					<Box display="flex" m={2}>
						<Box flexGrow={1} ml={1} display="flex">
							{dashboardData?.organization?.name && (
								<>
									<Box mr={1}>
										<Avatar src={dashboardData?.organization?.logo?.url} />
									</Box>
									<Typography color="primary" gutterBottom variant="h6">
										{dashboardData?.organization?.name}
									</Typography>
								</>
							)}
						</Box>
						<Box>
							{workspaceCreateAccess && (
								<IconButton
									edge="end"
									aria-label="edit"
									aria-controls={`organizationMenu`}
									aria-haspopup="true"
									onClick={handleClick}
								>
									<MoreVertOutlinedIcon />
								</IconButton>
							)}
							{workspaceCreateAccess && (
								<SimpleMenu
									handleClose={handleClose}
									id={`organizationMenu`}
									anchorEl={anchorEl}
									menuList={menuList}
								/>
							)}
						</Box>
					</Box>
					<Divider />

					{dashboardData?.organization?.id && (
						<WorkspaceList organizationId={dashboardData?.organization?.id} />
					)}

					<List></List>
					{shouldCreateWorkspace && data ? (
						<Workspace
							organizationId={data.organizations[0].id}
							type={WORKSPACE_ACTIONS.CREATE}
							close={() => setViewWorkspace(false)}
						></Workspace>
					) : null}
				</div>
			)}
		</Box>
	);
}
