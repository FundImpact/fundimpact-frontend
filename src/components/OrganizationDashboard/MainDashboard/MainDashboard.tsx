import {
	Box,
	Fade,
	FormControlLabel,
	Grid,
	makeStyles,
	Switch,
	Theme,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DashboardCard from "../../Dasboard/Cards/DasboardCards";
import { FormattedMessage, useIntl } from "react-intl";
import { CARD_TYPES, CARD_OF } from "../../Dasboard/Cards/constants";
import { useDashboardDispatch, useDashBoardData } from "../../../contexts/dashboardContext";
import { setProject } from "../../../reducers/dashboardReducer";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
import { useQuery, useLazyQuery } from "@apollo/client";
import NoProjectCreated from "./NoProjectCreated";
import { Navigate } from "react-router";
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
	const intl = useIntl();
	let expenditure: string = intl.formatMessage({
		id: "expenditureButtonCards",
		defaultMessage: "Expenditure",
		description: "This text will be show on cards for expenditure button",
	});
	let allocation: string = intl.formatMessage({
		id: "allocationButtonCards",
		defaultMessage: "Allocation",
		description: "This text will be show on cards for allocation button",
	});
	let received: string = intl.formatMessage({
		id: "receivedButtonCards",
		defaultMessage: "Received",
		description: "This text will be show on cards for received button",
	});
	let allocated: string = intl.formatMessage({
		id: "allocatedButtonCards",
		defaultMessage: "Allocated",
		description: "This text will be show on cards for achieved button",
	});
	let projects: string = intl.formatMessage({
		id: "projectsButtonCards",
		defaultMessage: "Projects",
		description: "This text will be show on cards for project button",
	});
	let achieved: string = intl.formatMessage({
		id: "achievedButtonCards",
		defaultMessage: "Achieved",
		description: "This text will be show on cards for achieved button",
	});
	const dispatch = useDashboardDispatch();
	useEffect(() => {
		dispatch(setProject(undefined));
	}, [dispatch, setProject]);

	const [getProjects, { data: projectList, loading }] = useLazyQuery(GET_PROJECTS_BY_WORKSPACE, {
		fetchPolicy: "network-only",
	});

	const [redirectToDashboard, setRedirectToDashboard] = useState<boolean>(false);
	const [showOrgOverview, setShowOrgOverview] = useState<boolean>(true);

	useEffect(() => {
		getProjects();
	}, []);

	useEffect(() => {
		if (projectList?.orgProject?.length == 0 && showOrgOverview == true) {
			setShowOrgOverview(false);
		}
	}, [projectList, setShowOrgOverview, showOrgOverview]);

	if (loading) {
		return (
			<Box
				position="fixed"
				left="50%"
				top="50%"
				style={{ transform: "translate(-50%, -50%)" }}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (redirectToDashboard) {
		return <Navigate to="/dashboard" />;
	}

	if (!showOrgOverview) {
		return <NoProjectCreated setRedirectToDashboard={setRedirectToDashboard} />;
	}

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
						cardOf={CARD_OF.BUDGET}
						projectCardConfig={{
							title: intl.formatMessage({
								id: "BudgetOrgCardTitle",
								defaultMessage: "Budget Target",
								description:
									"This text will be show on budget org card for budget target title",
							}),
							firstBarHeading: intl.formatMessage({
								id: "BudgetOrgCardFirstBarHeading",
								defaultMessage: "Spend",
								description:
									"This text will be show on budget org card for budget target first bar heading ",
							}),
							secondBarHeading: intl.formatMessage({
								id: "BudgetOrgCardSecondBarHeading",
								defaultMessage: "Fund Received",
								description:
									"This text will be show on budget org card for budget target second bar heading ",
							}),
						}}
						cardHeight="220px"
						tooltip={intl.formatMessage({
							defaultMessage:
								"This card is showing overall progress of funds. Also total fund spend, received and expenditure made by organization",
							id: "BudgetOrgCardTooltip",
							description:
								"This text will be show on budget org card for budget target title",
						})}
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						type={CARD_TYPES.PROJECT}
						cardOf={CARD_OF.DELIVERABLE}
						projectCardConfig={{
							title: intl.formatMessage({
								id: "DeliverableOrgCardTitle",
								defaultMessage: "Deliverables",
								description:
									"This text will be show on budget org card for deliverable target title",
							}),
							firstBarHeading: intl.formatMessage({
								id: "DeliverableOrgCardFirstBarHeading",
								defaultMessage: "Avg. progress",
								description:
									"This text will be show on budget org card for deliverable target first bar heading ",
							}),
							secondBarHeading: intl.formatMessage({
								id: "DeliverableOrgCardSecondBarHeading",
								defaultMessage: "Deliverable Achieved",
								description:
									"This text will be show on budget org card for deliverable target second bar heading ",
							}),
						}}
						cardHeight="220px"
						tooltip={intl.formatMessage({
							description:
								"This text will be show on budget org card for deliverable target tooltip",
							id: "DeliverableOrgCardTooltip",
							defaultMessage:
								"This card is showing overall progress of deliverable. Also total deliverable target and deliverable achieved by organization",
						})}
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						type={CARD_TYPES.PROJECT}
						cardOf={CARD_OF.IMPACT}
						projectCardConfig={{
							title: intl.formatMessage({
								id: "ImpactOrgCardTitle",
								defaultMessage: "Impact Target",
								description:
									"This text will be show on budget org card for impact target title",
							}),
							firstBarHeading: intl.formatMessage({
								id: "ImpactOrgCardFirstBarHeading",
								defaultMessage: "Avg. progress",
								description:
									"This text will be show on budget org card for impact target first bar heading ",
							}),
							secondBarHeading: intl.formatMessage({
								id: "ImpactOrgCardSecondBarHeading",
								defaultMessage: "Impacts Achieved",
								description:
									"This text will be show on budget org card for impact target second bar heading ",
							}),
						}}
						cardHeight="220px"
						tooltip={intl.formatMessage({
							defaultMessage:
								"This card is showing overall progress of impact. Also total impact target and impact achieved by organization",
							description:
								"This text will be show on budget org card for impact target tooltip",
							id: "ImpactOrgCardTooltip",
						})}
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
						title={intl.formatMessage({
							id: "budgetProjectCardTitle",
							defaultMessage: "Budget Project",
							description:
								"This text will be show on dashboard for budget project card title",
						})}
						type={CARD_TYPES.PROGRESS}
						cardOf={CARD_OF.BUDGET}
						cardHeight="280px"
						tooltip={intl.formatMessage({
							defaultMessage:
								"This card is showing top projects fund spend, received and expenditure made by organization",
							id: "budgetProjectCardTooltip",
							description:
								"This text will be show on dashboard for budget project card tooltip",
						})}
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title={intl.formatMessage({
							id: "deliverableAchievedCardTitle",
							defaultMessage: "Deliverable Achieved",
							description:
								"This text will be show on dashboard for deliverable achieved card title",
						})}
						type={CARD_TYPES.PROGRESS}
						cardHeight="280px"
						cardOf={CARD_OF.DELIVERABLE}
						tooltip={intl.formatMessage({
							id: "deliverableAchievedCardTooltip",

							description:
								"This text will be show on dashboard for deliverable achieved card tooltip",
							defaultMessage:
								"This card is showing top projects deliverable target and deliverable achieved by organization",
						})}
					/>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						title={intl.formatMessage({
							id: "impactAchievedCardTitle",
							defaultMessage: "Impact Achieved",
							description:
								"This text will be show on dashboard for impact achieved card title",
						})}
						type={CARD_TYPES.PROGRESS}
						cardOf={CARD_OF.IMPACT}
						cardHeight="280px"
						tooltip={intl.formatMessage({
							id: "impactAchievedCardTooltip",
							description:
								"This text will be show on dashboard for impact achieved card tooltip",
							defaultMessage:
								"This card is showing organization's top projects impact target and impact achieved by organization",
						})}
					/>
				</Grid>
				<Box m={2} mb={0} mt={0}>
					<FormControlLabel
						control={<Switch size="small" checked={checked} onChange={handleChange} />}
						label={intl.formatMessage({
							id: "showMoreLabel",
							defaultMessage: "Show More",
							description:
								"This text will be show on dashboard for show more toggle button",
						})}
					/>
				</Box>
				<Fade in={checked}>
					<Grid container className={classes.bottonContainer}>
						{checked && (
							<>
								<Grid item md={3}>
									<DashboardCard
										// title={intl.formatMessage({
										// 	id: "donorsCardTitle",
										// 	defaultMessage: "Donors",
										// 	description:
										// 		"This text will be show on dashboard for donor card title",
										// })}
										type={CARD_TYPES.PROGRESS}
										cardOf={CARD_OF.DONOR}
										cardHeight="240px"
									/>
								</Grid>
								<Grid item md={3}>
									<DashboardCard
										cardFilter={[
											{ label: expenditure, base: "Expenditure" },
											{ label: allocation, base: "Allocation" },
										]}
										title={intl.formatMessage({
											id: "budgetCategoryCardTitle",
											defaultMessage: "Budget Category",
											description:
												"This text will be show on dashboard for budget category card title",
										})}
										type={CARD_TYPES.PIE}
										cardOf={CARD_OF.BUDGET}
										cardHeight="240px"
										pieCardConfig={{
											moreButtonLink: "/settings/budget",
										}}
										tooltip={intl.formatMessage({
											description:
												"This text will be show on dashboard for budget category card tooltip",
											id: "budgetCategoryCardTitle",
											defaultMessage:
												"This card is showing pie chart for top budget categories",
										})}
									/>
								</Grid>
								<Grid item md={3}>
									<DashboardCard
										title={intl.formatMessage({
											id: "deliverableCategoryCardTitle",
											defaultMessage: "Deliverable Category",
											description:
												"This text will be show on dashboard for deliverable category card title",
										})}
										cardFilter={[
											{ label: projects, base: "Projects" },
											{ label: achieved, base: "Achieved" },
										]}
										type={CARD_TYPES.PIE}
										cardHeight="240px"
										pieCardConfig={{
											moreButtonLink: "/settings/deliverable",
										}}
										cardOf={CARD_OF.DELIVERABLE}
										tooltip={intl.formatMessage({
											id: "deliverableCategoryCardTooltip",
											description:
												"This text will be show on dashboard for deliverable category card tooltip",
											defaultMessage:
												"This card is showing pie chart for top deliverable categories",
										})}
									/>
								</Grid>
								<Grid item md={3}>
									<DashboardCard
										title={intl.formatMessage({
											id: "impactCategoryCardTitle",
											defaultMessage: "Impact Category",
											description:
												"This text will be show on dashboard for impact category card title",
										})}
										type={CARD_TYPES.PIE}
										cardFilter={[
											{ label: projects, base: "Projects" },
											{ label: achieved, base: "Achieved" },
										]}
										cardHeight="240px"
										pieCardConfig={{
											moreButtonLink: "/settings/impact",
										}}
										cardOf={CARD_OF.IMPACT}
										tooltip={intl.formatMessage({
											defaultMessage:
												"This card is showing pie chart for top impact categories",
											id: "impactCategoryCardTitle",
											description:
												"This text will be show on dashboard for impact category card tooltip",
										})}
									/>
								</Grid>
							</>
						)}
					</Grid>
				</Fade>
			</Grid>
		</>
	);
}
