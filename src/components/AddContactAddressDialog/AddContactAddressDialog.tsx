import React, { useState, useEffect } from "react";
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
import { IAddress } from "../../models/address";

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
			dialogType?: AddContactAddressDialogType.contact;
			formActions: FORM_ACTIONS.UPDATE;
			contactFormInitialValues: IContact;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			entity_name: string;
			entity_id: string;
			dialogType?: AddContactAddressDialogType.address;
			formActions: FORM_ACTIONS.UPDATE;
			addressFormInitialValues: IAddress;
	  };

function AddContactAddressDialog(props: IAddContactAddressDialog) {
	const { open, handleClose, entity_name, entity_id, dialogType } = props;
	const theme = useTheme();
	const [activeForm, setActiveForm] = useState(
		dialogType !== undefined ? dialogType : AddContactAddressDialogType.contact
	);
	const [contact_id, setContact_id] = useState<string>("");

	const closeDialog = () => {
		setActiveForm(dialogType !== undefined ? dialogType : AddContactAddressDialogType.contact);
		handleClose();
	};

	const formSteps = getFormSteps();

	const getCreatedOrUpdatedContact = (
		contact: ICreateContact["createT4DContact"]["t4DContact"] | null
	) => {
		if (
			!contact ||
			props.formActions == FORM_ACTIONS.UPDATE ||
			dialogType == AddContactAddressDialogType.contact
		) {
			closeDialog();
		} else {
			setContact_id(contact.id);
			setActiveForm(AddContactAddressDialogType.address);
		}
	};

	const getCreatedOrUpdatedAddress = (
		address: ICreateAddress["createT4DAddress"]["t4DAddress"] | null
	) => {
		closeDialog();
	};

	const addContactMessage = (
		<FormattedMessage
			id="addContactDialogTitle"
			defaultMessage="Add Contact"
			description="This text will be displayed as title of add contact dialog"
		/>
	);

	const updateContactMessage = (
		<FormattedMessage
			id="updateContactDialogTitle"
			defaultMessage="Update Contact"
			description="This text will be displayed as title of update contact dialog"
		/>
	);

	const addAddressMessage = (
		<FormattedMessage
			id="addContactDialogTitle"
			defaultMessage="Add Address"
			description="This text will be displayed as title of add address dialog"
		/>
	);

	const updateAddressMessage = (
		<FormattedMessage
			id="updateContactDialogTitle"
			defaultMessage="Update Address"
			description="This text will be displayed as title of update address dialog"
		/>
	);
	const addContactSubtitle = (
		<FormattedMessage
			id="addContactDialogSubtitle"
			defaultMessage="Add Contact Details"
			description="This text will be displayed as subtitle of add contact dialog"
		/>
	);

	const updateContactSubtitle = (
		<FormattedMessage
			id="updateContactDialogSubtitle"
			defaultMessage="Update Contact Details"
			description="This text will be displayed as subtitle of update contact dialog"
		/>
	);

	const addAddressSubtitle = (
		<FormattedMessage
			id="addContactDialogSubtitle"
			defaultMessage="Add Address Details"
			description="This text will be displayed as subtitle of add address dialog"
		/>
	);

	const updateAddressSubtitle = (
		<FormattedMessage
			id="updateContactDialogSubtitle"
			defaultMessage="Update Address Details"
			description="This text will be displayed as subtitle of update address dialog"
		/>
	);

	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={closeDialog}
			data-testid="addContact-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box px={3} py={4}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography data-testid="dialog-header" variant="h6" gutterBottom>
							{activeForm == AddContactAddressDialogType.contact
								? props.formActions === FORM_ACTIONS.UPDATE
									? updateContactMessage
									: addContactMessage
								: props.formActions === FORM_ACTIONS.UPDATE
								? updateAddressMessage
								: addAddressMessage}
						</Typography>
						<Box
							px={2}
							py={3}
							mt={3}
							style={{ backgroundColor: theme.palette.action.hover }}
						>
							<Typography color="primary" gutterBottom>
								{activeForm == AddContactAddressDialogType.contact
									? props.formActions === FORM_ACTIONS.UPDATE
										? updateContactSubtitle
										: addContactSubtitle
									: props.formActions === FORM_ACTIONS.UPDATE
									? updateAddressSubtitle
									: addAddressSubtitle}
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
								{...(props.formActions == FORM_ACTIONS.UPDATE &&
								props.dialogType == AddContactAddressDialogType.contact
									? {
											initialValues: props.contactFormInitialValues,
											formAction: FORM_ACTIONS.UPDATE,
									  }
									: { formAction: FORM_ACTIONS.CREATE })}
							/>
						) : (
							<AddressForm
								t_4_d_contact={contact_id}
								getCreatedOrUpdatedAddress={getCreatedOrUpdatedAddress}
								{...(props.formActions == FORM_ACTIONS.UPDATE &&
								props.dialogType == AddContactAddressDialogType.address
									? {
											initialValues: props.addressFormInitialValues,
											formAction: FORM_ACTIONS.UPDATE,
									  }
									: { formAction: FORM_ACTIONS.CREATE })}
							/>
						)}
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}

export default AddContactAddressDialog;
