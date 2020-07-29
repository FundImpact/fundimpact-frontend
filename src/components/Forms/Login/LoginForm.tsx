import classes from "*.module.css";
import { Button, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import React from "react";

import { ILoginForm } from "../../../models";

export interface Props {
	onSubmit: (values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) => any;
	initialValues: ILoginForm;
	clearErrors: (event: React.FormEvent<HTMLElement>) => void;
	validate: (values: ILoginForm) => void | object | Promise<FormikErrors<ILoginForm>>;
}

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

function LoginForm({ onSubmit, initialValues, clearErrors, validate }: Props) {
	const classes = useStyles();
	return (
		<Formik
			validateOnBlur
			validateOnChange
			initialValues={initialValues}
			enableReinitialize={true}
			validate={validate}
			onSubmit={onSubmit}
		>
			{(formik) => {
				return (
					<Form
						className={classes.root}
						autoComplete="off"
						data-testid="form"
						onChange={clearErrors}
					>
						<TextField
							value={formik.values.email}
							error={!!formik.errors.email}
							helperText={formik.touched.email && formik.errors.email}
							onChange={formik.handleChange}
							label="Email"
							required
							name="email"
							type="email"
							data-testid="email"
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
						{"isValiud: " + formik.isValid}
						{/* <button type="submit" disabled={formik.isValid}>
							MySubmit
						</button> */}
						{/* <Box mt={4} textAlign="center">
								<Link
									className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
									to={"/forgotPassword"}
								>
									Forgot Password
								</Link>
							</Box> */}
					</Form>
				);
			}}
		</Formik>
	);
}

export default LoginForm;
