import { Box, CircularProgress, Dialog, Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

function FormDialog({
	open,
	handleClose,
	title,
	subtitle,
	workspace,
	project,
	children,
	loading,
}: {
	open: boolean;
	handleClose: () => void;
	title: string;
	subtitle: string;
	workspace: string;
	project?: string;
	children: any;
	loading?: boolean;
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
							{/*if title is New Deliverable unit then id will be newdeliverableunitFormTitle*/}
							<FormattedMessage
								id={`${title.replace(/ /g, "").toLowerCase()}FormTitle`}
								defaultMessage={title}
								description={`This text will be shown as title of ${title} Form`}
							/>
						</Typography>
						<Typography variant="subtitle2" color="textSecondary" gutterBottom>
							{/*if title is New Deliverable unit then id will be newdeliverableunitFormSubtitle*/}
							<FormattedMessage
								id={`${title.replace(/ /g, "").toLowerCase()}FormSubtitle`}
								defaultMessage={subtitle}
								description={`This text will be shown as subtitle of ${title} Form`}
							/>
						</Typography>
						{(workspace || project) && (
							<Box p={3} mt={3} style={{ backgroundColor: "#F5F6FA" }}>
								<Typography color="primary" gutterBottom>
									{workspace}
								</Typography>
								<Box mt={1}>
									<Typography variant="subtitle2">{project}</Typography>
								</Box>
							</Box>
						)}
					</Grid>
					<Grid item xs={8}>
						{children}
					</Grid>
				</Grid>
			</Box>
			{loading ? (
				<Box
					position="fixed"
					left="50%"
					top="50%"
					style={{ transform: "translate(-50%, -50%)" }}
				>
					<CircularProgress />
				</Box>
			) : null}
		</Dialog>
	);
}

export default FormDialog;
