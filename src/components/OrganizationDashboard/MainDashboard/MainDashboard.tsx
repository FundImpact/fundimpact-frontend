import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import DashboardCard from "../../Dasboard/Cards/DasboardCards";
import BudgetOrgCard from "../Cards/BudgetOrg";
import DeliverableOrgCard from "../Cards/DeliverableOrg";
import ImpactOrgCard from "../Cards/ImpactOrg";
import BudgetProjectsCard from "../Cards/BudgetProjects";
import DeliverableProjectsCard from "../Cards/DeliverableProjects";
import DonorsCard from "../Cards/Donors";
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
					<DashboardCard title={" "} cardHeight={"15rem"}>
						<BudgetProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={"Deliverable Achieved"} cardHeight={"15rem"}>
						<DeliverableProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={"Impacts Achieved"} cardHeight={"15rem"}>
						<DeliverableProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid container>
					<Grid item md={3}>
						<DashboardCard title={"Donors"} cardHeight={"15rem"}>
							<DonorsCard />
						</DashboardCard>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}
