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

const useStyles = makeStyles((theme: Theme) => ({
	bottonContainer: {
		marginTop: theme.spacing(2),
	},
}));

export default function MainOrganizationDashboard() {
	const classes = useStyles();
	const [checked, setChecked] = React.useState(false);

	const handleChange = () => {
		setChecked((prev) => !prev);
	};
	return (
		<>
			<Grid item container style={{ flex: 1.5 }}>
				<Grid item md={12}>
					<Box m={1} mt={2}>
						<Typography variant="h6">Overview</Typography>
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
					<Box m={1} mt={0}>
						<Typography variant="h6">Top Projects</Typography>
					</Box>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "} cardHeight={"15rem"}>
						<BudgetProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "} cardHeight={"15rem"}>
						<DeliverableProjectsCard />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={" "} cardHeight={"15rem"}>
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
							<DashboardCard title={" "} cardHeight={"15rem"}>
								<DonorsCard />
							</DashboardCard>
						</Grid>
						<Grid item md={3}>
							<DashboardCard title={" "} cardHeight={"15rem"}>
								<BudgetCategoryCard />
							</DashboardCard>
						</Grid>
						<Grid item md={3}>
							<DashboardCard title={" "} cardHeight={"15rem"}>
								<DeliverableCategoryCard />
							</DashboardCard>
						</Grid>
						<Grid item md={3}>
							<DashboardCard title={" "} cardHeight={"15rem"}>
								<ImpactCategoryCard />
							</DashboardCard>
						</Grid>
					</Grid>
				</Fade>
			</Grid>
		</>
	);
}
