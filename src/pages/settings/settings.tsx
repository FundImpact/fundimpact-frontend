import { Box, Container, Grid } from "@material-ui/core";
import React from "react";
import { Route, Routes } from "react-router-dom";

import { sidePanelStyles } from "../../components/Dasboard/styles";
import LeftPanel from "../../components/LeftPanel/LeftPanel";
import { DashboardProvider } from "../../contexts/dashboardContext";
import IDefaultView from "./defaultView";
import SettingsSidebar from "./sidebar";

const ItestingDonor = () => <div>donors component will be here.</div>;

export default function SettingContainer() {
	const classes = sidePanelStyles();

	return (
		<DashboardProvider>
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
							<Route path="donors" element={<ItestingDonor />} />
							<Route path="/" element={<IDefaultView />} />
						</Routes>
					</Grid>
				</Grid>
			</Container>
		</DashboardProvider>
	);
}
