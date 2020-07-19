import React from "react";
import { Box, Button, createStyles, TextField, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import { ILoginForm } from "../models";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			flexDirection: "column",
			height: "100%",
			justifyContent: "center",
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
	const classes = useStyles();
	const initialValues: ILoginForm = {
		userName: "",
		password: "",
	};

	function validate(values: ILoginForm) {
		let errors: ILoginForm = {};
		if (!values.userName) {
			errors.userName = "User name is required";
		}
		if (!values.password) {
			errors.password = "Password is required";
		}
		return errors;
	}

	function onSubmit(values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) {
		console.log(values);
	}

	return (
		<Box m="auto" height={"100%"} width={{ xs: "100%", md: "75%", lg: "50%" }}>
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
								error={!!formik.errors.userName}
								helperText={formik.touched.userName && formik.errors.userName}
								onChange={formik.handleChange}
								label="Username"
								required
								name="userName"
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
						</Form>
					);
				}}
			</Formik>
		</Box>
	);
}

export default Login;
