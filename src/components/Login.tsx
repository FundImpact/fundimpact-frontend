import { Box, Button, createStyles, TextField, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { Link } from "react-router-dom";

import { usePostFetch } from "../hooks/usePostFetch";
import { ILoginForm } from "../models";
import GlobalLoader from "./commons/GlobalLoader";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			flexDirection: "column",
			"& .MuiTextField-root,": {
				margin: theme.spacing(1),
			},
			"& .MuiButtonBase-root": {
				marginTop: theme.spacing(4),
				marginLeft: theme.spacing(1),
				marginRight: theme.spacing(1),
			},
		},
	})
);

function Login() {
	const loginURL = "https://api.fundimpact.org/auth/local";
	const classes = useStyles();
	const initialValues: ILoginForm = {
		identifier: "",
		password: "",
	};
	const { data, loading, error: apiError, setPayload } = usePostFetch<any>({
		url: loginURL,
		body: null,
	});

	function validate(values: ILoginForm) {
		let errors: ILoginForm = {};
		if (!values.identifier) {
			errors.identifier = "User name is required";
		}
		if (!values.password) {
			errors.password = "Password is required";
		}
		return errors;
	}

	function onSubmit(values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) {
		console.log(values, formikHelpers);
		setPayload(values);
	}

	return (
		<Box mx="auto" height={"100%"} width={{ xs: "100%", md: "75%", lg: "50%" }}>
			<Formik
				validateOnBlur
				initialValues={initialValues}
				enableReinitialize
				validate={validate}
				onSubmit={onSubmit}
			>
				{(formik) => {
					return (
						<Form className={classes.root} autoComplete="off">
							<TextField
								error={!!formik.errors.identifier}
								helperText={formik.touched.identifier && formik.errors.identifier}
								onChange={formik.handleChange}
								label="identifier"
								required
								name="identifier"
								variant="outlined"
							/>

							<TextField
								error={!!formik.errors.password}
								onChange={formik.handleChange}
								label="Password"
								required
								name="password"
								type="password"
								variant="outlined"
							/>
							<Button
								disabled={formik.isSubmitting || !formik.isValid}
								type="submit"
								variant="contained"
								color="primary"
							>
								Submit
							</Button>
							<Box mt={4} textAlign="center">
								<Link
									className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
									to={"/forgotPassword"}
								>
									Forgot Password
								</Link>
							</Box>

							{loading ? <GlobalLoader /> : null}
							{apiError ? <p className="error-message"> {apiError} </p> : null}
							{data ? <p> Login Successs </p> : null}
						</Form>
					);
				}}
			</Formik>
		</Box>
	);
}

export default Login;
