import React, { useState } from "react";
import {
	Grid,
	TextField,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	useTheme,
	makeStyles,
	createStyles,
	Theme,
	FormHelperText,
} from "@material-ui/core";
import { Formik, Form, FormikProps, FieldArray, FormikHandlers, ErrorMessage, getIn } from "formik";
import { FormattedMessage } from "react-intl";
import { IContactForm, IContactInputElements } from "../../../../models/contact";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import { FORM_ACTIONS } from "../../../../models/constants";

interface IMemoizedTextFieldProps {
	name: string;
	value: string;
	onBlur: FormikHandlers["handleBlur"];
	onChange: FormikHandlers["handleChange"];
	label: string;
	error: boolean;
}

const checkIsFormValid = (formErrors: Partial<IContactForm>) => {
	if (formErrors.contact_type) {
		return false;
	}
	let isFormValid = true;
	formErrors.addresses?.forEach((address) => {
		if (address.address_line_1 || address.address_line_2 || address.city || address.pincode) {
			isFormValid = false;
		}
	});
	formErrors.emails?.forEach((email) => {
		if (email.value || email.label) {
			isFormValid = false;
		}
	});
	formErrors.phone_numbers?.forEach((phone_number) => {
		if (phone_number.value || phone_number.label) {
			isFormValid = false;
		}
	});
	formErrors.name?.forEach((name) => {
		if (name.firstName || name.surname) {
			isFormValid = false;
		}
	});
	return isFormValid;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: theme.palette.background.paper,
			marginRight: theme.spacing(2),
		},
		cancelButton: {
			marginRight: theme.spacing(2),
			padding: theme.spacing(1),
			"&:hover": {
				color: `${theme.palette.error.dark} !important`,
			},
		},
	})
);

const getInputValueToInsert = (
	inputs: {
		label: string;
		size: 6 | 12;
		id: string;
		initialValue: string;
	}[]
) =>
	inputs.reduce((inputValues: { [key: string]: string }, input) => {
		inputValues[input.id] = "";
		return inputValues;
	}, {});

const compareMemoizeTextFieldProps = (
	prevProps: IMemoizedTextFieldProps,
	currentProps: IMemoizedTextFieldProps
) => {
	if (
		prevProps.name != currentProps.name ||
		prevProps.value != currentProps.value ||
		prevProps.error != currentProps.error
	) {
		return false;
	}
	return true;
};

const MemoizedTextField = React.memo(
	({
		name,
		value,
		onBlur,
		onChange,
		label,
		error,
		required,
	}: {
		name: string;
		value: string;
		onBlur: FormikHandlers["handleBlur"];
		onChange: FormikHandlers["handleChange"];
		label: string;
		error: boolean;
		required: boolean;
	}) => {
		return (
			<TextField
				name={name}
				value={value}
				onBlur={onBlur}
				onChange={onChange}
				label={label}
				data-testid={"dataTestId"}
				inputProps={{
					"data-testid": "testId",
				}}
				fullWidth
				error={error}
				required={required}
			/>
		);
	},
	compareMemoizeTextFieldProps
);

//here inputElement is the contactElement which is going to contain various inputs
const InputElementRow = ({
	inputElement,
	formik,
}: {
	inputElement: IContactInputElements[0];
	formik: FormikProps<any>;
}) => {
	const theme = useTheme();
	return (
		<Grid item xs={12} style={{ display: "flex" }}>
			<FieldArray name={inputElement.id}>
				{(arrayHelpers) => (
					<>
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
									{formik.values[inputElement.id]?.map(
										(value: any, index: number) => {
											return (
												<React.Fragment key={index}>
													<Grid container item xs={11}>
														{inputElement.inputsGroup.map(
															(input, elemIndex) => {
																return (
																	<Grid
																		item
																		xs={input.size}
																		key={elemIndex}
																	>
																		<Box p={1}>
																			<MemoizedTextField
																				name={`${inputElement.id}[${index}].${input.id}`}
																				value={
																					formik.values[
																						inputElement
																							.id
																					][index][
																						input.id
																					]
																				}
																				error={
																					!!getIn(
																						formik.errors,
																						`${inputElement.id}[${index}].${input.id}`
																					) &&
																					!!getIn(
																						formik.touched,
																						`${inputElement.id}[${index}].${input.id}`
																					)
																				}
																				onBlur={
																					formik.handleBlur
																				}
																				onChange={
																					formik.handleChange
																				}
																				label={input.label}
																				required={
																					input.required
																				}
																				// data-testid={
																				// 	"dataTestId"
																				// }
																				// inputProps={{
																				// 	"data-testid":
																				// 		"testId",
																				// }}
																			/>
																			<ErrorMessage
																				name={`${inputElement.id}[${index}].${input.id}`}
																				render={(msg) => (
																					<Box
																						pt={1}
																						style={{
																							color:
																								theme
																									.palette
																									.error
																									.dark,
																						}}
																					>
																						{msg}
																					</Box>
																				)}
																			/>
																		</Box>
																	</Grid>
																);
															}
														)}
													</Grid>
													{index !== 0 && (
														<Grid item xs={1}>
															<Box mt={2}>
																<IconButton
																	onClick={() =>
																		arrayHelpers.remove(index)
																	}
																>
																	<HighlightOffOutlinedIcon
																		color="error"
																		fontSize="small"
																	/>
																</IconButton>
															</Box>
														</Grid>
													)}
												</React.Fragment>
											);
										}
									)}
								</Grid>
							</Grid>
						</Box>
						<Box mt={2}>
							{inputElement.showAddIcon && (
								<IconButton
									onClick={() =>
										arrayHelpers.push(
											getInputValueToInsert(inputElement.inputsGroup)
										)
									}
								>
									<AddCircleOutlineIcon />
								</IconButton>
							)}
						</Box>
					</>
				)}
			</FieldArray>
		</Grid>
	);
};

