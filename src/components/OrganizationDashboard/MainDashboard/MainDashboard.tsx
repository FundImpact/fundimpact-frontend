import { Box, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import DashboardCard from "../../Dasboard/Cards/DasboardCards";
import {
	BudgetOrgCard,
	DeliverableOrgCard,
	ImpactOrgCard,
	BudgetProjectsCard,
	DeliverableProjectsCard,
	DonorsCard,
	BudgetCategoryCard,
	DeliverableCategoryCard,
	ImpactCategoryCard,
} from "../Cards";

const useStyles = makeStyles((theme: Theme) => ({
	bottonContainer: {
		marginTop: theme.spacing(1),
	},
}));

export default function MainOrganizationDashboard() {
	const classes = useStyles();
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
				<Grid container className={classes.bottonContainer}>
					<Grid item md={3}>
						<DashboardCard title={"Donors"} cardHeight={"15rem"}>
							<DonorsCard />
						</DashboardCard>
					</Grid>
					<Grid item md={3}>
						<DashboardCard title={"Budget Category"} cardHeight={"15rem"}>
							<BudgetCategoryCard />
						</DashboardCard>
					</Grid>
					<Grid item md={3}>
						<DashboardCard title={"Deliverable Category"} cardHeight={"15rem"}>
							<DeliverableCategoryCard />
						</DashboardCard>
					</Grid>
					<Grid item md={3}>
						<DashboardCard title={"Impact Category"} cardHeight={"15rem"}>
							<ImpactCategoryCard />
						</DashboardCard>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}
