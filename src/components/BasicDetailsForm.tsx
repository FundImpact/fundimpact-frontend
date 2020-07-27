import { Button, createStyles, Grid, TextField, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import AlertMsg from "./AlertMessage";

import { UserDispatchContext } from "../contexts/userContext";
import { useGetFetch } from "../hooks/useFetch";
import { usePostFetch } from "../hooks/usePostFetch";
import useRouteResolver from "../hooks/useRouteResolver";
import { IBasicInformation } from "../models";
import { IOrganisationType } from "../models/organisation/types";
import { IUserSignupResponse } from "../models/signup/userSignUpResponse";
import { setUser } from "../reducers/userReducer";
import { ORGANISATION_TYPES_API, SIGNUP_API } from "../utils/endpoints.util";
import { getDefaultBasicInformation } from "../utils/signup.util";
import GlobalLoader from "./commons/GlobalLoader";

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

const BasicDetailsForm = () => {
	const initialValues: IBasicInformation = getDefaultBasicInformation();
	const classes = useStyles();

	let { error, loading, data: singupSuccessfulResponse, setPayload } = usePostFetch<
		IUserSignupResponse
	>({ body: null, url: SIGNUP_API });
	let { error: OrganisationError, data: organisationTypes } = useGetFetch<IOrganisationType[]>({
		url: ORGANISATION_TYPES_API,
	});
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
	return (
		<div onChange={clearErrors}>
			<Formik initialValues={initialValues} onSubmit={OnSubmit}>
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
										style={{ width: "100%" }}
										error={!!formik.errors.email}
										helperText={formik.touched.email && formik.errors.email}
										onChange={formik.handleChange}
										label="Email"
										required
										fullWidth
										name="email"
										variant="outlined"
										type={"email"}
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
								<Grid item xs={6}>
									<TextField
										style={{ width: "100%" }}
										error={!!formik.errors.password}
										helperText={
											formik.touched.password && formik.errors.password
										}
										onChange={formik.handleChange}
										label="Password"
										required
										fullWidth
										name="password"
										variant="outlined"
										type="password"
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										style={{ width: "100%" }}
										error={!!formik.errors.confirmPassword}
										helperText={
											formik.touched.confirmPassword &&
											formik.errors.confirmPassword
										}
										onChange={formik.handleChange}
										label="Confirm Password"
										required
										fullWidth
										name="confirmPassword"
										variant="outlined"
										type="password"
									/>
								</Grid>

								<Grid item xs={12} md={12}>
									<TextField
										error={!!formik.errors.organisation?.name}
										helperText={
											formik.touched.organisation?.name &&
											formik.errors.organisation?.name
										}
										onChange={formik.handleChange}
										label="Organisation Name"
										required
										fullWidth
										name="organisation.name"
										variant="outlined"
									/>
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
