import {
	Box,
	CircularProgress,
	Dialog,
	Divider,
	Grid,
	Typography,
	useTheme,
} from "@material-ui/core";
import React from "react";

function FormDialog({
	open,
	handleClose,
	title,
	subtitle,
	workspace,
	project,
	children,
	loading,
	leftComponent,
	formDetails,
}: {
	open: boolean;
	handleClose: () => void;
	title: string;
	subtitle: string;
	workspace?: string;
	project?: string;
	children: any;
	loading?: boolean;
	leftComponent?: React.ReactNode;
	formDetails?: React.ReactNode;
}) {
	const theme = useTheme();

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
						{(workspace || project) && (
							<Box
								p={3}
								mt={3}
								style={{ backgroundColor: theme.palette.action.hover }}
							>
								<Typography color="primary" gutterBottom>
									{workspace}
								</Typography>
								<Box mt={1}>
									<Typography variant="subtitle2">{project}</Typography>
								</Box>
								{formDetails && (
									<Box mt={1}>
										<Divider />
										{formDetails}
									</Box>
								)}
							</Box>
						)}
						<Grid item container justify="center">
							{leftComponent}
						</Grid>
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
