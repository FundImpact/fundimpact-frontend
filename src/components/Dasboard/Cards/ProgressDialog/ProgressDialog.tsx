import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { Box } from "@material-ui/core";

export interface ProgressDialogProps {
	open: boolean;
	title: string;
	filterTitle: string;
	children?: React.ReactNode;
	onClose: (value: string) => void;
}

export default function ProgressDialog({
	open,
	title,
	onClose,
	children,
	filterTitle,
}: ProgressDialogProps) {
	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="simple-dialog-title"
			open={open}
			maxWidth="sm"
			fullWidth
		>
			{title && (
				<DialogTitle id="simple-dialog-title">{`${title} ${
					filterTitle ? "By " + filterTitle : ""
				}`}</DialogTitle>
			)}
			<Box m={1}>{children}</Box>
		</Dialog>
	);
}
