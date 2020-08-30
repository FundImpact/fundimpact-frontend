import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
		},
		backButton: {
			marginRight: theme.spacing(1),
		},
		instructions: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
		},
	})
);

export default function HorizontalLabelPositionBelowStepper(props: any) {
	function getSteps() {
		return ["Achievement Details", "Select Donor Year Tags"];
	}

	function getStepContent(stepIndex: number) {
		switch (stepIndex) {
			case 0:
				return props.basicForm;
			case 1:
				return props.donorForm;
			default:
				return "Unknown stepIndex";
		}
	}
	const classes = useStyles();
	const steps = getSteps();

	const activeStep = props.stepperHelpers.activeStep;
	// const setActiveStep = props.stepperHelpers.setActiveStep;
	// const handleNext = props.stepperHelpers.handleNext;
	// const handleBack = props.stepperHelpers.handleBack;
	const handleReset = props.stepperHelpers.handleReset;
	return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<div>
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed
						</Typography>
						<Button onClick={handleReset}>Reset</Button>
					</div>
				) : (
					<> {getStepContent(activeStep)}</>
				)}
			</div>
		</div>
	);
}
