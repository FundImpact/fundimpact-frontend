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
import React from "react";
import { NavLink } from "react-router-dom";

import { UserDispatchContext } from "../../contexts/userContext";
import { sidePanelStyles } from "../Dasboard/styles";

/**
 * @description This is the Blue sidebar the we see on the left most side of the window.
 */
export default function LeftPanel() {
	const classes = sidePanelStyles();
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const userDispatch = React.useContext(UserDispatchContext);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Grid container className={classes.leftPanel} direction="column">
			<Grid xs item>
				<Box mb={1} mt={1}>
					<IconButton>
						<Avatar
							variant="square"
							src={require("../../assets/icons/Fundimpact-logo.png")}
						/>
					</IconButton>
				</Box>
				<Divider />
				<List>
					{[
						{
							name: "Dashboard",
							Icon: DashboardOutlinedIcon,
							color: "#bdbdbd",
							to: "/dashboard",
						},
						{
							name: "Briefcase",
							Icon: SettingsIcon,
							color: "#bdbdbd",
							to: "/settings",
						},
						// {
						// 	name: "Star",
						// 	Icon: GradeOutlinedIcon,
						// 	color: "#bdbdbd",
						// 	to: "/asd",
						// },
					].map((item, index) => (
						<NavLink to={item.to} activeClassName={classes.leftPanelActiveLink}>
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
					<Avatar src={require("../../assets/icons/dummy-user.png")} />
				</Button>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
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
