import { Box, Grid } from "@material-ui/core";
import React from "react";
import DashboardCard from "../../Dasboard/Cards/DasboardCards";
import BudgetOrgCard from "../Cards/BudgetOrg";
export default function MainOrganizationDashboard() {
	return (
		<>
			<Grid item>
				<h1>Overview</h1>
			</Grid>

			<Grid item container style={{ flex: 1.5 }}>
				<Grid item md={4}>
					<DashboardCard title={" "}>
						<BudgetOrgCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "}></DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "}></DashboardCard>
				</Grid>
			</Grid>
			<Grid item style={{ flex: 4 }}>
				<Box ml={1}></Box>
			</Grid>
		</>
	);
}
