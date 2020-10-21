import React from "react";
import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Backdrop } from "@material-ui/core";
import { useStyles } from "./GlobalLoader";
function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
	return (
		<Box position="relative" display="inline-flex">
			<CircularProgress variant="static" {...props} />
			<Box
				top={0}
				left={0}
				bottom={0}
				right={0}
				position="absolute"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
					props.value
				)}%`}</Typography>
			</Box>
		</Box>
	);
}

export default function CircularPercentage({
	progress,
	message,
}: {
	progress: number;
	message?: string;
}) {
	const classes = useStyles();
	return (
		<Backdrop className={classes.backdrop} open={true}>
			<Box>
				<Typography variant="subtitle1" color="textSecondary">{`${message}  `}</Typography>
			</Box>
			<CircularProgressWithLabel size={60} color="inherit" value={progress} />
		</Backdrop>
	);
}
