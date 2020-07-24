import React from "react";
import {
	Avatar,
	Box,
	Container,
	createStyles,
	Grid,
	List,
	ListItem,
	Theme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface IDashboardContainer {
	left: React.ReactNode;
	main: React.ReactNode;
	top?: React.ReactNode;
}

export function LeftPanel() {
	return (
		<Grid container style={{ height: "100%" }} direction="column">
			<Grid item xs={2}></Grid>
			<Grid xs>
				<List component="nav">
					<ListItem>
						<Avatar src={require("../../assets/icons/dasboard.svg")} />
					</ListItem>
					<ListItem>
						<Avatar src={require("../../assets/icons/dasboard.svg")} />
					</ListItem>
					<ListItem>
						<Avatar src={require("../../assets/icons/dasboard.svg")} />
					</ListItem>
				</List>
			</Grid>
			<Grid xs container direction={"column"} alignItems="center" justify="flex-end">
				<Avatar src={require("../../assets/icons/dummy-user.png")} />
			</Grid>
		</Grid>
	);
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			height: "100vh",
			width: "100vw",
			padding: 0,
		},
		leftPanel: {
			flexBasis: "5%",
			height: "100%",
		},
		leftPanelContent: {
			height: "100%",
			padding: theme.spacing(1),
		},
	})
);

export default function DashboardContainer({ left, main, top }: IDashboardContainer) {
	const classes = useStyles();
	return (
		<Container className={classes.root} maxWidth={"xl"}>
			<Grid style={{ height: "100%" }} container>
				<Grid className={classes.leftPanel} xs={1} direction="column" item container>
					<Box bgcolor="primary.main" className={classes.leftPanelContent}>
						<LeftPanel />
					</Box>
				</Grid>
				<Grid xs={11} item container direction="column">
					{top && <Grid xs={1}>{top} </Grid>}
					<Grid xs>MAIN </Grid>
				</Grid>
			</Grid>
		</Container>
	);
}
