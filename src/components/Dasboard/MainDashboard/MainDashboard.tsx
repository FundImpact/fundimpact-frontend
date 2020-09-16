import { Box, Grid } from "@material-ui/core";
import React from "react";
import Achievement from "../Cards/Achievement/Achievement";
import DashboardCard from "../Cards/DasboardCards";
import FundStatus from "../Cards/FundStatus/FundStatus";
import Impact from "../Cards/Impact/Impact";
import ProjectName from "../ProjectName/ProjectName";
import DashboardTableContainer from "../Table/DashboardTableContainer";

export default function MainDashboard() {
	return (
		<>
			<Grid item>
				<ProjectName />
			</Grid>

			<Grid item container style={{ flex: 1.5 }}>
				<Grid item md={4}>
					<DashboardCard title={"FUND STATUS"}>
						<FundStatus />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={"ACHIEVEMENTS"}>
						<Achievement />
					</DashboardCard>
				</Grid>
				<Grid item md={4}>
					<DashboardCard title={"IMPACT"}>
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
