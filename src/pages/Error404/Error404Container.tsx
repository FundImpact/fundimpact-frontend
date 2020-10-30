import { Box, Container, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { sidePanelStyles } from "../../components/Dasboard/styles";
import LeftPanel from "../../components/LeftPanel/LeftPanel";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useAuth } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export default function Error404Container() {
	const classes = sidePanelStyles();
	const { jwt } = useAuth();
	return (
		<Container
			disableGutters
			container
			className={classes.root}
			maxWidth={"xl"}
			component={Grid}
		>
			<Grid container>
				{jwt && (
					<Grid item xs={1} container>
						<Box position="sticky" top={0} left={0} style={{ width: "100%" }}>
							<Grid container>
								<Grid item xs={6}>
									<LeftPanel />
								</Grid>
								<Grid item xs={6} component={Paper} elevation={0}></Grid>
							</Grid>
						</Box>
					</Grid>
				)}
				<Grid item xs={jwt ? 11 : 12}>
					<Grid item container component={Paper} style={{ height: "100vh" }}>
						<Grid item xs={6} container justify="center">
							<Box m={5} p={5}>
								<Typography variant="h2" gutterBottom>
									<FormattedMessage
										id={`OopsErrorPage`}
										defaultMessage={"Oops.."}
										description={`This text will be shown on Error page for Oops..`}
									/>
								</Typography>
								<Typography variant="h4" gutterBottom>
									<FormattedMessage
										id={`weCantSeemToFindErrorPage`}
										defaultMessage={"We can't seem to find the"}
										description={`This text will be shown on Error page for 'We can't seem to find the'`}
									/>
								</Typography>
								<Typography variant="h4" gutterBottom>
									<FormattedMessage
										id={`pageYouLookingForErrorPage`}
										defaultMessage={"page you are looking for."}
										description={`This text will be shown on Error page for 'page you are looking for.'`}
									/>
								</Typography>
								<Typography variant="subtitle2" gutterBottom>
									<Box mt={2}>
										<FormattedMessage
											id={`helpfulLinksForErrorPage`}
											defaultMessage={"Here are some helpful links instead:"}
											description={`This text will be shown on Error page for 'Here are some helpful links instead:'`}
										/>
									</Box>
								</Typography>
								{!jwt ? (
									<Link to="/login">
										<Typography variant="subtitle1" gutterBottom>
											<FormattedMessage
												id={`loginLinkForErrorPage`}
												defaultMessage={"Login"}
												description={`This text will be shown on Error page for 'login link'`}
											/>
										</Typography>
									</Link>
								) : (
									<>
										<Link to="/organization/dashboard">
											<Typography variant="subtitle1" gutterBottom>
												<FormattedMessage
													id={`organizationDashboardLinkForErrorPage`}
													defaultMessage={"Organization Dashboard"}
													description={`This text will be shown on Error page for 'Organization Dashboard link'`}
												/>
											</Typography>
										</Link>
										<Link to="/dashboard">
											<Typography variant="subtitle1" gutterBottom>
												<FormattedMessage
													id={`dashboardLinkForErrorPage`}
													defaultMessage={"Dashboard"}
													description={`This text will be shown on Error page for 'Dashboard link'`}
												/>
											</Typography>
										</Link>
										<Link to="/settings">
											<Typography variant="subtitle1" gutterBottom>
												<FormattedMessage
													id={`settingsLinkForErrorPage`}
													defaultMessage={"Settings"}
													description={`This text will be shown on Error page for 'Settings link'`}
												/>
											</Typography>
										</Link>
									</>
								)}
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Box m={5} p={5}>
								<ErrorOutlineIcon style={{ fontSize: "150px", color: "#FFD2D2" }} />
								<Typography variant="h4" gutterBottom>
									<FormattedMessage
										id={`404CodeForErrorPage`}
										defaultMessage={"Error code : 404"}
										description={`This text will be shown on Error page for 'Error code : 404'`}
									/>
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
}
