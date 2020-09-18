import {
	Box,
	Fade,
	FormControlLabel,
	Grid,
	makeStyles,
	Switch,
	Theme,
	Typography,
} from "@material-ui/core";
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
	ImpactProjectsCard,
} from "../Cards";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
	bottonContainer: {
		marginTop: theme.spacing(2),
	},
}));

export default function MainOrganizationDashboard() {
	const intl = useIntl();
	const classes = useStyles();
	const [checked, setChecked] = React.useState(false);

	const handleChange = () => {
		setChecked((prev) => !prev);
	};
	return (
		<>
			<Grid item container style={{ flex: 1.5 }}>
				<Grid item md={12}>
					<Box m={1}>
						<Typography variant="h6">
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
						<Typography variant="h6">
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
					<DashboardCard title={" "} cardHeight={"33vh"}>
						<BudgetProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "} cardHeight={"33vh"}>
						<DeliverableProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "} cardHeight={"33vh"}>
						<ImpactProjectsCard />
					</DashboardCard>
				</Grid>
				<Box m={2} mb={0} mt={0}>
					<FormControlLabel
						control={<Switch size="small" checked={checked} onChange={handleChange} />}
						label="Show More"
					/>
				</Box>
				<Fade in={checked}>
					<Grid container className={classes.bottonContainer}>
						<Grid item md={3}>
							<DashboardCard title={" "} cardHeight={"33vh"}>
								<DonorsCard />
							</DashboardCard>
						</Grid>
						<Grid item md={3}>
							<DashboardCard title={" "} cardHeight={"33vh"}>
								<BudgetCategoryCard />
							</DashboardCard>
						</Grid>
						<Grid item md={3}>
							<DashboardCard title={" "} cardHeight={"33vh"}>
								<DeliverableCategoryCard />
							</DashboardCard>
						</Grid>
						<Grid item md={3}>
							<DashboardCard title={" "} cardHeight={"33vh"}>
								<ImpactCategoryCard />
							</DashboardCard>
						</Grid>
					</Grid>
				</Fade>
			</Grid>
		</>
	);
}
