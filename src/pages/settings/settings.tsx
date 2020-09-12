import { Box, Container, Grid } from "@material-ui/core";
import React from "react";
import { Route, Routes } from "react-router-dom";

import { sidePanelStyles } from "../../components/Dasboard/styles";
import LeftPanel from "../../components/LeftPanel/LeftPanel";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useNotificationData } from "../../contexts/notificationContext";
import IDefaultView from "./defaultView";
import { DonorContainer } from "./donor/container";
import Organization from "./Organization";
import BudgetCategory from "./BudgetMaster";
import SettingsSidebar from "./sidebar";
import ImpactCategory from "./ImpactMaster";
import DeliverableCategory from "./DeliverableMaster";

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
								<SettingsSidebar></SettingsSidebar>
							</Grid>
						</Grid>
					</Box>
				</Grid>
				<Grid item xs={12} md={9}>
					<Routes>
						<Route path="donors" element={<DonorContainer />} />
						<Route path="organization" element={<Organization />} />
						<Route path="budget" element={<BudgetCategory />} />
						<Route path="impact" element={<ImpactCategory />} />
						<Route path="deliverable" element={<DeliverableCategory />} />
						<Route path="/" element={<IDefaultView />} />
					</Routes>
				</Grid>
			</Grid>
			{notificationData!.successNotification && (
				<Snackbar severity="success" msg={notificationData!.successNotification} />
			)}
			{notificationData!.errorNotification && (
				<Snackbar severity="error" msg={notificationData!.errorNotification} />
			)}
		</Container>
	);
}
