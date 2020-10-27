import React, { useState } from "react";
import { Dialog, Typography, Box, useTheme, Grid, StepLabel } from "@material-ui/core";
import ContactForm from "../Forms/ContactDetails/ContactForm";
import { FormattedMessage } from "react-intl";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import AddressForm from "../Forms/ContactDetails/AddressForm";

enum FormType {
	contact = 0,
	address = 1,
}

function getFormSteps() {
	return ["Create Contact", "Add Address"];
}

function AddContactDialog({
	open,
	handleClose,
	entity_name,
	entity_id,
}: {
	open: boolean;
	handleClose: () => void;
	entity_name: string;
	entity_id: string;
}) {
	const theme = useTheme();
	const [activeForm, setActiveForm] = useState(FormType.contact);
	const [contact_id, setContact_id] = useState<string>("");
	const formSteps = getFormSteps();

	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={handleClose}
			data-testid="addContact-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box px={3} py={4}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography data-testid="dialog-header" variant="h6" gutterBottom>
							{activeForm == FormType.contact ? (
								<FormattedMessage
									id="addContactDialogTitle"
									defaultMessage="Add Contact"
									description="This text will be displayed as title of add contact dialog"
								/>
							) : (
								<FormattedMessage
									id="addAddressDialogTitle"
									defaultMessage="Add Address"
									description="This text will be displayed as title of add address dialog"
								/>
							)}
						</Typography>
						<Box
							px={2}
							py={3}
							mt={3}
							style={{ backgroundColor: theme.palette.action.hover }}
						>
							<Typography color="primary" gutterBottom>
								{activeForm == FormType.contact ? (
									<FormattedMessage
										id="addContactDialogInfo"
										defaultMessage="Add Contact Details"
										description="This text will be displayed as info of contact dialog"
									/>
								) : (
									<FormattedMessage
										id="addAddressDialogInfo"
										defaultMessage="Add Address"
										description="This text will be displayed as info of address dialog"
									/>
								)}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={8}>
						<Stepper activeStep={activeForm} alternativeLabel>
							{formSteps.map((label) => {
								return (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
									</Step>
								);
							})}
						</Stepper>
						{activeForm == FormType.contact ? (
							<ContactForm entity_id={entity_id} entity_name={entity_name} />
						) : (
							<AddressForm
								contact_id={contact_id}
								entity_id={entity_id}
								entity_name={entity_name}
							/>
						)}
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}

export default AddContactDialog;
