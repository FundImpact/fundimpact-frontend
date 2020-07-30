import { Box } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";

import useSignUpStep from "../../hooks/signup/useSignupStep";
import { Persistent } from "../../components/Forms/BasicDetailsForm/BasicDetailsForm";
import OrganisationForm from "../../components/Forms/OrganisationForm/OrganisationForm";

// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		root: {
// 			display: "flex",
// 			flexDirection: "column",
// 			height: "100%",
// 			justifyContent: "center",
// 			"& .MuiTextField-root,": {
// 				margin: theme.spacing(1),
// 			},
// 			"& .MuiButtonBase-root": {
// 				marginTop: theme.spacing(4),
// 				marginLeft: theme.spacing(1),
// 				marginRight: theme.spacing(1),
// 			},
// 		},
// 		stepContainer: {
// 			background: grey["200"],
// 		},
// 		step: {
// 			"& .MuiStepLabel-iconContainer ": {
// 				"& .MuiStepIcon-root.MuiStepIcon-active": {
// 					color: theme.palette.secondary.main,
// 				},
// 			},
// 		},
// 		form: {
// 			display: "flex",
// 			"& .MuiTextField-root": {
// 				margin: theme.spacing(1),
// 				spacing: 1,
// 			},
// 		},
// 	})
// );

function SignUpForms({ step }: { step: number }) {
	if (step === 0) return <Persistent />;
	if (step === 1) return <OrganisationForm />;
	if (step === 2) return <OrganisationForm />;
	if (step === 3) return <OrganisationForm />;

	return null;
}

function SignUp() {
	// const classes = useStyles();
	// const steps = getSteps();
	const { id } = useParams();
	const { currentStep } = useSignUpStep(id);
	return (
		<Box mx="auto" width={{ xs: "100%", md: "75%", lg: "75%" }}>
			{/* <Stepper className={classes.stepContainer} activeStep={currentStep} alternativeLabel>
				{steps.map(({ label, id }) => {
					return (
						<Step key={id}>
							<StepLabel className={classes.step}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper> */}
			<Box mt={5}>
				<SignUpForms step={currentStep} />
			</Box>
		</Box>
	);
}

export default SignUp;
