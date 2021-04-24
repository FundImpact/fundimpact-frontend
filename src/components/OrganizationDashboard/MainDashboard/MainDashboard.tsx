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
	IconButton,
	Chip,
	Avatar,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DashboardCard from "../../Dasboard/Cards/DasboardCards";
import { FormattedMessage, useIntl } from "react-intl";
import { CARD_TYPES, CARD_OF } from "../../Dasboard/Cards/constants";
import { useDashboardDispatch, useDashBoardData } from "../../../contexts/dashboardContext";
import { setProject } from "../../../reducers/dashboardReducer";
import {
	GET_ANNUAL_YEAR_LIST,
	GET_FINANCIAL_YEARS,
	GET_PROJECTS_BY_WORKSPACE,
} from "../../../graphql";
import { useLazyQuery } from "@apollo/client";
import NoProjectCreated from "./NoProjectCreated";
import { Navigate } from "react-router";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { mainDashboardCardFilter } from "./inputField.json";
import FilterList from "../../FilterList";
const useStyles = makeStyles((theme: Theme) => ({
	bottonContainer: {
		marginTop: theme.spacing(2),
	},
}));

let donorHash = {};
let financialYearHash = {};
let annualYearHash = {};

const chipArray = ({
	removeChip,
	elementList,
	name,
}: {
	elementList: string[];
	removeChip: (index: number) => void;
	name: string;
}) => {
	return elementList.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				avatar={
					<Avatar
						style={{
							height: "30px",
							width: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				label={element}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

const createChipArray = ({
	filterListObjectKeyValuePair,
	donorHash,
	financialYearHash,
	annualYearHash,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	donorHash: { [key: string]: string };
	financialYearHash: { [key: string]: string };
	annualYearHash: { [key: string]: string };
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "donor") {
			return chipArray({
				elementList: filterListObjectKeyValuePair[1].map((ele) => donorHash[ele]),
				name: "do",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "financial_year") {
			return chipArray({
				elementList: filterListObjectKeyValuePair[1].map((ele) => financialYearHash[ele]),
				name: "fy",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "annual_year") {
			return chipArray({
				elementList: filterListObjectKeyValuePair[1].map((ele) => annualYearHash[ele]),
				name: "ay",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

const mapIdToName = (
	arr: { id: string; name: string }[],
	initialObject: { [key: string]: string }
) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		initialObject
	);
};

const removeFilterListObjectElements = ({
	filterListObject,
	key,
	index,
}: {
	filterListObject: {
		[key: string]: string[];
	};
	key: string;
	index?: number;
}) => {
	filterListObject[key] = (filterListObject[key] as string[]).filter((ele, i) => index !== i);

	return { ...filterListObject };
};

export default function MainOrganizationDashboard() {
	const classes = useStyles();
	const [checked, setChecked] = React.useState(false);
	const dashboardData = useDashBoardData();

	const [globalDonorAndFinancialYearFilter, setGlobalDonorAndFinancialYearFilter] = useState<{
		[key: string]: string[];
	}>({ donor: [], financial_year: [], annual_year: [] });

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onCompleted: (data) => {
			donorHash = mapIdToName(data.orgDonors, donorHash);
		},
	});

	let [getFinancialYearOrg, { data: financialYearOrg }] = useLazyQuery(GET_FINANCIAL_YEARS, {
		onCompleted: (data) => {
			financialYearHash = mapIdToName(data.financialYearList, financialYearHash);
		},
	});

	useEffect(() => {
		if (dashboardData?.organization) {
			getOrganizationDonors({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData, getOrganizationDonors]);

	let [getAnnualYears, { data: annualYears }] = useLazyQuery(GET_ANNUAL_YEAR_LIST, {
		onCompleted: (data) => {
			annualYearHash = mapIdToName(data.annualYearList, annualYearHash);
		},
		onError: (err) => {
			console.error(err);
		},
	});

	useEffect(() => {
		if (dashboardData?.organization) {
			getFinancialYearOrg({
				variables: {
					filter: {
						country: dashboardData?.organization?.country?.id,
					},
				},
			});
		}
	}, [dashboardData, getFinancialYearOrg]);

	useEffect(() => {
		getAnnualYears();
	}, [getAnnualYears]);

	mainDashboardCardFilter[0].optionsArray = donors?.orgDonors || [];
	mainDashboardCardFilter[1].optionsArray = annualYears?.annualYearList || [];
	mainDashboardCardFilter[2].optionsArray = financialYearOrg?.financialYearList || [];

	const removeFilterListElements = (key: string, index?: number) =>
		setGlobalDonorAndFinancialYearFilter((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

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
				<Grid item md={11}>
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
				<Grid item md={1}>
					<Box m={1}>
						<FilterList
							initialValues={{ ...globalDonorAndFinancialYearFilter }}
							setFilterList={setGlobalDonorAndFinancialYearFilter}
							inputFields={mainDashboardCardFilter}
						/>
					</Box>
				</Grid>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(globalDonorAndFinancialYearFilter).map(
							(filterListObjectKeyValuePair) =>
								createChipArray({
									filterListObjectKeyValuePair,
									donorHash,
									annualYearHash,
									financialYearHash,
									removeFilterListElements,
								})
						)}
					</Box>
				</Grid>
				<Grid item md={4}>
					<DashboardCard
						type={CARD_TYPES.PROJECT}
						cardOf={CARD_OF.BUDGET}
						globalDonorAndFinancialYearFilter={globalDonorAndFinancialYearFilter}
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
						globalDonorAndFinancialYearFilter={globalDonorAndFinancialYearFilter}
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
						globalDonorAndFinancialYearFilter={globalDonorAndFinancialYearFilter}
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
						globalDonorAndFinancialYearFilter={globalDonorAndFinancialYearFilter}
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
						globalDonorAndFinancialYearFilter={globalDonorAndFinancialYearFilter}
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
						globalDonorAndFinancialYearFilter={globalDonorAndFinancialYearFilter}
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
										globalDonorAndFinancialYearFilter={
											globalDonorAndFinancialYearFilter
										}
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
