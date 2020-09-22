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
import { FormattedMessage } from "react-intl";
import { CARD_TYPES } from "../../Dasboard/Cards/constants";
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
					<DashboardCard
						type={CARD_TYPES.PROJECT}
						projectCardTitle="Budget Target"
						projectCardFirstBarHeading="1.2 SPENT"
						projectCardSecondBarHeading="Fund Received"
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						type={CARD_TYPES.PROJECT}
						projectCardTitle="Deliverables"
						projectCardFirstBarHeading="70 % avg Progress"
						projectCardSecondBarHeading="Deliverable achieved"
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						type={CARD_TYPES.PROJECT}
						projectCardTitle="Impact Target"
						projectCardFirstBarHeading="80 % avg Progress"
						projectCardSecondBarHeading="Impact achieved"
					/>
				</Grid>
				<Grid item md={12}>
					<Box m={1}>
						<Typography variant="h6">
							<FormattedMessage
								id="orgDashboardTopProjectsHeading"
								defaultMessage="Top Projects"
								description="This text will be show on organization dashboard for top projects heading"
							/>
						</Typography>
					</Box>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title="Budget Project"
						cardFilter={[
							{ label: "Received", filter: {} },
							{ label: "Allocated", filter: {} },
						]}
						type={CARD_TYPES.PROGRESS}
						cardHeight="33vh"
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title="Deliverable Achieved"
						type={CARD_TYPES.PROGRESS}
						cardHeight="33vh"
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title="Budget Project"
						type={CARD_TYPES.PROGRESS}
						cardHeight="33vh"
					/>
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
							<DashboardCard
								title="Budget Project"
								cardFilter={[
									{ label: "Received", filter: {} },
									{ label: "Allocated", filter: {} },
								]}
								type={CARD_TYPES.PROGRESS}
								cardHeight="33vh"
							/>
						</Grid>
						<Grid item md={3}>
							<DashboardCard
								title="Budget Category"
								cardFilter={[
									{ label: "Projects", filter: {} },
									{ label: "Achieved", filter: {} },
								]}
								type={CARD_TYPES.PIE}
								cardHeight="33vh"
								moreButtonLink="/settings/budget"
							/>
						</Grid>
						<Grid item md={3}>
							<DashboardCard
								title="Deliverable Category"
								cardFilter={[
									{ label: "Projects", filter: {} },
									{ label: "Achieved", filter: {} },
								]}
								type={CARD_TYPES.PIE}
								cardHeight="33vh"
								moreButtonLink="/settings/deliverable"
							/>
						</Grid>
						<Grid item md={3}>
							<DashboardCard
								title="Impact Category"
								cardFilter={[
									{ label: "Projects", filter: {} },
									{ label: "Achieved", filter: {} },
								]}
								type={CARD_TYPES.PIE}
								cardHeight="33vh"
								moreButtonLink="/settings/impact"
							/>
						</Grid>
					</Grid>
				</Fade>
			</Grid>
		</>
	);
}
