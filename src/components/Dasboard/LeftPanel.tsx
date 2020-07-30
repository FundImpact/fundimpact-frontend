import { useStyles } from "./styles";
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
} from "@material-ui/core";
import React from "react";
import { UserDispatchContext } from "../../contexts/userContext";

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
				<List component="nav">
					{["dasboard", "briefcase", "star"].map((e) => (
						<ListItem
							key={e}
							style={{ justifyContent: "center", margin: theme.spacing(3, 0) }}
						>
							<img
								style={{ width: "2rem" }}
								src={require(`../../assets/icons/${e}.svg`)}
							/>
						</ListItem>
					))}
				</List>
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
