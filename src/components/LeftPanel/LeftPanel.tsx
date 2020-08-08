import { useStyles } from "../Dasboard/styles";
import {
	Avatar,
	Box,
	Button,
	Grid,
	List,
	ListItem,
	Menu,
	MenuItem,
	useTheme,
	Divider,
	ListItemIcon,
	IconButton,
} from "@material-ui/core";
import React from "react";
import { UserDispatchContext } from "../../contexts/userContext";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import GradeOutlinedIcon from "@material-ui/icons/GradeOutlined";
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";

export default function LeftPanel() {
	const classes = useStyles();
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
		<Grid component={Box} container className={classes.leftPanel} direction="column">
			<Grid xs item>
				<Box mb={1} mt={1}>
					<IconButton>
						<MonetizationOnOutlinedIcon
							style={{ color: "white", fontSize: "2rem", margin: "5px" }}
						/>
					</IconButton>
				</Box>
				<Divider />
				<List>
					{[
						{ name: "Dashboard", Icon: DashboardOutlinedIcon, color: "#fafafa" },
						{ name: "Briefcase", Icon: BusinessCenterOutlinedIcon, color: "#bdbdbd" },
						{ name: "Star", Icon: GradeOutlinedIcon, color: "#bdbdbd" },
					].map((item, index) => (
						<ListItem button key={item.name}>
							<ListItemIcon>
								<item.Icon
									style={{ color: item.color, fontSize: "1.7rem", margin: "5px" }}
								/>
							</ListItemIcon>
						</ListItem>
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
