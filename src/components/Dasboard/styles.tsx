import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			height: "100vh",
			display: "flex",
		},
		leftPanel: {
			height: "100vh",
			background: theme.palette.primary.main,
		},
		leftPanelContent: {},
		sidePanel: {
			height: "100vh",
			background: theme.palette.background.paper,
			overflowY: "scroll",
		},
		card: {
			boxShadow: "none",
			margin: theme.spacing(0, 2),
		},
	})
);
