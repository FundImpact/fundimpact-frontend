import { createStyles, makeStyles, Theme } from "@material-ui/core";

/**
 * @description Keep the Styles related to left blue panel and sidebars only.
 */
export const sidePanelStyles = makeStyles((theme: Theme) =>
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
		leftPanelActiveLink: {
			background: theme.palette.primary.contrastText,
			display: "block",
			color: "red",
		},
		sidePanel: {
			height: "100vh",
			background: theme.palette.background.paper,
			overflowY: "scroll",
		},
		sidePanelActiveLink: {
			background: "rgb(204, 204, 204)",
		},
		card: {
			boxShadow: "none",
			margin: theme.spacing(0, 2),
		},
	})
);
