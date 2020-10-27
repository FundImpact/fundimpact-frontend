import {
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	InputLabel,
	makeStyles,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	SimplePaletteColorOptions,
	TextField,
	Theme,
	Typography,
	ButtonGroup,
} from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { Form, Formik, FormikProps } from "formik";
import React, { useCallback, useEffect } from "react";
import { FormattedMessage, useIntl, IntlShape } from "react-intl";

import UploadFile from "../../../components/UploadFile";
import { useDashBoardData, useDashboardDispatch } from "../../../contexts/dashboardContext";
import { IDashboardDataContext, ICountry } from "../../../models";
import { primaryColor, secondaryColor } from "../../../models/constants";
import { IOrganisationForm, IOrganizationInputFields } from "../../../models/organisation/types";
import { setOrganisation } from "../../../reducers/dashboardReducer";
import AddContactDialog from "../../../components/AddContactAddressDialog";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

enum colorType {
	primary = "primary",
	secondary = "secondary",
}

const getNewThemeObject = (
	dashboardData: IDashboardDataContext | undefined,
	primarySecondaryColors: {
		primary: {
			main: string;
		};
		secondary: {
			main: string;
		};
	}
) => ({
	...dashboardData?.organization?.theme,
	palette: {
		...dashboardData?.organization?.theme?.palette,
		...primarySecondaryColors,
	},
});

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

//move it in container
const setDashboardColor = ({
	dashboardDispatch,
	dashboardData,
	themeColorTypePrimaryOrSecondary,
	color,
}: {
	dashboardDispatch: React.Dispatch<any>;
	dashboardData: IDashboardDataContext | undefined;
	themeColorTypePrimaryOrSecondary: colorType;
	color: string;
}) => {
	const newColor =
		themeColorTypePrimaryOrSecondary == colorType.primary
			? {
					primary: {
						main: color,
					},
					secondary: {
						main:
							(dashboardData?.organization?.theme?.palette
								?.secondary as SimplePaletteColorOptions)?.main || secondaryColor,
					},
			  }
			: {
					secondary: {
						main: color,
					},
					primary: {
						main:
							(dashboardData?.organization?.theme?.palette
								?.primary as SimplePaletteColorOptions)?.main || primaryColor,
					},
			  };

	dashboardDispatch(
		setOrganisation(
			Object.assign({}, dashboardData?.organization, {
				theme: getNewThemeObject(dashboardData, newColor),
			})
		)
	);
};

const resetDashboardColor = ({
	formikInstanceRef,
	dashboardDispatch,
	dashboardData,
}: {
	formikInstanceRef: React.MutableRefObject<FormikProps<IOrganisationForm> | undefined>;
	dashboardDispatch: React.Dispatch<any>;
	dashboardData: IDashboardDataContext | undefined;
}) => {
	if (
		(formikInstanceRef.current?.values?.theme?.palette?.primary as SimplePaletteColorOptions)
			?.main !=
		(dashboardData?.organization?.theme?.palette?.primary as SimplePaletteColorOptions)?.main
	) {
		setDashboardColor({
			dashboardDispatch,
			dashboardData,
			themeColorTypePrimaryOrSecondary: colorType.primary,
			color:
				(dashboardData?.organization?.theme?.palette?.primary as SimplePaletteColorOptions)
					?.main || primaryColor,
		});
	}
	if (
		(formikInstanceRef.current?.values?.theme?.palette?.secondary as SimplePaletteColorOptions)
			?.main !=
		(dashboardData?.organization?.theme?.palette?.secondary as SimplePaletteColorOptions)?.main
	) {
		setDashboardColor({
			dashboardDispatch,
			dashboardData,
			themeColorTypePrimaryOrSecondary: colorType.secondary,
			color:
				(dashboardData?.organization?.theme?.palette
					?.secondary as SimplePaletteColorOptions)?.main || secondaryColor,
		});
	}
};

