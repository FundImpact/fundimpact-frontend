import React from "react";
import {
	Grid,
	TextField,
	Box,
	Dialog,
	Typography,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
import { FormattedMessage } from "react-intl";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { IContactInputElements } from "../../../../models/contact";
import { element } from "prop-types";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const InputElementRow = ({
	inputElement,
	replicateOrRemoveInputElement,
}: {
	inputElement: IContactInputElements[0];
	replicateOrRemoveInputElement: (removeElement?: boolean) => void;
}) => {
	return (
		<>
			{new Array(inputElement.numberOfTimeToReplicate).map(() => (
				<Grid item xs={12} style={{ display: "flex" }}>
					<Box p={2}>{inputElement.icon}</Box>
					<Box
						px={2}
						display="flex"
						width="100%"
						justifyContent="space-between"
						{...(inputElement?.fullWidth ? { flexDirection: "column" } : {})}
					>
						{inputElement.inputs.map((element) => (
							<Box p={1}>
								<TextField label={element.label} fullWidth />
							</Box>
						))}
					</Box>
					<Box mt={2}>
						{inputElement.showAddIcon && (
							<AddCircleOutlineIcon onClick={() => replicateOrRemoveInputElement()} />
						)}
					</Box>
				</Grid>
			))}
		</>
	);
};

function ContactFormView({
	contactInputElements,
	replicateOrRemoveInputElement,
}: {
	contactInputElements: IContactInputElements;
	replicateOrRemoveInputElement: ({
		elementPosition,
		removeElement,
	}: {
		elementPosition: number;
		removeElement?: boolean | undefined;
	}) => void;
}) {
	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={true}
			onClose={() => {}}
			data-testid="addContact-dialog"
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle>
				<FormattedMessage
					id="addContactDialogTitle"
					defaultMessage="Create New Contact"
					description="This text will be displayed as title of add contact dialog"
				/>
			</DialogTitle>
			<DialogContent dividers>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Formik initialValues={{}} onSubmit={() => {}}>
							{(formik) => (
								<Form>
									<Grid container>
										{contactInputElements.map((contactInputElement, index) => (
											<InputElementRow
												inputElement={contactInputElement}
												key={index}
												replicateOrRemoveInputElement={(
													removeElement = false
												) =>
													replicateOrRemoveInputElement({
														elementPosition: index,
														removeElement,
													})
												}
											/>
										))}
									</Grid>
								</Form>
							)}
						</Formik>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Grid container>
					<Grid item xs={9}>
						<Button onClick={() => {}} color="primary">
							Show More
						</Button>
					</Grid>
					<Grid item xs={3}>
						<Button onClick={() => {}} color="primary">
							Cancel
						</Button>
						<Button onClick={() => {}} color="primary">
							Ok
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</Dialog>
	);
}

export default ContactFormView;
