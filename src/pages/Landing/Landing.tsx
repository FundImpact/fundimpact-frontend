import React from "react";
import { Grid, Box, Typography, Button } from "@material-ui/core";

import "./index.css";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import useSignUpStep from "../../hooks/useSignupStep";
import { ISignUpStep } from "../../models";
import { getSteps } from "../../utils/signup.util";

function ActionDescription({ stepNumber }: { stepNumber: number | undefined }) {
	const steps = getSteps();
	const selectedStep: ISignUpStep | undefined = steps.find((s) => s.step === stepNumber);
	if (!selectedStep) {
		return (
			<Box color={"white"}>
				<Typography component="h4" variant="h4">
					<Box m={1}>Login</Box>
				</Typography>
				<Typography component="div">
					<Box fontSize="" m={1}>
						Get started in few minutes and start analyzing your funds or some more lines
						to make user confident.
					</Box>
				</Typography>
			</Box>
		);
	} else {
		return (
			<Box color={"white"}>
				<Typography component="h4" variant="h4">
					<Box m={1}>{selectedStep.label}</Box>
				</Typography>
				<Typography component="div">
					<Box fontSize="" m={1}>
						{selectedStep.description}
					</Box>
				</Typography>
			</Box>
		);
	}
}

function LandingPage() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const loginPathMatch = matchPath("login", pathname);
	const location = useLocation();
	const signUpPathMatch = matchPath("signup/:id", location.pathname);
	const { currentStep } = useSignUpStep(signUpPathMatch ? signUpPathMatch.params.id : undefined);
	return (
		<Grid container>
			<Grid item xs={12} component={Box} md={4}>
				<Box
					display={{ xs: "flex" }}
					p={3}
					justifyContent={"space-evenly"}
					flexDirection={{ xs: "column" }}
					alignItems={"space between"}
					height={{ md: "100vh" }}
					bgcolor="secondary.main"
				>
					<ActionDescription stepNumber={signUpPathMatch ? currentStep : undefined} />
					<Box>
						<Typography component="h6">
							<Box>
								{loginPathMatch
									? "Don't have an account?"
									: "Already have an account?"}
							</Box>
						</Typography>
						{loginPathMatch ? (
							<Button
								onClick={() => navigate("/signup")}
								variant={"contained"}
								color="primary"
							>
								Sign Up
							</Button>
						) : (
							<Button
								onClick={() => navigate("/login")}
								variant={"contained"}
								color="primary"
							>
								Login
							</Button>
						)}
					</Box>
				</Box>
			</Grid>
			<Grid item xs={12} md={8} style={{ display: "flex" }}>
				<Grid container>
					<Grid
						item
						xs={12}
						style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
					>
						<img src={require("../../assets/images/logo-landing.png")} alt="" />
					</Grid>
					<Grid item xs={12} style={{ display: "flex" }}>
						<Outlet />
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default LandingPage;
