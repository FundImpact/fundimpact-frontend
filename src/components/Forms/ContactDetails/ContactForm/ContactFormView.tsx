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
	IconButton,
	Divider,
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
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

const InputElementRow = ({
	inputElement,
	formik,
	replicateOrRemoveInputElement,
}: {
	inputElement: IContactInputElements[0];
	formik: any;
	replicateOrRemoveInputElement: ({
		removeElement,
		inputElemInputsIndex,
	}: {
		removeElement?: boolean | undefined;
		inputElemInputsIndex: number;
	}) => void;
}) => {
	return (
		<Grid item xs={12} style={{ display: "flex" }}>
			<Box p={2}>{inputElement.icon}</Box>
			<Box
				px={2}
				display="flex"
				width="100%"
				justifyContent="space-between"
				{...(inputElement?.fullWidth ? { flexDirection: "column" } : {})}
			>
				<Grid container>
					<Grid container item xs={12} justify="space-between">
						{inputElement.inputs.map((inputArray, index) => {
							let inputElemInputsIndex = -1;
							return (
								<>
									<Grid container item xs={11}>
										{inputArray.map((elem, elemIndex) => {
											inputElemInputsIndex = elemIndex;
											return (
												<Grid item xs={elem.size}>
													<Box p={1}>
														<TextField
															value={formik.values[elem.id]}
															error={
																!!formik.errors[elem.id] &&
																!!formik.touched[elem.id]
															}
															helperText={
																formik.touched[elem.id] &&
																formik.errors[elem.id]
															}
															onBlur={formik.handleBlur}
															onChange={formik.handleChange}
															label={elem.label}
															data-testid={"dataTestId"}
															inputProps={{
																"data-testid": "testId",
															}}
															fullWidth
															name={`${inputElement.id}[${index}].${elem.id}`}
														/>
													</Box>
												</Grid>
											);
										})}
									</Grid>
									{index !== 0 && (
										<Grid item xs={1}>
											<Box mt={2}>
												<IconButton
													onClick={() => {
														console.log("acnkad", index);
														replicateOrRemoveInputElement({
															removeElement: true,
															inputElemInputsIndex: index,
														});
													}}
												>
													<HighlightOffOutlinedIcon
														color="error"
														fontSize="small"
													/>
												</IconButton>
											</Box>
										</Grid>
									)}
								</>
							);
						})}
					</Grid>
				</Grid>

				{/* {inputElement.inputs.map((element) => (
					<Box p={1}>
						<TextField label={element.label} fullWidth />
					</Box>
				))} */}
			</Box>
			<Box mt={2}>
				{inputElement.showAddIcon && (
					<IconButton
						onClick={() =>
							replicateOrRemoveInputElement({
								removeElement: false,
								inputElemInputsIndex: -1,
							})
						}
					>
						<AddCircleOutlineIcon />
					</IconButton>
				)}
			</Box>
		</Grid>
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
		inputElemInputsIndex,
	}: {
		elementPosition: number;
		removeElement?: boolean | undefined;
		inputElemInputsIndex: number;
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
						<Formik
							initialValues={{}}
							onSubmit={(values: any) => {
								console.log("valuescontact", values);
							}}
						>
							{(formik) => (
								<Form>
									<Grid container>
										{contactInputElements.map((contactInputElement, index) => (
											<InputElementRow
												inputElement={contactInputElement}
												key={index}
												formik={formik}
												replicateOrRemoveInputElement={({
													removeElement = false,
													inputElemInputsIndex = -1,
												}: {
													removeElement?: boolean | undefined;
													inputElemInputsIndex: number;
												}) => {
													console.log("replicated", index);
													replicateOrRemoveInputElement({
														elementPosition: index,
														removeElement,
														inputElemInputsIndex,
													});
												}}
											/>
										))}
									</Grid>
									<Box mt={2}>
										<Divider />
									</Box>

									<Grid container item xs={12} justify="space-between">
										<Grid>
											<Box display="flex" p={1}>
												<Button type="submit" color="primary">
													Show more
												</Button>
											</Box>
										</Grid>
										<Grid>
											<Box display="flex" p={1}>
												<Box>
													<Button
														type="submit"
														color="primary"
														onClick={() => {}}
													>
														Submit
													</Button>
												</Box>
												<Box>
													<Button type="submit" color="primary">
														Cancel
													</Button>
												</Box>
											</Box>
										</Grid>
									</Grid>
								</Form>
							)}
						</Formik>
					</Grid>
				</Grid>
			</DialogContent>
			{/* <DialogActions>
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
						<Button type="submit" color="primary">
							Ok
						</Button>
					</Grid>
				</Grid>
			</DialogActions> */}
		</Dialog>
	);
}

export default ContactFormView;
