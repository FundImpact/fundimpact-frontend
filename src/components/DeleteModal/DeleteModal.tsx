import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	useTheme,
} from "@material-ui/core";
import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";

interface IDELETE_MODAL {
	open: boolean;
	handleClose: () => void;
	title?: string;
	onDeleteConformation: () => Promise<any>;
}

function DeleteModal({ open, handleClose, title, onDeleteConformation }: IDELETE_MODAL) {
	const theme = useTheme();

	const onDeleteButtonClick = useCallback(async () => {
		try {
			await onDeleteConformation();
		} catch (err) {
			console.error(err);
		} finally {
			handleClose();
		}
	}, [onDeleteConformation, handleClose]);

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<FormattedMessage
						id="delete-dialog-confirmation-message"
						defaultMessage="Are you sure you want to delete ?"
					/>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					style={{ backgroundColor: theme.palette.error.dark }}
					autoFocus
					onClick={handleClose}
				>
					<FormattedMessage id="delete-dialog-rejection" defaultMessage="No" />
				</Button>
				<Button variant="contained" color="secondary" onClick={onDeleteButtonClick}>
					<FormattedMessage id="delete-dialog-confirmation" defaultMessage="Yes" />
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DeleteModal;
