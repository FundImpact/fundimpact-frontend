import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
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
