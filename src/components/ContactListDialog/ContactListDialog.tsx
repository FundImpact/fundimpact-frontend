import React from "react";
import { Dialog, Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import ContactTable from "../Table/ContactTable";
import { Enitity } from "../../models/constants";

function ContactListDialog({
	open,
	handleClose,
	entity_name,
	entity_id,
}: {
	open: boolean;
	handleClose: () => void;
	entity_name: Enitity;
	entity_id: string;
}) {
	return (
		<Dialog
			fullWidth
			maxWidth="xl"
			open={open}
			onClose={handleClose}
			data-testid="addContact-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box px={3} py={4}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h5">
							<FormattedMessage
								id="contactListDialogHeading"
								description="This text will be shown as heading of contact list dialog"
								defaultMessage="Contact List"
							/>
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<ContactTable entity_name={entity_name} entity_id={entity_id} />
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}

export default ContactListDialog;
