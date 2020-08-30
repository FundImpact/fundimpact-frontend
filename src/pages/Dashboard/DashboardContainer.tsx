import { Box, Button, Container, Fab, Grid, IconButton, Typography } from "@material-ui/core";
import React from "react";

import Achievement from "../../components/Dasboard/Cards/Achievement/Achievement";
import DashboardCard from "../../components/Dasboard/Cards/DasboardCards";
import FundStatus from "../../components/Dasboard/Cards/FundStatus/FundStatus";
import Impact from "../../components/Dasboard/Cards/Impact/Impact";
import ProjectName from "../../components/Dasboard/ProjectName/ProjectName";
import { sidePanelStyles } from "../../components/Dasboard/styles";
import LeftPanel from "../../components/LeftPanel/LeftPanel";
import SideBar from "../../components/SideBar/SideBar";
import { DashboardProvider } from "../../contexts/dashboardContext";
import useLocalStorage from "../../hooks/storage/useLocalStorage";
import { inspect } from "util";

interface IDashboardContainer {
	left: React.ReactNode;
	main: React.ReactNode;
	top?: React.ReactNode;
}

export default function DashboardContainer({ left, main, top }: IDashboardContainer) {
	const classes = sidePanelStyles();
	const [isSideBarOpen, setSideBarOpen] = useLocalStorage("isSideBarOpen", false);
	return (
		<DashboardProvider>
			<Container
				disableGutters
				container
				className={classes.root}
				maxWidth={"xl"}
				component={Grid}
			>
				<Grid container>
					<Grid item xs={12} md={isSideBarOpen ? 3 : "auto"}>
						<Box position="sticky" top={0} left={0} style={{ width: "100%" }}>
							<Grid container>
								<Grid item xs={isSideBarOpen ? 2 : "auto"}>
									<LeftPanel />
								</Grid>
								{isSideBarOpen ? (
									<Grid item xs={10}>
										<SideBar>
											{(
												organization: { name: string; id: string | null },
												workspaces: { name: string; id: string | number }[]
											) => {
												return (
													<Grid container direction="column">
														<Grid item>
															<Typography
																variant="h5"
																gutterBottom
																noWrap={true}
															>
																<Box color="primary.main">
																	{organization.name}
																</Box>
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
										<Fab
											className={classes.expanded}
											color="primary"
											size="small"
											style={{
												top: "50%",
												right: -10,
												transform: "translateY(-50%)",
												position: "absolute",
											}}
											onClick={() =>
												setSideBarOpen((state: boolean) => !state)
											}
										>
											<span className="material-icons">arrow_back_ios</span>
										</Fab>
									</Grid>
								) : (
									<Box width={40} mx={2} display="flex" alignItems="center">
										<Fab
											className={classes.collapsed}
											color="primary"
											size="small"
											onClick={() =>
												setSideBarOpen((state: boolean) => !state)
											}
										>
											<span className="material-icons">
												arrow_forward_ios
											</span>
										</Fab>
									</Box>
								)}
							</Grid>
						</Box>
					</Grid>

					<Grid item xs md={isSideBarOpen ? 9 : 11} container direction="column">
						<Grid item>
							<ProjectName />
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
				</Grid>
			</Container>
		</DashboardProvider>
	);
}
