import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { Box } from "@material-ui/core";

export interface ProgressDialogProps {
	open: boolean;
	title: string;
	children?: React.ReactNode;
	onClose: (value: string) => void;
}

export default function ProgressDialog({ open, title, onClose, children }: ProgressDialogProps) {
	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="simple-dialog-title"
			open={open}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle id="simple-dialog-title">{title}</DialogTitle>
			<Box m={1}>{children}</Box>
		</Dialog>
	);
}
