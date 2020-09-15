import { Box, Divider, Grid, Typography } from "@material-ui/core";
import React from "react";
import DashboardCard from "../../Dasboard/Cards/DasboardCards";
import BudgetOrgCard from "../Cards/BudgetOrg";
import DeliverableOrgCard from "../Cards/DeliverableOrg";
import ImpactOrgCard from "../Cards/ImpactOrg";
import BudgetProjectsCard from "../Cards/BudgetProjects";
export default function MainOrganizationDashboard() {
	return (
		<>
			<Grid item container style={{ flex: 1.5 }}>
				<Grid item md={12}>
					<Box m={1}>
						<Typography variant="h5">Overview</Typography>
					</Box>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "}>
						<BudgetOrgCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "}>
						<DeliverableOrgCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "}>
						<ImpactOrgCard />
					</DashboardCard>
				</Grid>
				<Grid item md={12}>
					<Box m={1}>
						<Typography variant="h5">Top Projects</Typography>
					</Box>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "}>
						<BudgetProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={"Deliverable Achieved"}>
						<DeliverableOrgCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={"Impacts Achieved"}>
						<ImpactOrgCard />
					</DashboardCard>
				</Grid>
			</Grid>
		</>
	);
}
