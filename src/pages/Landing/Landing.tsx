import "./index.css";

import { Box, Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";

import useRouteResolver from "../../hooks/routes/useRouteResolver";
import useSignUpStep from "../../hooks/signup/useSignupStep";
import { ISignUpStep } from "../../models";
import { getSteps } from "../../utils/signup.util";
import { checkIfUserIsOnStagingDeployment } from "../../utils";

function ActionDescription({ stepNumber }: { stepNumber: number | undefined }) {
	const steps = getSteps();
	const selectedStep: ISignUpStep | undefined = steps.find((s) => s.step === stepNumber);
	if (!selectedStep) {
		return (
			<Box color={"white"}>
				<Typography component="h4" variant="h4">
					<Box m={1}>
						{" "}
						<FormattedMessage
							id="loginLabel"
							defaultMessage="Login"
							description="This text will be shown on login page over blue cover"
						/>
					</Box>
				</Typography>
				<Typography component="div">
					<Box fontSize="" m={1}>
						<FormattedMessage
							id="loginDescription"
							defaultMessage="Get started in few minutes and start analyzing your funds or some more lines to make user confident."
							description="This text will be shown on login page over blue cover"
						/>
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
	const userIsOnStagingDeployment = checkIfUserIsOnStagingDeployment();
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
					<ActionDescription
						stepNumber={
							signUpPathMatch && userIsOnStagingDeployment ? currentStep : undefined
						}
					/>
					<Box>
						<Typography component="h6">
							<Box>
								{loginPathMatch ? (
									userIsOnStagingDeployment && (
										<FormattedMessage
											id="dontHaveAccount"
											defaultMessage="Don't have account?"
											description="This text will be show on login page on left side over blue cover"
										/>
									)
								) : (
									<FormattedMessage
										id="alreadyHaveAccount"
										defaultMessage="Already have account?"
										description="This text will be show on signup page on left side over blue cover"
									/>
								)}
							</Box>
						</Typography>
						{loginPathMatch ? (
							userIsOnStagingDeployment && (
								<Button
									onClick={() => navigate("/signup")}
									variant={"contained"}
									color="secondary"
								>
									<FormattedMessage
										id="singupBtnText"
										defaultMessage="Signup"
										description="This text is to be shown on Signup button"
									/>
								</Button>
							)
						) : (
							<Button
								onClick={() => navigate("/login")}
								variant={"contained"}
								color="secondary"
							>
								<FormattedMessage
									id="loginBtnText"
									defaultMessage="Login"
									description="This text is to be shown on Login Button"
								/>
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
						<img src={require("../../assets/images/logo.svg")} alt="" />
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
