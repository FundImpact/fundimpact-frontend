import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	IconButton,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const TabelsDialog = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
	return (
		<Dialog
			open={open}
			keepMounted
			onClose={handleClose}
			aria-describedby="alert-dialog-slide-description"
		>
			<Box display="flex" justifyContent="space-between">
				<DialogTitle>{"Related countries"}</DialogTitle>
				<IconButton onClick={handleClose}>
					<CloseIcon />
				</IconButton>
			</Box>
			<DialogContent>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Id</TableCell>
							<TableCell>Country Name</TableCell>
							<TableCell>Related year name</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>1</TableCell>
							<TableCell>India</TableCell>
							<TableCell>My Year Tag</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</DialogContent>
		</Dialog>
	);
};

export default TabelsDialog;
