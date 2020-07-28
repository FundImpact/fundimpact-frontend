import { Box, Button, createStyles, TextField, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import AlertMsg from "../AlertMessage/AlertMessage";

import { UserDispatchContext } from "../../contexts/userContext";
import { usePostFetch } from "../../hooks/usePostFetch";
import { ILoginForm } from "../../models";
import { setUser } from "../../reducers/userReducer";
import { LOGIN_API } from "../../utils/endpoints.util";
import GlobalLoader from "../commons/GlobalLoader";

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
	const classes = useStyles();
	const initialValues: ILoginForm = {
		email: "vinitkumar12@gmail.com",
		password: "vinit@123",
	};

	const userDispatch = React.useContext(UserDispatchContext);

	let { data, loading, error: apiError, setPayload } = usePostFetch<any>({
		url: LOGIN_API,
		body: null,
	});

	React.useEffect(() => {
		if (data)
			if (userDispatch) {
				userDispatch(setUser(data));
			}
	}, [userDispatch, data]);

	function validate(values: ILoginForm) {
		let errors: Partial<ILoginForm> = {};
		if (!values.email) {
			errors.email = "User name is required";
		}
		if (!values.password) {
			errors.password = "Password is required";
		}
		return errors;
	}

	function onSubmit(values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) {
		setPayload(values);
	}
	const clearErrors = () => {
		if (apiError) apiError = "";
	};
	return (
		<Box
			mx="auto"
			height={"100%"}
			width={{ xs: "100%", md: "75%", lg: "50%" }}
			onChange={clearErrors}
		>
			<Formik
				validateOnBlur
				initialValues={initialValues}
				enableReinitialize={true}
				validate={validate}
				onSubmit={onSubmit}
			>
				{(formik) => {
					return (
						<Form className={classes.root} autoComplete="off">
							<TextField
								value={formik.values.email}
								error={!!formik.errors.email}
								helperText={formik.touched.email && formik.errors.email}
								onChange={formik.handleChange}
								label="Email"
								required
								name="email"
								variant="outlined"
							/>

							<TextField
								value={formik.values.password}
								error={!!formik.errors.password}
								onChange={formik.handleChange}
								label="Password"
								required
								name="password"
								type="password"
								variant="outlined"
							/>
							<Button
								disabled={!formik.isValid}
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
							{apiError ? <AlertMsg severity="error" msg={apiError} /> : null}
							{data ? <p> Login Successs </p> : null}
						</Form>
					);
				}}
			</Formik>
		</Box>
	);
}

export default Login;
