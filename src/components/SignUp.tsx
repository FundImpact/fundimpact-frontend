import React from "react";
import {
	Box,
	Button,
	createStyles,
	Grid,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Theme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate, useParams } from "react-router-dom";
import { getSteps, SignUpSteps } from "../utils/signup.util";
import { grey } from "@material-ui/core/colors";
import useSignUpStep from "../hooks/useSignupStep";
import { Form, Formik, FormikHelpers } from "formik";
import { IBasicInformation } from "../models";

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
		stepContainer: {
			background: grey["200"],
		},
		step: {
			"& .MuiStepLabel-iconContainer ": {
				"& .MuiStepIcon-root.MuiStepIcon-active": {
					color: theme.palette.secondary.main,
				},
			},
		},
		basicForm: {
			display: "flex",
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				spacing: 1,
			},
		},
	})
);

function BasicSignUp() {
	const initialValues: IBasicInformation = {
		confirmPassword: "",
		email: "",
		firstName: "",
		lastName: "",
		password: "",
	};
	const classes = useStyles();
	const navigate = useNavigate();

	function onSubmit(values: IBasicInformation, formikHelpers: FormikHelpers<IBasicInformation>) {
		navigate(`/signup/${SignUpSteps.SET_ORG}`);
	}

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit}>
			{(formik) => {
				return (
					<Form className={classes.basicForm}>
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
							</Grid>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
}

function SignUpForms({ step }: { step: number }) {
	if (step === 0) return <BasicSignUp />;

	return null;
}

function SignUp() {
	const classes = useStyles();
	const steps = getSteps();
	const { id } = useParams();
	const { currentStep } = useSignUpStep(id);
	return (
		<Box m="auto" width={{ xs: "100%", md: "75%", lg: "75%" }}>
			<Stepper className={classes.stepContainer} activeStep={currentStep} alternativeLabel>
				{steps.map(({ label, id }) => {
					return (
						<Step key={id}>
							<StepLabel className={classes.step}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<Box mt={5}>
				<SignUpForms step={currentStep} />
			</Box>
		</Box>
	);
}

export default SignUp;
