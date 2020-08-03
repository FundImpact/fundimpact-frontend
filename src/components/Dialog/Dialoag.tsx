import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
		paper: {
			backgroundColor: theme.palette.background.paper,
			padding: theme.spacing(2),
		},
		closeButton: {
			display: "flex",
			margin: 0,
		},
	})
);

export default function FIDialog({
	open,
	handleClose,
	children,
	header,
}: {
	open: boolean;
	handleClose: any;
	children: React.ReactNode | null;
	header?: string;
}) {
	const classes = useStyles();
	return (
		<div>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<MuiDialogTitle disableTypography className={classes.closeButton}>
					<Box flexGrow={1}>
						{header && <DialogTitle id="form-dialog-title">{header}</DialogTitle>}
					</Box>
					<IconButton aria-label="close" onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</MuiDialogTitle>
				<DialogContent>
					{children && <div className={classes.paper}>{children}</div>}
				</DialogContent>
			</Dialog>
		</div>
	);
}
