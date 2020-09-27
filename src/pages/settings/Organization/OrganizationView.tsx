import React, { useCallback } from "react";
import { IOrganisationForm, IOrganizationInputFields } from "../../../models/organisation/types";
import {
	Grid,
	Paper,
	Typography,
	Box,
	makeStyles,
	Theme,
	TextField,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Button,
	Divider,
	CircularProgress,
} from "@material-ui/core";
import UploadFile from "../../../components/UploadFile";
import { Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";

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

//check required
function OrganizationView({
	validate,
	inputFields,
	registrationTypes,
	initialValues,
	onSubmit,
	loading,
	logo,
}: {
	loading: boolean;
	validate: (values: IOrganisationForm) => Partial<IOrganisationForm>;
	inputFields: IOrganizationInputFields[];
	registrationTypes: { id: string; reg_type: string }[];
	initialValues: IOrganisationForm;
	onSubmit: (value: IOrganisationForm) => Promise<void>;
	logo: string;
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
												<UploadFile<IOrganisationForm>
													formik={formik}
													title="Upload Logo"
													height="200px"
													name="icon"
													required={!!initialValues.icon}
													testId="createOrganizationIconInput"
													dataTestId="createOrganizationIcon"
													id="icon"
													logo={logo}
												/>
											</Grid>
											<Grid item xs={9}>
												<Grid container spacing={2}>
													<Grid item xs={12}>
														<Typography variant="h5">
															<FormattedMessage
																id="organiztionUpdateFormHeading"
																defaultMessage="About Organization"
																description="This text will be heading of organization update form"
															/>
														</Typography>
													</Grid>
													<Grid item xs={12}>
														<Typography className={classes.subHeading}>
															<FormattedMessage
																id="updateOrganizationBasicDetails"
																defaultMessage="Update the organization information"
																description="This text will tell user to update basic details of organization"
															/>
														</Typography>
														{inputFields
															.slice(1, 4)
															.map(
																(
																	element: IOrganizationInputFields,
																	index
																) => (
																	<Box pl={1} mt={2} key={index}>
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
																			inputProps={{
																				"data-testid":
																					element.testId,
																			}}
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
															<FormattedMessage
																id="organiztionRegistarationHeadings"
																defaultMessage="Registration type"
																description="This text will tell user about the registartion types of orgs"
															/>
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
																	data-testid="createOrganizationRegistrationType"
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
															<FormattedMessage
																id="organiztionHomeCountrySetting"
																defaultMessage="Home country settings"
																description="This text will tell user to update home contry"
															/>
														</Typography>
														{inputFields
															.slice(4)
															.map((element, index) => (
																<Box mt={2} pl={1} key={index}>
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
																					required={true}
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
																					inputProps={{
																						"data-testid":
																							element.testId,
																					}}
																					data-testid={
																						element.dataTestId
																					}
																					required={true}
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
																<FormattedMessage
																	id="organiztionUpdateButton"
																	defaultMessage="Update"
																	description="This text will tell user to update organization info"
																/>
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
		</Box>
	);
}

export default OrganizationView;
