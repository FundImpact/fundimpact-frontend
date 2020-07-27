import { useStyles } from "./styles";
import { Avatar, Box, Grid, List, ListItem, useTheme } from "@material-ui/core";
import React from "react";

export default function LeftPanel() {
	const classes = useStyles();
	const theme = useTheme();

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
				<Avatar src={require("../../assets/icons/dummy-user.png")} />
			</Grid>
		</Grid>
	);
}
