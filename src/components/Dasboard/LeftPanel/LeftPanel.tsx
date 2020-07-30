import { useStyles } from "../styles";
import { Avatar, Box, Grid, List, ListItem, useTheme, IconButton } from "@material-ui/core";
import React from "react";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import GradeOutlinedIcon from "@material-ui/icons/GradeOutlined";
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import { Divider, ListItemIcon } from "@material-ui/core";

export default function LeftPanel() {
	const classes = useStyles();
	const theme = useTheme();

	return (
		<Grid
			component={Box}
			container
			className={classes.leftPanel}
			direction="column"
			boxShadow={1}
		>
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
				<IconButton>
					<Avatar src={require("../../../assets/icons/dummy-user.png")} />
				</IconButton>
			</Grid>
		</Grid>
	);
}
