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
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
	bottonContainer: {
		marginTop: theme.spacing(1),
	},
}));

export default function MainOrganizationDashboard() {
	const intl = useIntl();
	const classes = useStyles();
	return (
		<>
			<Grid item container style={{ flex: 1.5 }}>
				<Grid item md={12}>
					<Box m={1}>
						<Typography variant="h5">
							<FormattedMessage
								id="orgDashboardOverviewHeading"
								defaultMessage="Overview"
								description="This text will be show on organization dashboard for overview heading"
							/>
						</Typography>
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
						<Typography variant="h5">
							{" "}
							<FormattedMessage
								id="orgDashboardTopProjectsHeading"
								defaultMessage="Top Projects"
								description="This text will be show on organization dashboard for top projects heading"
							/>
						</Typography>
					</Box>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "} cardHeight={"15rem"}>
						<BudgetProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title={intl.formatMessage({
							id: "deliverableAchievedCardTitle",
							defaultMessage: "Deliverable Achieved",
							description: `This text will be show on dashboard for deliverable achieved card title`,
						})}
						cardHeight={"15rem"}
					>
						<DeliverableProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title={intl.formatMessage({
							id: "impactAchievedCardTitle",
							defaultMessage: "Impact Achieved",
							description: `This text will be show on dashboard for impact achieved card title`,
						})}
						cardHeight={"15rem"}
					>
						<DeliverableProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid container className={classes.bottonContainer}>
					<Grid item md={3}>
						<DashboardCard
							title={intl.formatMessage({
								id: "donorsCardTitle",
								defaultMessage: "Donors",
								description: `This text will be show on dashboard for donors card title`,
							})}
							cardHeight={"15rem"}
						>
							<DonorsCard />
						</DashboardCard>
					</Grid>
					<Grid item md={3}>
						<DashboardCard
							title={intl.formatMessage({
								id: "budgetCategoryCardTitle",
								defaultMessage: "Budget Category",
								description: `This text will be show on dashboard for budget category card title`,
							})}
							cardHeight={"15rem"}
						>
							<BudgetCategoryCard />
						</DashboardCard>
					</Grid>
					<Grid item md={3}>
						<DashboardCard
							title={intl.formatMessage({
								id: "deliverableCategoryCardTitle",
								defaultMessage: "Deliverable Category",
								description: `This text will be show on dashboard for deliverable category card title`,
							})}
							cardHeight={"15rem"}
						>
							<DeliverableCategoryCard />
						</DashboardCard>
					</Grid>
					<Grid item md={3}>
						<DashboardCard
							title={intl.formatMessage({
								id: "impactCategoryCardTitle",
								defaultMessage: "Impact Category",
								description: `This text will be show on dashboard for impact category card title`,
							})}
							cardHeight={"15rem"}
						>
							<ImpactCategoryCard />
						</DashboardCard>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}
