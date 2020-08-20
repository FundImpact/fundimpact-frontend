import React, { useState } from "react";
import { Button, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			margin: theme.spacing(1),
			width: "fit-content",
		},
	})
);

function SlidingButton({
	children,
	dialog,
}: {
	children: React.ReactNode | null;
	dialog?: ({
		open,
		handleClose,
	}: {
		open: boolean;
		handleClose: () => void;
	}) => React.ReactNode | void;
}) {
	const classes = useStyles();
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			{dialog &&
				dialog({
					open: openDialog,
					handleClose: () => {
						setOpenDialog(false);
					},
				})}
			<Button
				className={classes.button}
				variant="contained"
				size="small"
				color="primary"
				disableElevation
				disableRipple
				onClick={() => {
					setOpenDialog(true);
				}}
			>
				{children}
			</Button>
		</>
	);
}

export default SlidingButton;
