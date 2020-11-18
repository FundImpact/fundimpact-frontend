import { useQuery, useLazyQuery } from "@apollo/client";
import {
	Box,
	Divider,
	List,
	MenuItem,
	Typography,
	Avatar,
	Button,
	Grid,
	useTheme,
	ButtonGroup,
	Popover,
	Popper,
	Paper,
	ClickAwayListener,
	Grow,
	MenuList,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import React, { useEffect, useState } from "react";

import { useDashBoardData, useDashboardDispatch } from "../../contexts/dashboardContext";
import { GET_ORGANISATIONS, GET_WORKSPACES_BY_ORG, GET_PROJECTS_BY_WORKSPACE } from "../../graphql";
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
import { useIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/userContext";
import Project from "../Project/Project";
import { PROJECT_ACTIONS } from "../Project/constants";
import { IGET_WORKSPACES_BY_ORG } from "../../models/workspace/query";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

let menuList: { children: JSX.Element }[] = [];

export default function SideBar({ children }: { children?: Function }) {
	const user = useAuth();
	const classes = sidePanelStyles();
	const [getOrganization, { data }] = useLazyQuery<IOrganisationFetchResponse>(GET_ORGANISATIONS);
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	const intl = useIntl();
	const theme = useTheme();
	const addWorkspace = intl.formatMessage({
		id: "addWorkspaceOrganizationMenu",
		defaultMessage: "Add workspace",
		description: `This text will be show on organization menu for add workspace`,
	});

	const editOrganization = intl.formatMessage({
		id: "editOrganizationOrganizationMenu",
		defaultMessage: "Edit Organization",
		description: `This text will be show on organization menu for edit organization`,
	});

	const [openProjectDialog, setOpenProjectDialog] = React.useState<boolean>(false);

	const [getWorkspaceList, { data: workspaceList }] = useLazyQuery<IGET_WORKSPACES_BY_ORG>(
		GET_WORKSPACES_BY_ORG
	);
	const addProjectMenuRef = React.useRef(null);
	const [openAddProjectMenu, setOpenAddProjectMenu] = useState<boolean>(false);

	useEffect(() => {
		if (dashboardData) {
			getWorkspaceList({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);
	useEffect(() => {
		if (user) {
			getOrganization({
				variables: {
					id: user.user?.organization?.id || "",
				},
			});
		}
	}, [user, getOrganization]);

	React.useEffect(() => {
		if (data) {
			const { organization } = data;
			if (organization) {
				dispatch(setOrganisation(organization));
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
				{
					children: (
						<MenuItem component={Link} to="/settings/organization">
							{editOrganization}
						</MenuItem>
					),
				},
				{
					children: <MenuItem onClick={openWorkspaceComponent}>{addWorkspace}</MenuItem>,
				},
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
					<Project
						workspaces={workspaceList?.orgWorkspaces || []}
						open={openProjectDialog}
						handleClose={() => setOpenProjectDialog(false)}
						type={PROJECT_ACTIONS.CREATE}
						workspace=""
					/>
					<Box display="flex" m={2}>
						<Box flexGrow={1} ml={1} display="flex">
							{dashboardData?.organization?.name && (
								<>
									<Box mr={1}>
										<Link to="/organization/dashboard">
											<Avatar src={dashboardData?.organization?.logo?.url} />
										</Link>
									</Box>
									<Link
										to="/organization/dashboard"
										style={{ textDecoration: "none" }}
									>
										<Typography color="primary" gutterBottom variant="h6">
											{dashboardData?.organization?.name}
										</Typography>
									</Link>
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
							organizationId={data.organization.id}
							type={WORKSPACE_ACTIONS.CREATE}
							close={() => setViewWorkspace(false)}
						></Workspace>
					) : null}
				</div>
			)}
			<Box p={2} display="flex" flexGrow="1" position="relative">
				<ButtonGroup
					variant="contained"
					color="secondary"
					size="small"
					style={{
						position: "absolute",
						bottom: theme.spacing(3),
						width: "89%",
					}}
					ref={addProjectMenuRef}
				>
					<Button
						onClick={() => setOpenProjectDialog(true)}
						style={{ width: "100%", color: theme.palette.background.paper }}
					>
						<FormattedMessage
							id={`addProject`}
							defaultMessage={`Add Project`}
							description={`This text will be shown on  add project button`}
						/>
					</Button>
					<Button
						onClick={() => setOpenAddProjectMenu((open) => !open)}
						style={{ color: theme.palette.background.paper }}
					>
						<ArrowDropDownIcon />
					</Button>
				</ButtonGroup>
				<Popper
					open={openAddProjectMenu}
					anchorEl={addProjectMenuRef.current}
					role={undefined}
					transition
					disablePortal
					style={{ width: "89%" }}
				>
					{({ TransitionProps }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin: "left top",
							}}
						>
							<Paper>
								<ClickAwayListener
									onClickAway={() => {
										setOpenAddProjectMenu(false);
										setViewWorkspace(false);
									}}
								>
									<Button
										variant="contained"
										color="secondary"
										onClick={() => {
											setViewWorkspace(true);
											setOpenAddProjectMenu(false);
										}}
										style={{
											width: "100%",
											color: theme.palette.background.paper,
										}}
									>
										<FormattedMessage
											id={`addWorkspace`}
											defaultMessage={`Add Workspace`}
											description={`This text will be shown on  add workspace menu`}
										/>
									</Button>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</Box>
		</Box>
	);
}
