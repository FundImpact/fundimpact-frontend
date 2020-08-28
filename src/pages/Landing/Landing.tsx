import "./index.css";

import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { Link, matchPath, useLocation } from "react-router-dom";

import useRouteResolver from "../../hooks/routes/useRouteResolver";
import useSignUpStep from "../../hooks/signup/useSignupStep";
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
	// const navigate = useNavigate();
	const { pathname } = useLocation();
	const loginPathMatch = matchPath("login", pathname);
	const location = useLocation();
	const signUpPathMatch = matchPath("signup/:id", location.pathname);
	const { currentStep } = useSignUpStep(signUpPathMatch ? signUpPathMatch.params.id : undefined);
	useRouteResolver();
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
					bgcolor="primary.main"
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
							<Link to="/signup">Login</Link>
						) : (
							// <Button
							// 	onClick={() => navigate("/signup")}
							// 	variant={"contained"}
							// 	color="secondary"
							// >
							// 	Sign Up
							// </Button>
							<Link to="/login">Login</Link>

							// <Button
							// 	onClick={() => navigate("/login")}
							// 	variant={"contained"}
							// 	color="secondary"
							// >
							// 	Login
							// </Button>
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
						<img src={require("../../assets/images/logo.svg")} alt="" />
					</Grid>
					<Grid item xs={12} style={{ display: "flex" }}>
						{/* <Outlet /> */}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default LandingPage;
