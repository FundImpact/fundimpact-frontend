import React from "react";
import { Button, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			margin: theme.spacing(1),
			width: "fit-content",
		},
	})
);

function SlidingButton({ children }: { children: React.ReactNode | null }) {
	const classes = useStyles();

	return (
		<Button
			className={classes.button}
			variant="contained"
			size="small"
			color="primary"
			disableElevation
			disableRipple
		>
			{children}
		</Button>
	);
}

export default SlidingButton;
