import React from "react";
import { Box, createStyles, Step, StepLabel, Stepper, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { getSteps } from "../utils/signup.util";
import { grey } from "@material-ui/core/colors";
import useSignUpStep from "../hooks/useSignupStep";

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
	})
);

function SignUp() {
	const classes = useStyles();
	const steps = getSteps();
	const { id } = useParams();
	const { currentStep, setStep } = useSignUpStep(id);
	return (
		<Box m="auto" width={{ xs: "100%", md: "75%", lg: "50%" }}>
			<Stepper className={classes.stepContainer} activeStep={currentStep} alternativeLabel>
				{steps.map(({ label, id }) => {
					return (
						<Step key={id}>
							<StepLabel className={classes.step}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
		</Box>
	);
}

export default SignUp;
