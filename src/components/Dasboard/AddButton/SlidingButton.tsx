import React from "react";
import { ClickAwayListener, Button, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			margin: theme.spacing(1),
			width: "fit-content",
		},
	})
);

function SlidingButton({
	onClickAway,
	children,
}: {
	onClickAway: () => void;
	children: React.ReactNode | null;
}) {
	const classes = useStyles();

	return (
		<ClickAwayListener onClickAway={onClickAway}>
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
		</ClickAwayListener>
	);
}

export default SlidingButton;