//check required
function OrganizationView({
	validate,
	inputFields,
	registrationTypes,
	initialValues,
	onSubmit,
	loading,
	logo,
	countryList,
	contactAddressDialogOpen,
	setContactAddressDialogOpen,
}: {
	loading: boolean;
	validate: (values: IOrganisationForm) => Partial<IOrganisationForm>;
	inputFields: IOrganizationInputFields[];
	registrationTypes: { id: string; reg_type: string }[];
	initialValues: IOrganisationForm;
	onSubmit: (value: IOrganisationForm) => Promise<void>;
	logo: string;
	countryList: ICountry[];
	contactAddressDialogOpen: boolean;
	setContactAddressDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
	const formikInstanceRef = React.useRef<FormikProps<IOrganisationForm>>();
	const dashboardDispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	useEffect(() => {
		return () => {
			if (formikInstanceRef.current?.submitCount == 0) {
				resetDashboardColor({ formikInstanceRef, dashboardDispatch, dashboardData });
			}
		};
	}, []);

	const intl = useIntl();

	const textFieldsLabelFormattedMessageObj: { [key: string]: any } = {
		Name: intl.formatMessage({
			id: `organizationNameInput`,
			defaultMessage: "Name",
			description: `This text will be show as name label on text field`,
		}),
		"Legal Name": intl.formatMessage({
			id: `organizationLegalNameInput`,
			defaultMessage: "Legal Name",
			description: `This text will be show as legal name label on text field `,
		}),
		"Short Name": intl.formatMessage({
			id: `organizationShortNameInput`,
			defaultMessage: "Short Name",
			description: `This text will be show as short name label on text field`,
		}),
		"Choose country": intl.formatMessage({
			id: `organizationChooseCountryInput`,
			defaultMessage: "Choose country",
			description: `This text will be show as Choose country label on select field`,
		}),
	};

	return (
		<Box p={2}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h5">
						<FormattedMessage
							id="organizationSettingPageHeading"
							defaultMessage="Organization Info"
							description="This text will be heading of organization setting page"
						/>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<AddContactDialog
						open={contactAddressDialogOpen}
						handleClose={() => setContactAddressDialogOpen(false)}
					/>
					<Paper>
						<Box p={2}>
							<Formik
								initialValues={initialValues}
								onSubmit={onSubmit}
								validate={validate}
								isInitialValid={() => validateInitialValue(initialValues)}
							>
								{(formik) => {
									formikInstanceRef.current = formik;
									return (
										<Form>
											<Grid container spacing={5}>
												<Grid item xs={3}>
													<Grid container spacing={3}>
														<Grid item xs={12}>
															<UploadFile<IOrganisationForm>
																formik={formik}
																title="Upload Logo"
																height="200px"
																name="logo"
																required={!!initialValues.logo}
																testId="createOrganizationIconInput"
																dataTestId="createOrganizationIcon"
																id="logo"
																logo={logo}
															/>
														</Grid>
														<Grid item xs={12}>
															<TextField
																value={
																	(formik.values.theme?.palette
																		?.primary as SimplePaletteColorOptions)
																		?.main || primaryColor
																}
																type="color"
																onChange={(event) => {
																	setDashboardColor({
																		dashboardDispatch,
																		dashboardData,
																		themeColorTypePrimaryOrSecondary:
																			colorType.primary,
																		color: event.target.value,
																	});
																	formik.handleChange(event);
																}}
																onBlur={formik.handleBlur}
																fullWidth
																label={intl.formatMessage({
																	id: `colorPickerPrimaryColor`,
																	defaultMessage:
																		"Choose Primary Color",
																	description: `This text will be show on color picker as Choose Primary Color`,
																})}
																required={
																	!!(initialValues.theme?.palette
																		?.primary as SimplePaletteColorOptions)
																		?.main
																}
																inputProps={{
																	"data-testid":
																		"createOrganizationPrimaryColorInput",
																}}
																name={"theme.palette.primary.main"}
																data-testid={
																	"createOrganizationPrimaryColor"
																}
																error={
																	!!((formik.errors.theme
																		?.palette as PaletteOptions)
																		?.primary as SimplePaletteColorOptions)
																		?.main &&
																	!!((formik.touched.theme
																		?.palette as PaletteOptions)
																		?.primary as SimplePaletteColorOptions)
																		?.main
																}
																variant="outlined"
																helperText={
																	((formik.touched.theme
																		?.palette as PaletteOptions)
																		?.primary as SimplePaletteColorOptions)
																		?.main &&
																	((formik.errors.theme
																		?.palette as PaletteOptions)
																		?.primary as SimplePaletteColorOptions)
																		?.main
																}
															/>
														</Grid>

														<Grid item xs={12}>
															<TextField
																value={
																	(formik.values.theme?.palette
																		?.secondary as SimplePaletteColorOptions)
																		?.main
																}
																error={
																	!!((formik.errors.theme
																		?.palette as PaletteOptions)
																		?.secondary as SimplePaletteColorOptions)
																		?.main &&
																	!!((formik.touched.theme
																		?.palette as PaletteOptions)
																		?.secondary as SimplePaletteColorOptions)
																		?.main
																}
																type="color"
																onChange={(event) => {
																	formik.handleChange(event);
																	setDashboardColor({
																		dashboardDispatch,
																		dashboardData,
																		themeColorTypePrimaryOrSecondary:
																			colorType.secondary,
																		color: event.target.value,
																	});
																}}
																onBlur={formik.handleBlur}
																fullWidth
																label={intl.formatMessage({
																	id: `colorPickerSecondaryColor`,
																	defaultMessage:
																		"Choose Secondary Color",
																	description: `This text will be show on color picker as Choose Secondary Color`,
																})}
																required={
																	!!(initialValues.theme?.palette
																		?.secondary as SimplePaletteColorOptions)
																		?.main
																}
																inputProps={{
																	"data-testid":
																		"createOrganizationSecondaryColorInput",
																}}
																name={
																	"theme.palette.secondary.main"
																}
																data-testid={
																	"createOrganizationSecondaryColor"
																}
																variant="outlined"
																helperText={
																	((formik.touched.theme
																		?.palette as PaletteOptions)
																		?.secondary as SimplePaletteColorOptions)
																		?.main &&
																	((formik.errors.theme
																		?.palette as PaletteOptions)
																		?.secondary as SimplePaletteColorOptions)
																		?.main
																}
															/>
														</Grid>
														<Grid item xs={12}>
															<Button
																startIcon={<PersonAddIcon />}
																variant="contained"
																color="secondary"
																fullWidth
																onClick={() =>
																	setContactAddressDialogOpen(
																		true
																	)
																}
															>
																<FormattedMessage
																	id={`addContactButton`}
																	defaultMessage={`Add Contact`}
																	description={`This text will be shown on add contact button`}
																/>
															</Button>
														</Grid>
													</Grid>
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
															<Typography
																className={classes.subHeading}
															>
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
																		<Box
																			pl={1}
																			mt={2}
																			key={index}
																		>
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
																					!!formik
																						.touched[
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
																				label={
																					textFieldsLabelFormattedMessageObj[
																						element
																							.label
																					]
																				}
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
																						(formik
																							.errors[
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
															<Typography
																className={classes.subHeading}
															>
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
																		onChange={
																			formik.handleChange
																		}
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
																					value={
																						element.id
																					}
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
															<Typography
																className={classes.subHeading}
															>
																<FormattedMessage
																	id="organiztionHomeCountrySetting"
																	defaultMessage="Home country settings"
																	description="This text will tell user to update home contry"
																/>
															</Typography>

															<Box mt={2} pl={1}>
																<Grid container>
																	<Grid item xs={7}>
																		<Typography>
																			<FormattedMessage
																				id="mainLabelForOrganizationCountryInput"
																				defaultMessage="Select home country of
																				the organization"
																				description="This text will be shown as main label for select country input"
																			/>
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
																				id="demo-simple-select-outlined-label"
																				required={true}
																			>
																				<FormattedMessage
																					id="labelForOrganizationCountryInput"
																					defaultMessage="Choose country"
																					description="This text will be shown as label for select country input"
																				/>
																			</InputLabel>

																			<Select
																				labelId={
																					"demo-simple-select-outlined-label"
																				}
																				id={
																					"demo-simple-select-outlined"
																				}
																				error={
																					!!formik.errors
																						.country &&
																					!!formik.touched
																						.country
																				}
																				value={
																					formik.values
																						.country
																				}
																				onChange={
																					formik.handleChange
																				}
																				onBlur={
																					formik.handleBlur
																				}
																				label={
																					"Choose country"
																				}
																				name="country"
																				inputProps={{
																					"data-testid":
																						"createOrganizationCountryOption",
																				}}
																				data-testid={
																					"createOrganizationCountry"
																				}
																				required={true}
																			>
																				{!countryList?.length ? (
																					<MenuItem
																						disabled
																					>
																						<em>
																							<FormattedMessage
																								id="noCountryAvailableMessage"
																								defaultMessage="No
																								country
																								available"
																								description="This text will be shown when no country is available"
																							/>
																						</em>
																					</MenuItem>
																				) : null}

																				{countryList?.map(
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
																			<FormHelperText>
																				{formik.touched
																					.country &&
																					formik.errors
																						.country}
																			</FormHelperText>
																		</FormControl>
																	</Grid>
																</Grid>
															</Box>
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
									);
								}}
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
