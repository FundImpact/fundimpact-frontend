import React from "react";
import { Dialog, Box, Grid, CircularProgress, Typography } from "@material-ui/core";
import DialogBoxSidebar from "../../DialogBoxSidebar";
import CommonInputForm from "../../Forms/CommonInputForm/CommonInputForm";
import { FORM_ACTIONS } from "../../../models/budget/constants";

function CommonDialog({
	open,
	handleClose,
	initialValues,
	validate,
	onSubmit,
	inputFields,
	loading,
	title,
	subtitle,
	workspace,
	selectFields = [],
	formAction = FORM_ACTIONS.CREATE,
	onUpdate,
}: {
	open: boolean;
	handleClose: () => void;
	onSubmit: any;
	initialValues: any;
	validate: any;
	inputFields: any[];
	loading: boolean;
	title: string;
	subtitle: string;
	workspace: string;
	selectFields?: any[];
	formAction?: FORM_ACTIONS;
	onUpdate?: any;
}) {
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
								<Typography variant="subtitle2">Project Name One</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={8}>
						<CommonInputForm
							initialValues={initialValues}
							validate={validate}
							onSubmit={onSubmit}
							onCancel={handleClose}
							inputFields={inputFields}
							selectFields={selectFields}
							formAction={formAction}
							onUpdate={onUpdate}
						/>
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
