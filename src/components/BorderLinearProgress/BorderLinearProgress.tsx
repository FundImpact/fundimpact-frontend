import { withStyles, Theme, createStyles, LinearProgress } from "@material-ui/core";

export const BorderLinearProgress = withStyles((theme: Theme) =>
	createStyles({
		root: {
			height: 10,
			borderRadius: 5,
			margin: theme.spacing(0, 1, 0, 1),
		},
		colorPrimary: {
			backgroundColor: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
		},
	})
)(LinearProgress);
