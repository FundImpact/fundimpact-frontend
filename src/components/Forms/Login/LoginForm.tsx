import { Button, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import React from "react";
import { useIntl } from "react-intl";

import { ILoginForm } from "../../../models";
import { placeholders } from "../../Placeholders/placeholder";

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
	const validateInitialValue = (initialValue: ILoginForm) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};

	const intl = useIntl();

	const emailPlaceholder = intl.formatMessage(placeholders.email);
	const passwordPlaceholder = intl.formatMessage(placeholders.password);
	return (
		<Formik
			validateOnBlur
			validateOnChange
			isInitialValid={(props: any) => validateInitialValue(props.initialValues)}
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
							error={!!formik.errors.email && !!formik.touched.email}
							helperText={formik.touched.email && formik.errors.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							label={emailPlaceholder}
							required
							name="email"
							type="email"
							data-testid="email"
							variant="outlined"
						/>
						<TextField
							value={formik.values.password}
							error={!!formik.errors.password && !!formik.touched.password}
							helperText={formik.touched.password && formik.errors.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							label={passwordPlaceholder}
							required
							name="password"
							type="password"
							variant="outlined"
							data-testid="password"
						/>
						<Button
							disabled={!formik.isValid}
							type="submit"
							data-testid="submit"
							variant="contained"
							color="primary"
						>
							Submit
						</Button>
					</Form>
				);
			}}
		</Formik>
	);
}

export default LoginForm;
