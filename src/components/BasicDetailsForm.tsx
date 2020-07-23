import { Button, createStyles, Grid, TextField, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";

import { useSignupNewUser } from "../hooks/signupUser";
import { IBasicInformation } from "../models";
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

export default function BasicDetailsForm() {
	const initialValues: IBasicInformation = {
		confirmPassword: "",
		email: "",
		firstName: "",
		lastName: "",
		password: "",
	};
	const classes = useStyles();
	// console.log("BasicDetailsForm rendering");

	const { error, loading, setPayload } = useSignupNewUser(null, []);

	const OnSubmit = (
		values: IBasicInformation,
		formikHelpers: FormikHelpers<IBasicInformation>
	) => {
		console.log(values, formikHelpers);
		console.log(`settting payload`);
		setPayload(values);

		// navigate(`/signup/${SignUpSteps.SET_ORG}`);
	};

	return (
		<Formik initialValues={initialValues} onSubmit={OnSubmit}>
			{(formik) => {
				return (
					<Form className={classes.form}>
						{/* {error ? `have error` + error : "No Error"}
						{loading ? `have loading` + loading : "No loading"}
						{data ? `have data` + data : "No data"} */}
						<Grid container spacing={4} justify={"center"}>
							<Grid item xs={12} md={6}>
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
							</Grid>
							<Grid item xs={12}>
								<TextField
									style={{ width: "100%" }}
									error={!!formik.errors.email}
									helperText={formik.touched.email && formik.errors.email}
									onChange={formik.handleChange}
									label="email"
									required
									fullWidth
									name="email"
									variant="outlined"
									type={"email"}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									style={{ width: "100%" }}
									error={!!formik.errors.password}
									helperText={formik.touched.password && formik.errors.password}
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
							<Grid item xs={12}>
								<Button
									fullWidth
									disabled={formik.isSubmitting || !formik.isValid}
									type="submit"
									variant="contained"
									color="primary"
								>
									Submit
								</Button>

								{loading ? <GlobalLoader /> : null}

								{error ? <p className="error-message"> {error} </p> : null}
							</Grid>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
}
