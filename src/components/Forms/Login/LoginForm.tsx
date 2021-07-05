import {
	Button,
	createStyles,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	makeStyles,
	OutlinedInput,
	TextField,
	Theme,
	useTheme,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ILoginForm } from "../../../models";
import { placeholders } from "../../Placeholders/placeholder";

export interface Props {
	onSubmit: (values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) => any;
	initialValues: ILoginForm;
	clearErrors: (event: React.FormEvent<HTMLElement>) => void;
	validate: (values: ILoginForm) => void | object | Promise<FormikErrors<ILoginForm>>;
	clickedForgetPass: boolean;
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
		passowrdTextField: {
			margin: theme.spacing(1),
		},
	})
);

function LoginForm({ onSubmit, initialValues, clearErrors, validate, clickedForgetPass }: Props) {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const theme = useTheme();
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
						{!clickedForgetPass && (
							<FormControl variant="outlined" className={classes.passowrdTextField}>
								<InputLabel required htmlFor="outlined-adornment-password">
									<FormattedMessage
										id="passowrdLabel"
										defaultMessage="Password"
										description="This text will be label of password input field"
									/>
								</InputLabel>
								<OutlinedInput
									value={formik.values.password}
									error={!!formik.errors.password && !!formik.touched.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									label={passwordPlaceholder}
									required
									name="password"
									type={showPassword ? "text" : "password"}
									data-testid="password"
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
												style={{ marginTop: theme.spacing(0) }}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									}
									labelWidth={70}
								/>
								<FormHelperText error>
									{formik.touched.password && formik.errors.password}
								</FormHelperText>
							</FormControl>
						)}
						<Button
							disabled={!formik.isValid}
							type="submit"
							data-testid="submit"
							variant="contained"
							color="primary"
						>
							{!clickedForgetPass ? (
								<FormattedMessage
									defaultMessage="Login"
									id="login_button"
									description="login button"
								/>
							) : (
								<FormattedMessage
									defaultMessage="Submit"
									id="forgot_password_submit"
									description="Submit Button"
								/>
							)}
						</Button>
					</Form>
				);
			}}
		</Formik>
	);
}

export default LoginForm;
