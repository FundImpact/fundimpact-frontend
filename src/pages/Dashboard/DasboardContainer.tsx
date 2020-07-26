import React from "react";
import {
	AppBar,
	Avatar,
	Box,
	Container,
	createStyles,
	Grid,
	List,
	ListItem,
	Paper,
	Slide,
	Theme,
	Typography,
	useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface IDashboardContainer {
	left: React.ReactNode;
	main: React.ReactNode;
	top?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			height: "100vh",
		},
		leftPanel: {
			height: "100vh",
			background: theme.palette.primary.main,
		},
		leftPanelContent: {},
		sidePanel: {
			height: "100%",
			background: theme.palette.background.paper,
		},
	})
);

export function LeftPanel() {
	const classes = useStyles();
	const theme = useTheme();

	return (
		<Grid component={Box} container className={classes.leftPanel} direction="column">
			<Grid item xs={2}></Grid>
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
			<Grid xs item container direction={"column"} alignItems="center" justify="flex-end">
				<Avatar src={require("../../assets/icons/dummy-user.png")} />
			</Grid>
		</Grid>
	);
}

function SideBar({ children }: { children: React.ReactElement }) {
	const classes = useStyles();

	return (
		<Box className={classes.sidePanel} ml={2} mr={1} p={2}>
			{children}
		</Box>
	);
}

export default function DashboardContainer({ left, main, top }: IDashboardContainer) {
	const classes = useStyles();
	const [showSideBar, setShowSideBar] = React.useState(false);

	React.useEffect(() => {
		setTimeout(() => setShowSideBar(true), 1000);
	});

	return (
		<Container
			component={Grid}
			disableGutters
			container
			className={classes.root}
			maxWidth={"xl"}
		>
			<Grid item xs={12} md={3} container>
				<Grid item xs={2}>
					<LeftPanel />
				</Grid>
				<Grid item xs={10}>
					<SideBar>
						<Grid item>
							<Typography variant="h4" gutterBottom noWrap={true}>
								<Box color="primary.main">Fund Impact</Box>
							</Typography>
						</Grid>
					</SideBar>
				</Grid>
			</Grid>

			<Grid item xs md={9} container>
				<Grid item xs={12}>
					Top Content
				</Grid>
				<Grid item xs={12}>
					<Box ml={1}>{main}</Box>
				</Grid>
				{/*<Grid xs>{main}</Grid>*/}
			</Grid>
		</Container>
	);
}
