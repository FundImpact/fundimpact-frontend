import React, { useCallback } from "react";
import CommonForm from "../../../components/CommonForm/";
import { FORM_ACTIONS } from "../../../models/constants";
import { IOrganisationForm } from "../../../models/organisation/types";
import {
	Grid,
	Paper,
	Typography,
	Box,
	makeStyles,
	Theme,
	TextField,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Button,
	Divider,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { IInputFields } from "../../../models";
import UploadFile from "../../../components/UploadFile";
import { Form, Formik } from "formik";
import { useDashBoardData } from "../../../contexts/dashboardContext";

const useStyles = makeStyles((theme: Theme) => ({
	uploadBox: {
		backgroundColor: theme.palette.grey[400],
		height: "200px",
		textAlign: "center",
	},
	formControl: {
		width: "100%",
	},
	button: {
		color: theme.palette.background.paper,
		marginRight: theme.spacing(2),
	},
	subHeading: {
		fontWeight: theme.typography.fontWeightMedium,
	},
}));

interface IOrganizationInputFields extends IInputFields {
	helperText?: string;
	displayName?: string;
}

//all key to all array map
//add divider line
//add key every where
//check required
//remove gender 1 from name
function OrganizationView({
	validate,
	inputFields,
	registrationTypes,
	initialValues,
	onSubmit,
}: {
	validate: (values: IOrganisationForm) => Partial<IOrganisationForm>;
	inputFields: IOrganizationInputFields[];
	registrationTypes: { id: string; reg_type: string }[];
	initialValues: IOrganisationForm;
	onSubmit: (value: IOrganisationForm) => void;
}) {
	const classes = useStyles();
	const validateInitialValue = useCallback(
		(initialValue: any) => {
			const errors = validate(initialValue) as object;
			if (!errors) return true;
			return Object.keys(errors).length ? false : true;
		},
		[validate]
	);

	return (
		<Box p={2}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h5">Organization Info</Typography>
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<Box p={2}>
							<Formik
								initialValues={initialValues}
								onSubmit={onSubmit}
								validate={validate}
								isInitialValid={() => validateInitialValue(initialValues)}
								enableReinitialize
							>
								{(formik) => (
									<Form>
										<Grid container spacing={5}>
											<Grid item xs={3}>
												<UploadFile title="Upload Logo" height="200px" />
											</Grid>
											<Grid item xs={9}>
												<Grid container spacing={2}>
													<Grid item xs={12}>
														<Typography variant="h5">
															About Organization
														</Typography>
													</Grid>
													<Grid item xs={12}>
														<Typography className={classes.subHeading}>
															Update the organization information
														</Typography>
														{inputFields
															.slice(1, 4)
															.map(
																(
																	element: IOrganizationInputFields
																) => (
																	<Box pl={1} mt={2}>
																		<TextField
																			value={
																				formik.values[
																					element.name as keyof IOrganisationForm
																				]
																			}
																			error={
																				!!formik.errors[
																					element.name as keyof IOrganisationForm
																				] &&
																				!!formik.touched[
																					element.name as keyof IOrganisationForm
																				]
																			}
																			onChange={
																				formik.handleChange
																			}
																			onBlur={
																				formik.handleBlur
																			}
																			fullWidth
																			label={element.label}
																			required={
																				!!initialValues[
																					element.name as keyof IOrganisationForm
																				]
																			}
																			name={element.name}
																			data-testid={
																				element.dataTestId
																			}
																			variant="outlined"
																			helperText={
																				(formik.touched[
																					element.name as keyof IOrganisationForm
																				] &&
																					(formik.errors[
																						element.name as keyof IOrganisationForm
																					] ||
																						element.helperText)) ||
																				element.helperText
																			}
																		/>
																	</Box>
																)
															)}
													</Grid>

													<Grid item xs={12}>
														<Divider />
													</Grid>
													<Grid item xs={12}>
														<Typography className={classes.subHeading}>
															Registration type
														</Typography>
														<Box pl={1} mt={1}>
															<FormControl component="fieldset">
																<RadioGroup
																	aria-label="organization_registration_type"
																	name="organization_registration_type"
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={
																		formik.values
																			.organization_registration_type
																	}
																>
																	{registrationTypes.map(
																		(element, index) => (
																			<FormControlLabel
																				key={index}
																				control={
																					<Radio color="primary" />
																				}
																				label={
																					element.reg_type
																				}
																				value={element.id}
																			/>
																		)
																	)}
																</RadioGroup>
															</FormControl>
														</Box>
													</Grid>
													<Grid item xs={12}>
														<Divider />
													</Grid>
													<Grid item xs={12}>
														<Typography className={classes.subHeading}>
															Home country settings
														</Typography>
														{inputFields.slice(5).map((element) => (
															<>
																<Box mt={2} pl={1}>
																	<Grid container>
																		<Grid item xs={7}>
																			<Typography>
																				{element.helperText}
																			</Typography>
																		</Grid>
																		<Grid item xs={5}>
																			<FormControl
																				variant="outlined"
																				className={
																					classes.formControl
																				}
																			>
																				<InputLabel
																					id={
																						element.inputLabelId
																					}
																					required={
																						element.required
																					}
																				>
																					{element.label}
																				</InputLabel>

																				<Select
																					labelId={
																						element.selectLabelId
																					}
																					id={
																						element.selectId
																					}
																					error={
																						!!formik
																							.errors[
																							element.name as keyof IOrganisationForm
																						] &&
																						!!formik
																							.touched[
																							element.name as keyof IOrganisationForm
																						]
																					}
																					value={
																						formik
																							.values[
																							element.name as keyof IOrganisationForm
																						]
																					}
																					onChange={
																						formik.handleChange
																					}
																					onBlur={
																						formik.handleBlur
																					}
																					label={
																						element.label
																					}
																					name={
																						element.name
																					}
																					data-testid={
																						element.dataTestId
																					}
																					inputProps={{
																						"data-testid":
																							element.testId,
																					}}
																					required={
																						!!initialValues[
																							element.name as keyof IOrganisationForm
																						]
																					}
																				>
																					{!element
																						.optionsArray
																						?.length ? (
																						<MenuItem
																							disabled
																						>
																							<em>
																								No{" "}
																								{
																									element.displayName
																								}{" "}
																								available
																							</em>
																						</MenuItem>
																					) : null}

																					{element.optionsArray?.map(
																						(
																							elem: {
																								name: string;
																								id: string;
																							},
																							index: number
																						) => (
																							<MenuItem
																								key={
																									index
																								}
																								value={
																									elem.id
																								}
																							>
																								{
																									elem.name
																								}
																							</MenuItem>
																						)
																					)}
																				</Select>
																				<FormHelperText
																					error
																				>
																					{formik.touched[
																						element.name as keyof IOrganisationForm
																					] &&
																						formik
																							.errors[
																							element.name as keyof IOrganisationForm
																						]}
																				</FormHelperText>
																			</FormControl>
																		</Grid>
																	</Grid>
																</Box>
															</>
														))}
													</Grid>
													<Grid item xs={12}>
														<Box display="flex">
															<Button
																className={classes.button}
																disableRipple
																variant="contained"
																color="secondary"
																type="submit"
																data-testid="createSaveButton"
																disabled={!formik.isValid}
															>
																Update
															</Button>
														</Box>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

export default OrganizationView;
