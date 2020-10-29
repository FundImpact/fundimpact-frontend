import React, { useState } from "react";
import { Dialog, Typography, Box, useTheme, Grid, StepLabel } from "@material-ui/core";
import ContactForm from "../Forms/ContactDetails/ContactForm";
import { FormattedMessage } from "react-intl";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import AddressForm from "../Forms/ContactDetails/AddressForm";
import { ICreateContactVariables, ICreateContact } from "../../models/contact/query";
import { ICreateAddress } from "../../models/address/query";
import { AddContactAddressDialogType } from "../../models/constants";
import { FORM_ACTIONS } from "../../models/constants";
import { IContactForm, IContact } from "../../models/contact";

function getFormSteps() {
	return ["Create Contact", "Add Address"];
}

type IAddContactAddressDialog =
	| {
			open: boolean;
			handleClose: () => void;
			entity_name: string;
			entity_id: string;
			dialogType?: AddContactAddressDialogType;
			formActions?: FORM_ACTIONS.CREATE;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			entity_name: string;
			entity_id: string;
			dialogType?: AddContactAddressDialogType;
			formActions: FORM_ACTIONS.UPDATE;
			contactFormInitialValues: IContact;
	  };

function AddContactAddressDialog(props: IAddContactAddressDialog) {
	const { open, handleClose, entity_name, entity_id, dialogType } = props;

	const theme = useTheme();
	const [activeForm, setActiveForm] = useState(AddContactAddressDialogType.contact);
	const [contact_id, setContact_id] = useState<string>("");
	const formSteps = getFormSteps();

	const getCreatedOrUpdatedContact = (
		contact: ICreateContact["createT4DContact"]["t4DContact"] | null
	) => {
		if (
			!contact ||
			props.formActions == FORM_ACTIONS.UPDATE ||
			dialogType == AddContactAddressDialogType.contact
		) {
			handleClose();
		} else {
			setContact_id(contact.id);
			setActiveForm(AddContactAddressDialogType.address);
		}
	};

	const getAddressCreated = (address: ICreateAddress) => {
		handleClose();
	};

	const getAddressCreated = (address: ICreateAddress) => {
		handleClose();
	};

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
							{activeForm == AddContactAddressDialogType.contact ? (
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
								{activeForm == AddContactAddressDialogType.contact ? (
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
						{dialogType == undefined && (
							<Stepper activeStep={activeForm} alternativeLabel>
								{formSteps.map((label) => {
									return (
										<Step key={label}>
											<StepLabel>{label}</StepLabel>
										</Step>
									);
								})}
							</Stepper>
						)}
						{activeForm == AddContactAddressDialogType.contact ? (
							<ContactForm
								entity_id={entity_id}
								entity_name={entity_name}
								getCreatedOrUpdatedContact={getCreatedOrUpdatedContact}
								{...(props.formActions == FORM_ACTIONS.UPDATE
									? {
											initialValues: props.contactFormInitialValues,
											formAction: FORM_ACTIONS.UPDATE,
									  }
									: { formAction: FORM_ACTIONS.CREATE })}
							/>
						) : (
							<AddressForm
								t_4_d_contact={contact_id}
								getAddressCreated={getAddressCreated}
								// formActions={formActions}
							/>
						)}
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}

export default AddContactAddressDialog;