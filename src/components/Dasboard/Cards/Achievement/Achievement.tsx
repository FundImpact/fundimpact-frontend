import React from "react";
import { makeStyles, createStyles, withStyles, Theme } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme: Theme) => ({
	root: { height: "100vh" },
}));

const BorderLinearProgress = withStyles((theme: Theme) =>
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

const percentage = [
	{ name: "Deliverable", percentage: 60, lastUpdated: "20-5-2020" },
	{ name: "Impact", percentage: 90, lastUpdated: "20-5-2020" },
];
export default function Achievement() {
	const classes = useStyles();
	return (
		<Box className={classes.root}>
			<Box m={1}>
				<Box display="flex">
					<Box flexGrow={1} ml={1}>
						<Typography variant="subtitle2" gutterBottom>
							{percentage[0].name}
						</Typography>
					</Box>
					<Box mr={1} color="text.disabled">
						<Typography variant="body2" gutterBottom>
							{`Updated at ${percentage[0].lastUpdated}`}
						</Typography>
					</Box>
				</Box>
				<BorderLinearProgress
					variant="determinate"
					value={percentage[0].percentage}
					color="primary"
				/>
			</Box>
			<Box m={1}>
				<Box display="flex">
					<Box flexGrow={1} ml={1}>
						<Typography variant="subtitle2" gutterBottom>
							{percentage[1].name}
						</Typography>
					</Box>
					<Box mr={1} color="text.disabled">
						<Typography variant="body2" gutterBottom>
							{`Updated at ${percentage[1].lastUpdated}`}
						</Typography>
					</Box>
				</Box>
				<BorderLinearProgress
					variant="determinate"
					value={percentage[1].percentage}
					color="secondary"
				/>
			</Box>
		</Box>
	);
}
