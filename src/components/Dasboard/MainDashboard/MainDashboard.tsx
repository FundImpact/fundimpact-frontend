import { Box, Grid } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import Achievement from "../Cards/Achievement/Achievement";
import { CARD_TYPES } from "../Cards/constants";
import DashboardCard from "../Cards/DasboardCards";
import FundStatus from "../Cards/FundStatus/FundStatus";
import Impact from "../Cards/Impact/Impact";
import ProjectName from "../ProjectName/ProjectName";
import DashboardTableContainer from "../Table/DashboardTableContainer";

export default function MainDashboard() {
	const intl = useIntl();
	return (
		<>
			<Grid item>
				<ProjectName />
			</Grid>

			<Grid item container style={{ flex: 1.5 }}>
				<Grid item md={4}>
					<DashboardCard
						title={intl.formatMessage({
							id: "fundStatusCardTitle",
							defaultMessage: "FUND STATUS",
							description: `This text will be show on dashboard for fund status card title`,
						})}
						type={CARD_TYPES.DEFAULT}
					>
						<FundStatus />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title={intl.formatMessage({
							id: "achievementCardTitle",
							defaultMessage: "ACHIEVEMENT",
							description: `This text will be show on dashboard for achievement card title`,
						})}
						type={CARD_TYPES.DEFAULT}
					>
						<Achievement />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title={intl.formatMessage({
							id: "impactCardTitle",
							defaultMessage: "IMPACT",
							description: `This text will be show on dashboard for impacts card title`,
						})}
						type={CARD_TYPES.DEFAULT}
					>
						<Impact />
					</DashboardCard>
				</Grid>
			</Grid>
			<Grid item style={{ flex: 4 }}>
				<Box ml={1}>
					<DashboardTableContainer />
				</Box>
			</Grid>
		</>
	);
}
