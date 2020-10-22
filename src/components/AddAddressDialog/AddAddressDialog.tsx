import React from "react";
import {
	Dialog,
	Typography,
	Box,
	useTheme,
	Grid,
} from "@material-ui/core";
import AddressFormGraphql from "../Forms/ContactDetails/AddressForm";
import { FormattedMessage } from "react-intl";

function AddContactDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
	const theme = useTheme();

	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={handleClose}
			data-testid="addAddress-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box px={3} py={4}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography data-testid="dialog-header" variant="h6" gutterBottom>
							<FormattedMessage
								id="addAddressDialogTitle"
								defaultMessage="Add Address"
								description="This text will be displayed as title of add address dialog"
							/>
						</Typography>
						<Box
							px={2}
							py={3}
							mt={3}
							style={{ backgroundColor: theme.palette.action.hover }}
						>
							<Typography color="primary" gutterBottom>
								<FormattedMessage
									id="addAddressDialogInfo"
									defaultMessage="Add Address"
									description="This text will be displayed as info of address dialog"
								/>
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={8}>
						<AddressFormGraphql />
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}

export default AddContactDialog;
