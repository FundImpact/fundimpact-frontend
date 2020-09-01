import {
	Button,
	createStyles,
	Grid,
	TextField,
	Theme,
	FormControl,
	InputLabel,
	Select,
	FormHelperText,
	MenuItem,
	Box,
	OutlinedInput,
	InputAdornment,
	IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";

import { UserDispatchContext } from "../../../contexts/userContext";
import { usePostFetch } from "../../../hooks/fetch/usePostFetch";
import useRouteResolver from "../../../hooks/routes/useRouteResolver";
import { IBasicInformation } from "../../../models";
import { IUserSignupResponse } from "../../../models/signup/userSignUpResponse";
import { setUser } from "../../../reducers/userReducer";
import { SIGNUP_API, COUNTRY_LIST_API } from "../../../utils/endpoints.util";
import { getDefaultBasicInformation } from "../../../utils/signup.util";
import AlertMsg from "../../AlertMessage/AlertMessage";
import GlobalLoader from "../../commons/GlobalLoader";
import { useGetFetch } from "../../../hooks/fetch/useFetch";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
// import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			display: "flex",
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				spacing: 1,
			},
		},
	})
);

const validate = (values: IBasicInformation) => {
	let errors: Partial<IBasicInformation> = {};

	if (!values.email) {
		errors.email = "Email is required";
	}
	if (!values.organization.name) {
		if (!errors.organization) {
			errors.organization = { name: "", country: "" };
		}
		errors.organization.name = "Organization name is required";
	}
	if (!values.organization.country) {
		if (!errors.organization) {
			errors.organization = { name: "", country: "" };
		}
		errors.organization.country = "Organization country is required";
	}
	if (!values.password) {
		errors.password = "Password is required";
	}
	if (!values.password) {
		errors.password = "Password is required";
	}
	return errors;
};

const BasicDetailsForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const initialValues: IBasicInformation = getDefaultBasicInformation();
	const classes = useStyles();

	let { error, loading, data: singupSuccessfulResponse, setPayload } = usePostFetch<
		IUserSignupResponse
	>({ body: null, url: SIGNUP_API });

	let { error: countryListFetchError, data: countryList } = useGetFetch({
		url: COUNTRY_LIST_API,
	});
	// let { error: OrganisationError, data: organisationTypes } = useGetFetch<IOrganisationType[]>({
	// 	url: ORGANISATION_TYPES_API,
	// });
	const userDispatch = React.useContext(UserDispatchContext);

	useRouteResolver();

	React.useEffect(() => {
		if (singupSuccessfulResponse)
			if (userDispatch) {
				userDispatch(setUser(singupSuccessfulResponse));
			}
	}, [singupSuccessfulResponse, userDispatch]);

	const OnSubmit = (
		values: IBasicInformation,
		formikHelpers: FormikHelpers<IBasicInformation>
	) => {
		setPayload(values);
		// navigate(`/signup/${SignUpSteps.SET_ORG}`);
	};
	const clearErrors = () => {
		if (error) error = "";
	};
	const validateInitialValue = (initialValue: any) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};

	return (
		<div onChange={clearErrors}>
			<Formik
				initialValues={initialValues}
				onSubmit={OnSubmit}
				validate={validate}
				isInitialValid={() => validateInitialValue(initialValues)}
			>
				{(formik) => {
					return (
						<Form className={classes.form}>
							<Grid container spacing={4} justify={"center"}>
								{/* <Grid item xs={12} md={6}>
								<TextField
									style={{ width: "100%" }}
									error={!!formik.errors.username}
									helperText={formik.touched.username && formik.errors.username}
									onChange={formik.handleChange}
									label="Username"
									required
									fullWidth
									name="username"
									variant="outlined"
									type={"text"}
								/>
							</Grid> */}
								<Grid item xs={12} md={12}>
									<TextField
										style={{ margin: "0px" }}
										error={!!formik.errors.email && !!formik.touched.email}
										helperText={formik.touched.email && formik.errors.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										label="Email"
										required
										fullWidth
										name="email"
										variant="outlined"
										type={"email"}
										id="email"
									/>
								</Grid>

								{/* <Grid item xs={12} md={6}>
								<TextField
									error={!!formik.errors.firstName}
									helperText={formik.touched.firstName && formik.errors.firstName}
									onChange={formik.handleChange}
									label="First Name"
									required
									fullWidth
									name="firstName"
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									error={!!formik.errors.lastName}
									helperText={formik.touched.lastName && formik.errors.lastName}
									onChange={formik.handleChange}
									label="Last Name"
									required
									fullWidth
									name="lastName"
									variant="outlined"
								/>
							</Grid> */}

								<Grid item xs={12} md={12}>
									<FormControl variant="outlined" fullWidth>
										<InputLabel required htmlFor="outlined-adornment-password">
											Password
										</InputLabel>
										<OutlinedInput
											id="outlined-adornment-password"
											type={showPassword ? "text" : "password"}
											data-testid="signup-password"
											onChange={formik.handleChange}
											error={
												!!formik.errors.password &&
												!!formik.touched.password
											}
											onBlur={formik.handleBlur}
											required
											label="Password"
											name="password"
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={() => {
															setShowPassword(!showPassword);
														}}
														onMouseDown={(e) => {
															e.preventDefault();
														}}
														edge="end"
													>
														{showPassword ? (
															<Visibility />
														) : (
															<VisibilityOff />
														)}
													</IconButton>
												</InputAdornment>
											}
											labelWidth={70}
										/>
										<FormHelperText error>
											{formik.touched.password && formik.errors.password}
										</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<TextField
										error={
											!!formik.errors.organization?.name &&
											!!formik.touched.organization?.name
										}
										helperText={
											formik.touched.organization?.name &&
											formik.errors.organization?.name
										}
										onChange={formik.handleChange}
										label="Organization Name"
										onBlur={formik.handleBlur}
										required
										fullWidth
										name="organization.name"
										variant="outlined"
										style={{ margin: "0px" }}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl variant="outlined" fullWidth>
										<InputLabel id="demo-simple-select-outlined-label" required>
											Select Country
										</InputLabel>

										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											error={
												!!formik.errors.organization?.country &&
												!!formik.touched.organization?.country
											}
											value={formik.values.organization?.country}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											label={"Select Country"}
											name="organization.country"
											data-testid="signupCountry"
											inputProps={{
												"data-testid": "signupCountryInput",
											}}
											required
										>
											{countryList?.map(
												(
													elem: { name: string; id: string },
													index: number
												) => (
													<MenuItem key={index} value={elem.id}>
														{elem.name}
													</MenuItem>
												)
											)}

											{!countryList?.length ? (
												<MenuItem>
													<em>No country available</em>
												</MenuItem>
											) : null}
										</Select>
										<FormHelperText error>
											{formik.touched.organization?.country &&
												formik.errors.organization?.country}
										</FormHelperText>
									</FormControl>
								</Grid>

								{/* <Grid item xs={12} md={6}>
								<InputLabel id="demo-simple-select-label" className={classes.form}>
									Type
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									onChange={formik.handleChange}
									required
									fullWidth
									name="organisation.type"
									variant="outlined"
									value={formik.values.organisation.type}
								>
									{organisationTypes ? (
										organisationTypes.map((type) => (
											<MenuItem key={type.id} value={type.id}>
												{type.reg_type}
											</MenuItem>
										))
									) : (
										<MenuItem value={""} disabled>
											No Data Available
										</MenuItem>
									)}

									{OrganisationError ? (
										<MenuItem value={""} disabled>
											No Data Available
										</MenuItem>
									) : null}
								</Select>
							</Grid>

							<Grid item xs={12} md={6}>
								<TextField
									error={!!formik.errors.organisation?.short_name}
									helperText={
										formik.touched.organisation?.short_name &&
										formik.errors.organisation?.short_name
									}
									onChange={formik.handleChange}
									label="Short Name"
									required
									fullWidth
									name="organisation.short_name"
									variant="outlined"
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<TextField
									error={!!formik.errors.organisation?.legal_name}
									helperText={
										formik.touched.organisation?.legal_name &&
										formik.errors.organisation?.legal_name
									}
									onChange={formik.handleChange}
									label="Legal Name"
									required
									fullWidth
									name="organisation.legal_name"
									variant="outlined"
								/>
							</Grid>

							<Grid item xs={12} md={12}>
								<TextField
									error={!!formik.errors.organisation?.description}
									helperText={
										formik.touched.organisation?.description &&
										formik.errors.organisation?.description
									}
									onChange={formik.handleChange}
									label="Description"
									fullWidth
									name="organisation.description"
									variant="outlined"
								/>
							</Grid> */}

								<Grid item xs={12}>
									<Button
										fullWidth
										disabled={!formik.isValid}
										type="submit"
										variant="contained"
										color="primary"
									>
										Submit
									</Button>

									{loading ? <GlobalLoader /> : null}
									{singupSuccessfulResponse ? (
										<p className="text-center"> Singgup Successfull </p>
									) : null}

									{error ? <AlertMsg severity="error" msg={error} /> : null}
									{countryListFetchError ? (
										<AlertMsg severity="error" msg={countryListFetchError} />
									) : null}
								</Grid>
							</Grid>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export const Persistent = React.forwardRef((props, ref) => <BasicDetailsForm />);
