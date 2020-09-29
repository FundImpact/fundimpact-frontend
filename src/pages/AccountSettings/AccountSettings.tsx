import { Box, Container, Grid } from "@material-ui/core";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { sidePanelStyles } from "../../components/Dasboard/styles";
import LeftPanel from "../../components/LeftPanel/LeftPanel";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useNotificationData } from "../../contexts/notificationContext";
import AccountSettingsSidebar from "./sidebar";
import { ProfileContainer } from "./user/container";

export default function SettingContainer() {
	const classes = sidePanelStyles();
	const notificationData = useNotificationData();

	return (
		<Container
			disableGutters
			container
			className={classes.root}
			maxWidth={"xl"}
			component={Grid}
		>
			<Grid container>
				<Grid item xs={12} md={3}>
					<Box position="sticky" top={0} left={0} style={{ width: "100%" }}>
						<Grid container>
							<Grid item xs={2}>
								<LeftPanel />
							</Grid>
							<Grid item xs={10}>
								<AccountSettingsSidebar />
							</Grid>
						</Grid>
					</Box>
				</Grid>
				<Grid item xs={12} md={9}>
					<Routes>
						<Route path="profile/*" element={<ProfileContainer />} />
					</Routes>
				</Grid>
			</Grid>
			{notificationData!.errorNotification && (
				<Snackbar severity="error" msg={notificationData!.errorNotification} />
			)}
			{notificationData!.successNotification && (
				<Snackbar severity="success" msg={notificationData!.successNotification} />
			)}
		</Container>
	);
}
