import React from "react";
import { Container, Grid, Box, Typography, Button } from "@material-ui/core";

import "./index.css";
import { matchPath, matchRoutes, Outlet, useLocation, useNavigate } from "react-router-dom";

function LandingPage() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const loginPathMatch = matchPath("login", pathname);

	return (
		<Grid container>
			<Grid item xs={12} md={4}>
				<Box
					display={{ xs: "flex" }}
					px={3}
					justifyContent={"space-evenly"}
					flexDirection={{ md: "column" }}
					alignItems={"space between"}
					height={"100vh"}
					bgcolor="secondary.main"
				>
					<Box color={"white"}>
						<Typography component="h4" variant="h4">
							<Box m={1}>Login</Box>
						</Typography>
						<Typography component="div">
							<Box fontSize="" m={1}>
								Get started in few minutes and start analyzing your funds or some
								more lines to make user confident.
							</Box>
						</Typography>
					</Box>
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
			<Grid item xs={12} md={8}>
				<Outlet />
			</Grid>
		</Grid>
	);
}

export default LandingPage;
