import React from "react";
import { Dialog, Box, Grid, CircularProgress, Typography } from "@material-ui/core";
import { ICommonDialog } from "../../../models";

//This is a common dialog which will be used by all other dialog and form will be passed as
//children and the title, subtitle, workspace will be passes in props

function CommonDialog({
	open,
	handleClose,
	loading,
	title,
	subtitle,
	workspace,
	children,
	project
}: ICommonDialog) {
	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={handleClose}
			data-testid="common-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box px={3} py={4}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography data-testid="dialog-header" variant="h6" gutterBottom>
							{title}
						</Typography>
						<Typography variant="subtitle2" color="textSecondary" gutterBottom>
							{subtitle}
						</Typography>
						<Box p={3} mt={3} style={{ backgroundColor: "#F5F6FA" }}>
							<Typography color="primary" gutterBottom>
								{workspace}
							</Typography>
							<Box mt={1}>
								<Typography variant="subtitle2">{project}</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={8}>
						{children}
					</Grid>
				</Grid>
			</Box>
			{loading ? (
				<Box position="fixed" bottom={0} alignSelf="center">
					<CircularProgress />
				</Box>
			) : null}
		</Dialog>
	);
}

export default CommonDialog;
