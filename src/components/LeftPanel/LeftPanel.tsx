import {
	Avatar,
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	List,
	ListItemIcon,
	Menu,
	MenuItem,
	useTheme,
} from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth, UserDispatchContext } from "../../contexts/userContext";
import { sidePanelStyles } from "../Dasboard/styles";
import { userHasAccess } from "../../utils/access";
import { MODULE_CODES } from "../../utils/access/moduleCodes";
import { SETTING_MODULE_ACTION } from "../../utils/access/modules/setting/actions";
import { GET_PROJECTS_BY_WORKSPACE } from "../../graphql";
import { useQuery } from "@apollo/client";
import { setProject } from "../../reducers/dashboardReducer";
import { useDashboardDispatch } from "../../contexts/dashboardContext";
import { ACCOUNT_ACTIONS } from "../../utils/access/modules/account/actions";
import ToggleDarkTheme from "./ToggleDarkTheme";

/**
 * @description This is the Blue sidebar the we see on the left most side of the window.
 */
export default function LeftPanel() {
	const classes = sidePanelStyles();
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const userDispatch = React.useContext(UserDispatchContext);
	const auth = useAuth();
	const user: any = auth.user;
	const { data } = useQuery(GET_PROJECTS_BY_WORKSPACE);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [leftPannelList, setLeftPannelList] = useState([
		{
			name: "Dashboard",
			Icon: DashboardOutlinedIcon,
			color: "#bdbdbd",
			to: "/dashboard",
			onClick: () => {},
		},
	]);
	const dispatch = useDashboardDispatch();

	useEffect(() => {
		if (data) {
			leftPannelList[0].onClick = () => dispatch(setProject(data.orgProject[0]));
		}
	}, [data, leftPannelList, dispatch]);

	const settingButtonAccess = userHasAccess(
		MODULE_CODES.SETTING,
		SETTING_MODULE_ACTION.FIND_SETTING
	);

	useEffect(() => {
		if (settingButtonAccess) {
			setLeftPannelList((currentLeftPannelList) => [
				...currentLeftPannelList,
				{
					name: "Briefcase",
					Icon: SettingsIcon,
					color: "#bdbdbd",
					to: "/settings",
					onClick: () => {},
				},
			]);
		}
	}, [settingButtonAccess]);

	const accountEditAccess = userHasAccess(MODULE_CODES.ACCOUNT, ACCOUNT_ACTIONS.UPDATE_ACCOUNT);

	return (
		<Grid container className={classes.leftPanel} direction="column">
			<Grid xs item>
				<Box mb={1} mt={1}>
					<IconButton>
						<Link to="/organization/dashboard">
							<Avatar
								variant="square"
								src={require("../../assets/icons/Fundimpact-logo.png")}
							/>
						</Link>
					</IconButton>
				</Box>
				<Divider />
				<List>
					{leftPannelList.map((item, index) => (
						<NavLink
							to={item.to}
							key={index}
							activeClassName={classes.leftPanelActiveLink}
							onClick={item.onClick}
						>
							<ListItemIcon>
								<item.Icon
									style={{
										color: item.color,
										fontSize: "2rem",
										margin: "5px 5px 5px 25%",
									}}
								/>
							</ListItemIcon>
						</NavLink>
					))}
				</List>
				<Divider />
			</Grid>
			<Grid
				xs
				item
				container
				direction={"column"}
				alignItems="center"
				justify="flex-end"
				style={{ marginBottom: theme.spacing(2) }}
			>
				<Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
					<Avatar alt={user?.name} src={user?.profile_photo?.url} />
				</Button>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					{" "}
					<ToggleDarkTheme />
					{accountEditAccess && (
						<MenuItem component={Link} to={"/account/profile"}>
							Account Settings
						</MenuItem>
					)}
					<MenuItem
						onClick={() => {
							if (userDispatch) {
								userDispatch({ type: "LOGOUT_USER" });
							}
						}}
					>
						Logout
					</MenuItem>
				</Menu>
			</Grid>
		</Grid>
	);
}
