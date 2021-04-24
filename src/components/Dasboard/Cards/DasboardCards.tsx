import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import { CARD_TYPES } from "./constants";
import { CardProps } from "../../../models/cards/cards";
import { GetCardTypeAndValues } from "./cardHooks/GetCardType";
import { ProjectCard, PieCard, ProgressCard } from "./CommonCards";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useIntl } from "react-intl";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { GET_ANNUAL_YEAR_LIST, GET_FINANCIAL_YEARS } from "../../../graphql";
import FilterList from "../../FilterList";
import { dashboardCardFilter } from "./inputFields.json";

let donorHash = {};
let financialYearHash = {};
let annualYearHash = {};

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

export default function DashboardCard(props: CardProps) {
	const { title, children, cardHeight = "180px", cardFilter, tooltip } = props;
	const [localDonorAndFinancialYearFilter, setLocalDonorAndFinancialYearFilter] = useState<{
		[key: string]: string[];
	}>({ donor: [], financial_year: [], annual_year: [] });
	const [currentFilter, setCurrentFilter] = useState<{ label: string; base: string }>();
	let { projectCardConfig, pieCardConfig, progressCardConfig } = GetCardTypeAndValues({
		...props,
		currentFilter,
		localDonorAndFinancialYearFilter,
		globalDonorAndFinancialYearFilter: props.globalDonorAndFinancialYearFilter,
	});

	const useStyles = makeStyles((theme: Theme) => ({
		root: {
			width: "100%",
			"& > * + *": {
				marginTop: theme.spacing(2),
			},
		},
		card: {
			margin: theme.spacing(1),
			marginTop: theme.spacing(0),
		},
	}));

	/*setting first filter as default filter*/
	useEffect(() => {
		if (cardFilter?.length) {
			setCurrentFilter(cardFilter[0]);
		}
	}, [cardFilter]);

	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const dashboardData = useDashBoardData();
	function renderCard() {
		switch (props.type) {
			case CARD_TYPES.PROGRESS:
				return <ProgressCard {...progressCardConfig} />;
			case CARD_TYPES.PIE:
				return <PieCard {...pieCardConfig} />;
			case CARD_TYPES.PROJECT:
				return <ProjectCard {...projectCardConfig} />;
		}
	}
	const intl = useIntl();
	let topLabel = intl.formatMessage({
		id: "topLabelCards",
		defaultMessage: "Top",
		description: "This text will be show on cards for top label",
	});

	let byLabel = intl.formatMessage({
		id: "byLabelCards",
		defaultMessage: "filtered By",
		description: "This text will be show on cards for top label",
	});

	let filterLabel = intl.formatMessage({
		id: "filterLabelCard",
		defaultMessage: "Filter",
		description: "This text will be show on cards for Filter label",
	});

	let projectsLabel = intl.formatMessage({
		id: "projectsLableCard",
		defaultMessage: "Project",
		description: "This text will be show on cards for Project's label",
	});

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onCompleted: (data) => {
			donorHash = mapIdToName(data.orgDonors, donorHash);
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

	let [getFinancialYearOrg, { data: financialYearOrg }] = useLazyQuery(GET_FINANCIAL_YEARS, {
		onCompleted: (data) => {
			financialYearHash = mapIdToName(data.financialYearList, financialYearHash);
		},
	});
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

	dashboardCardFilter[0].optionsArray = donors?.orgDonors || [];
	dashboardCardFilter[1].optionsArray = annualYears?.annualYearList || [];
	dashboardCardFilter[2].optionsArray = financialYearOrg?.financialYearList || [];

	return (
		<Card raised={false} className={classes.card} style={{ height: cardHeight }}>
			<CardContent>
				<Grid container>
					<Grid item container justify="space-between">
						<Grid item xs={8}>
							{title && (
								<Box mt={1} mb={1} mr={1}>
									<Typography color="primary" gutterBottom noWrap>
										{title}
									</Typography>
								</Box>
							)}
						</Grid>
						{!cardFilter?.length && (
							<Grid item xs={2}>
								<Box mt={title ? -0.75 : -1.75} mr={2} position={"absolute"}>
									{/* <Tooltip title={filterLabel}> */}
									<IconButton onClick={handleClick} size="small">
										<FilterList
											initialValues={{ ...localDonorAndFinancialYearFilter }}
											setFilterList={setLocalDonorAndFinancialYearFilter}
											inputFields={dashboardCardFilter}
										/>
									</IconButton>
									{/* </Tooltip> */}
								</Box>
							</Grid>
						)}
						{cardFilter && cardFilter.length > 0 && (
							<Grid item xs={3}>
								<Box mt={1}>
									<Tooltip title={filterLabel}>
										<IconButton onClick={handleClick} size="small">
											<FilterListIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</Box>

								<Menu
									id="simple-menu-budget-org"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleClose}
								>
									{cardFilter.map(
										(
											filter: { label: string; base: string },
											mapIndex: number
										) => {
											return (
												<MenuItem
													key={mapIndex}
													onClick={() => {
														setCurrentFilter(filter);
														handleClose();
													}}
												>
													{filter.label}
												</MenuItem>
											);
										}
									)}
								</Menu>
							</Grid>
						)}
						<Grid item xs={1}>
							{title &&
								((cardFilter && cardFilter.length > 0) ||
									props.type === CARD_TYPES.PROGRESS ||
									props.type === CARD_TYPES.DEFAULT) &&
								tooltip && (
									<Box color="text.disabled" mt={1}>
										{/* <Typography variant="caption" gutterBottom noWrap>
										{currentFilter?.label}
									</Typography> */}
										<IconButton size="small">
											<Tooltip
												title={
													props.type === CARD_TYPES.PROGRESS
														? `${tooltip}`
														: props.type === CARD_TYPES.DEFAULT
														? `${tooltip} ${
																dashboardData?.project?.name
																	? dashboardData?.project?.name
																	: projectsLabel
														  }`
														: `${tooltip} ${byLabel} ${currentFilter?.label}`
												}
											>
												<InfoOutlinedIcon fontSize="small" />
											</Tooltip>
										</IconButton>
									</Box>
								)}
						</Grid>
					</Grid>
					{renderCard()}
				</Grid>
				<Grid item md={12}>
					{children}
				</Grid>
			</CardContent>
		</Card>
	);
}