function ContactFormView({
	contactInputElements,
	onSubmit,
	validate,
	initialValues,
	open,
	formAction,
	handleClose,
}: {
	contactInputElements: IContactInputElements;
	validate: (values: IContactForm) => Partial<IContactForm>;
	onSubmit: (valuesSubmitted: IContactForm) => Promise<void>;
	initialValues: IContactForm;
	open: boolean;
	formAction: FORM_ACTIONS;
	handleClose: () => void;
}) {
	const validateInitialValue = (initialValue: IContactForm) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};
	const classes = useStyles();
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const personalContactType = (
		<FormattedMessage
			id="personalContactType"
			defaultMessage="PERSONAL"
			description="This message will be shown as personal contact type in select field"
		/>
	);

	const officeContactType = (
		<FormattedMessage
			id="officeContactType"
			defaultMessage="OFFICE"
			description="This message will be shown as office contact type in select field"
		/>
	);

	const contactTypeOptions = [
		{ id: "PERSONAL", name: personalContactType },
		{ id: "OFFICE", name: officeContactType },
	];

	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={open}
			onClose={handleClose}
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
							initialValues={initialValues}
							onSubmit={(values: IContactForm) => onSubmit(values)}
							validate={(values: IContactForm) => {
								//formik will let us submit the form only when the error object is empty object
								//we are using fieldArray and we are providing an array of object that is why
								//the error object is a nested object, we have written a custom function to
								//check if error exist
								let errorsObj = validate(values);
								const formValid = checkIsFormValid(errorsObj);
								return formValid ? {} : errorsObj;
							}}
							isInitialValid={() => validateInitialValue(initialValues)}
						>
							{(formik) => {
								{
									setIsFormValid(
										formik.dirty &&
											checkIsFormValid(formik.errors as Partial<IContactForm>)
									);
								}
								return (
									<Form id="contact-form">
										<Grid container>
											{contactInputElements.map(
												(contactInputElement, index) => (
													<InputElementRow
														inputElement={contactInputElement}
														key={index}
														formik={formik}
													/>
												)
											)}
											<Grid item xs={12} style={{ display: "flex" }}>
												<Box p={2} mt={2}>
													<HomeWorkIcon fontSize="large" />
												</Box>
												<Box
													mt={2}
													px={3}
													display="flex"
													width={"81%"}
													justifyContent="space-between"
												>
													<FormControl fullWidth>
														<InputLabel
															id="demo-simple-select-label"
															required
														>
															<FormattedMessage
																id="contactFormContactTypeLabel"
																defaultMessage="Contact Type"
																description="This is contact type in contact form"
															/>
														</InputLabel>
														<Select
															labelId="demo-simple-select-label"
															id="demo-simple-select"
															value={formik.values.contact_type}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															label="Contact Type"
															name="contact_type"
															data-testid={"dataTestId"}
															inputProps={{
																"data-testid": "testId",
															}}
															error={
																!!formik.errors.contact_type &&
																!!formik.touched.contact_type
															}
															required
														>
															{contactTypeOptions.map(
																(contactType) => (
																	<MenuItem
																		value={contactType.id}
																		key={contactType.id}
																	>
																		{contactType.name}
																	</MenuItem>
																)
															)}
														</Select>
														<FormHelperText error>
															{formik.touched?.contact_type &&
																formik.errors?.contact_type}
														</FormHelperText>
													</FormControl>
												</Box>
											</Grid>
										</Grid>
									</Form>
								);
							}}
						</Formik>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					className={classes.button}
					disableRipple
					variant="contained"
					color="secondary"
					type="submit"
					form="contact-form"
					data-testid="createSaveButton"
					disabled={!isFormValid}
				>
					{formAction === FORM_ACTIONS.CREATE ? (
						<FormattedMessage
							id="contactFormCreateButton"
							defaultMessage="Create"
							description="This is create button in contact form"
						/>
					) : (
						<FormattedMessage
							id="contactFormUpdateButton"
							defaultMessage="Update"
							description="This is update button in contact form"
						/>
					)}
				</Button>
				<Button className={classes.cancelButton} onClick={handleClose}>
					<FormattedMessage
						id="contactFormCancelButton"
						defaultMessage="Cancel"
						description="This is cancel button in contact form"
					/>
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ContactFormView;
