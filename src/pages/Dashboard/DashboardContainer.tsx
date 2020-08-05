import React from "react";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { useStyles } from "../../components/Dasboard/styles";
import SideBar from "../../components/SideBar/SideBar";
import LeftPanel from "../../components/LeftPanel/LeftPanel";
import DashboardCard from "../../components/Dasboard/Cards/DasboardCards";
import FundStatus from "../../components/Dasboard/Cards/FundStatus/FundStatus";
import Achievement from "../../components/Dasboard/Cards/Achievement/Achievement";
import Impact from "../../components/Dasboard/Cards/Impact/Impact";

interface IDashboardContainer {
	left: React.ReactNode;
	main: React.ReactNode;
	top?: React.ReactNode;
}

export default function DashboardContainer({ left, main, top }: IDashboardContainer) {
	const classes = useStyles();
	return (
		<Container
			disableGutters
			container
			className={classes.root}
			maxWidth={"xl"}
			component={Grid}
		>
			<Grid item xs={12} md={3} container>
				<Grid item xs={2}>
					<LeftPanel />
				</Grid>
				<Grid item xs={10}>
					<SideBar>
						{(
							organisation: { name: string; id: string | null },
							workspaces: { name: string; id: string | number }[]
						) => {
							return (
								<Grid container direction="column">
									<Grid item>
										<Typography variant="h5" gutterBottom noWrap={true}>
											<Box color="primary.main">{organisation.name}</Box>
										</Typography>
									</Grid>
									<Grid item>
										<Box mt={5}>
											{workspaces.map((workspace) => {
												return (
													<Typography
														key={workspace.id}
														variant="subtitle1"
														gutterBottom
														noWrap={true}
													>
														<Box color="primary.main">
															{workspace.name}
														</Box>
													</Typography>
												);
											})}
										</Box>
									</Grid>
								</Grid>
							);
						}}
					</SideBar>
				</Grid>
			</Grid>

			<Grid item xs md={9} container direction="column">
				<Grid item>
					<Box m={2} mb={1}>
						<Typography variant={"h5"}>Project One</Typography>
					</Box>
				</Grid>

				<Grid item container style={{ flex: 1.5 }}>
					<Grid item md={4}>
						<DashboardCard title={"FUND STATUS"} Children={FundStatus} />
					</Grid>
					<Grid item md={4}>
						<DashboardCard title={"ACHIEVEMENTS"} Children={Achievement} />
					</Grid>
					<Grid item md={4}>
						<DashboardCard title={"IMPACT"} Children={Impact} />
					</Grid>
				</Grid>
				<Grid item style={{ flex: 4 }}>
					<Box ml={1}>{main}</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
