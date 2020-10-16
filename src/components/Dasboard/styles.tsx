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
		},
		sidePanel: {
			height: "100vh",
			background: theme.palette.background.paper,
			overflowY: "scroll",
		},
		sidePanelActiveLink: {
			background: theme.palette.action.selected,
		},
		card: {
			boxShadow: "none",
			margin: theme.spacing(0, 2),
		},
		mainHeading: {
			color: theme.palette.primary.main,
		},
	})
);
