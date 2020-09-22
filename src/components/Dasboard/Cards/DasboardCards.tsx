import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@material-ui/core";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import CommonProgres from "../../OrganizationDashboard/Cards/CommonProgress";
import MoreButton from "../../OrganizationDashboard/Cards/MoreIconButton";
import ProgressDialog from "../../OrganizationDashboard/Cards/ProgressDialog";
import { PieChart } from "../../Charts";
import { CARD_TYPES } from "./constants";
import BorderLinearProgress from "../../BorderLinearProgress";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import { CardProps } from "../../../models/cards/cards";

/*static value*/
const budgetProjects = [
	{ name: "Wash Awarness ", completed: 90, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Covid 19 supply", completed: 80, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Budget Project ", completed: 70, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 4", completed: 60, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 5", completed: 50, lastUpdated: "2017-12-03T10:15:30.000Z" },
];

export default function DashboardCard(props: CardProps) {
	const theme = useTheme();
	/*Static pieData*/

	let cardFilter: any,
		moreButtonLink,
		projectCardTitle,
		projectCardFirstBarHeading,
		projectCardSecondBarHeading;
	const { title, children, cardHeight = "24vh" } = props;

	if (props.type === CARD_TYPES.PROJECT) {
		projectCardTitle = props.projectCardTitle;
		projectCardFirstBarHeading = props.projectCardFirstBarHeading;
		projectCardSecondBarHeading = props.projectCardSecondBarHeading;
	}

	if (props.type === CARD_TYPES.PIE) {
		cardFilter = props.cardFilter;
		moreButtonLink = props.moreButtonLink;
	}

	if (props.type === CARD_TYPES.PROGRESS) {
		cardFilter = props.cardFilter;
	}
	let pieData = {
		datasets: [
			{
				backgroundColor: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.grey[200],
				],
				data: [500, 200, 300],
			},
		],
	};
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
	const [currentFilter, setCurrentFilter] = useState<any>();

	/*setting first filter as default filter*/
	useEffect(() => {
		if (cardFilter && cardFilter.length) {
			setCurrentFilter(cardFilter[0]);
		}
	}, []);

	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [progressDialogOpen, setProgressDialogOpen] = React.useState(false);
	return (
		<Card raised={false} className={classes.card} style={{ height: cardHeight }}>
			<CardContent>
				<Grid container>
					<Grid item md={12} container justify="space-between">
						{title && (
							<Box mt={1} mb={1}>
								<Typography color="primary" gutterBottom>
									{title}
								</Typography>
							</Box>
						)}
						{cardFilter && cardFilter.length > 0 && (
							<>
								<IconButton onClick={handleClick}>
									<FilterListIcon fontSize="small" />
								</IconButton>

								<Menu
									id="simple-menu-budget-org"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleClose}
								>
									{cardFilter.map(
										(
											filter: { label: string; filter: object },
											mapIndex: number
										) => {
											return (
												<MenuItem
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
							</>
						)}
					</Grid>
					{props.type === CARD_TYPES.PROGRESS && (
						<>
							<Grid item md={12}>
								<Box mt={1}>
									{budgetProjects &&
										budgetProjects.slice(0, 3).map((budgetProject, index) => {
											return (
												<CommonProgres
													title={budgetProject.name}
													date={budgetProject.lastUpdated}
													percentage={budgetProject.completed}
													size="md"
												/>
											);
										})}
								</Box>
							</Grid>
							<Grid item md={12} justify="flex-end" container>
								<MoreButton handleClick={() => setProgressDialogOpen(true)} />
							</Grid>
							{progressDialogOpen && (
								<ProgressDialog
									open={progressDialogOpen}
									onClose={() => setProgressDialogOpen(false)}
									title={title ? title : " "}
								>
									{budgetProjects &&
										budgetProjects.map((budgetProject, index) => {
											return (
												<Box m={1}>
													<CommonProgres
														title={budgetProject.name}
														date={budgetProject.lastUpdated}
														percentage={budgetProject.completed}
														size="lg"
													/>
												</Box>
											);
										})}
								</ProgressDialog>
							)}
						</>
					)}
					{props.type === CARD_TYPES.PIE && (
						<>
							<Grid item md={12}>
								<Box p={1}>
									<PieChart data={pieData} />
								</Box>
							</Grid>
							<Grid item md={12} justify="flex-end" container>
								{moreButtonLink && <MoreButton link={moreButtonLink} />}
							</Grid>
						</>
					)}
					{props.type === CARD_TYPES.PROJECT && (
						<>
							<Grid item md={5} justify="center">
								<Box ml={1}>
									<Box mt={2} ml={3}>
										<Typography variant="h6">2.4Cr</Typography>
									</Box>
									{projectCardTitle && (
										<Typography variant="subtitle1">
											{projectCardTitle}
										</Typography>
									)}
								</Box>
							</Grid>
							<Grid item md={7}>
								<Box ml={1} mt={2} display="flex">
									<AssignmentTurnedInIcon color="secondary" />
									<Box ml={1}>
										<Typography variant="body1" noWrap>
											{" "}
											6 / 12 Project
										</Typography>
									</Box>
								</Box>
								{/* <BorderLinearProgress variant="determinate" value={60} /> */}
								<Box ml={1} mt={2}>
									{projectCardFirstBarHeading && (
										<Typography variant="caption">
											{" "}
											{projectCardFirstBarHeading}
										</Typography>
									)}
								</Box>
								<BorderLinearProgress
									variant="determinate"
									value={50}
									color={"primary"}
								/>
							</Grid>

							<Grid item md={12}>
								<Box ml={1} mt={2}>
									{projectCardSecondBarHeading && (
										<Typography variant="caption">
											{projectCardSecondBarHeading}
										</Typography>
									)}
								</Box>
								<BorderLinearProgress
									variant="determinate"
									value={50}
									color={"secondary"}
								/>
							</Grid>
						</>
					)}
				</Grid>
				<Grid item md={12}>
					{children}
				</Grid>
			</CardContent>
		</Card>
	);
}
