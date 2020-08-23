import { IconButton, MenuItem, Table, Box, Typography, Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { useLazyQuery, useApolloClient, useQuery } from "@apollo/client";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/queries/budget";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
	IBudgetTargetProjectResponse,
	IGET_BUDGET_TARGET_PROJECT,
} from "../../../models/budget/query";
import React, { useState, useEffect } from "react";
import CreateBudgetTargetDialog from "../../Budget/CreateBudgetTargetDialog";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import SimpleMenu from "../../Menu/Menu";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IBudgetTargetForm } from "../../../models/budget/budgetForm";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import BudgetTrackingLineItemTable from "../BudgetTrackingLineItemTable";
import { IBudgetTrackingLineitemForm } from "../../../models/budget/budgetForm";
import { getTodaysDate } from "../../../utils";
import CreateBudgetLineitemDialog from "../../Budget/CreateBudgetLineitemDialog";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../graphql/queries";
import AmountSpent from './AmountSpent';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const StyledTableHeader = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main },
		tbody: {
			"& tr:nth-child(even) td": { background: "#F5F6FA" },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
			},
		},
	})
);

const getBudgetTrackingLineitemInitialvalues = (
	budget_targets_project: string
): IBudgetTrackingLineitemForm => {
	return {
		amount: "",
		note: "",
		budget_targets_project,
		annual_year: "",
		reporting_date: getTodaysDate(),
	};
};

function getInitialValues(
	budgetTargetsProject: IBudgetTargetProjectResponse | null
): IBudgetTargetForm {
	return {
		name: budgetTargetsProject ? budgetTargetsProject.name : "",
		description: budgetTargetsProject ? budgetTargetsProject.description : "",
		total_target_amount: budgetTargetsProject ? budgetTargetsProject.total_target_amount : "",
		id: budgetTargetsProject ? budgetTargetsProject.id : "",
		budget_category_organization: budgetTargetsProject
			? budgetTargetsProject?.budget_category_organization?.id
			: "",
		donor: budgetTargetsProject ? budgetTargetsProject?.donor?.id : "",
	};
}

const tableHeading = [
	{ label: "" },
	{ label: "S.no" },
	{ label: "Target Name" },
	{ label: "Budget Category" },
	{ label: "Donor" },
	{ label: "Total Amount" },
	{ label: "Spent" },
	{ label: "Progress %" },
	{ label: "" },
];

function BudgetTargetTable() {
	const classes = useStyles();
	const apolloClient = useApolloClient();
	const tableHeader = StyledTableHeader();
	const menuId = React.useRef("");
	const selectedTargetBudget = React.useRef<IBudgetTargetProjectResponse | null>(null);
	const dashboardData = useDashBoardData();
	const currentProject = dashboardData?.project;

	const [openTableRows, setOpenTableRows] = useState<boolean[]>([]);
	const [loadBudgetTarget] = useLazyQuery(GET_BUDGET_TARGET_PROJECT);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [openBudgetTrackingLineItem, setOpenBudgetTrackingLineItem] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const { data: orgCurrencies } = useQuery(GET_ORG_CURRENCIES_BY_ORG, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
				isHomeCurrency: true,
			},
		},
	});

	const reInitializeRef = (): void => {
		selectedTargetBudget.current = null;
		menuId.current = "";
	};

	let oldCachedBudgetTargetProjectData: IGET_BUDGET_TARGET_PROJECT | null = null;
	try {
		oldCachedBudgetTargetProjectData = apolloClient.readQuery<IGET_BUDGET_TARGET_PROJECT>({
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project: currentProject?.id,
				},
			},
		});
	} catch (error) {}

	React.useEffect(() => {
		if (!oldCachedBudgetTargetProjectData) {
			loadBudgetTarget({
				variables: {
					filter: {
						project: currentProject?.id,
					},
				},
			});
		}
	}, [oldCachedBudgetTargetProjectData, currentProject, loadBudgetTarget]);

	React.useEffect(() => {
		if (oldCachedBudgetTargetProjectData) {
			let arr = oldCachedBudgetTargetProjectData.projectBudgetTargets.map(() => false);
			setOpenTableRows(arr);
		}
	}, [oldCachedBudgetTargetProjectData]);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const menuList = [
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenDialog(true);
						handleClose();
					}}
				>
					Edit Budget Target
				</MenuItem>
			),
		},
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenBudgetTrackingLineItem(true);
						handleClose();
					}}
				>
					Report Expenditure
				</MenuItem>
			),
		},
	];

	return (
		<TableContainer component={Paper}>
			<CreateBudgetTargetDialog
				open={openDialog}
				handleClose={() => {
					setOpenDialog(false);
					reInitializeRef();
				}}
				formAction={FORM_ACTIONS.UPDATE}
				initialValues={getInitialValues(selectedTargetBudget.current)}
			/>
			<CreateBudgetLineitemDialog
				open={openBudgetTrackingLineItem}
				handleClose={() => {
					setOpenBudgetTrackingLineItem(false);
					reInitializeRef();
				}}
				formAction={FORM_ACTIONS.CREATE}
				initialValues={getBudgetTrackingLineitemInitialvalues(
					selectedTargetBudget.current ? selectedTargetBudget.current.id : ""
				)}
			/>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{tableHeading.map((heading: { label: string }, index: number) => (
							<TableCell className={tableHeader.th} key={index} align="left">
								{heading.label == "Total Amount"
									? `Total Amount (${
											orgCurrencies?.orgCurrencies[0].currency.code
												? orgCurrencies?.orgCurrencies[0].currency.code
												: ""
									  })`
									: heading.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{/* {wirte here loading} */}
					{oldCachedBudgetTargetProjectData
						? oldCachedBudgetTargetProjectData.projectBudgetTargets.map(
								(
									budgetTargetsProject: IBudgetTargetProjectResponse,
									index: number
								) => (
									<>
										<TableRow key={budgetTargetsProject.id}>
											<TableCell>
												<IconButton
													aria-label="expand row"
													size="small"
													onClick={() =>
														setOpenTableRows(
															(
																openTableRowsArr: boolean[]
															): boolean[] => {
																openTableRowsArr[
																	index
																] = !openTableRowsArr[index];
																return [...openTableRowsArr];
															}
														)
													}
												>
													{openTableRows[index] ? (
														<KeyboardArrowUpIcon />
													) : (
														<KeyboardArrowDownIcon />
													)}
												</IconButton>
											</TableCell>
											<TableCell component="td" scope="row">
												{index + 1}
											</TableCell>
											<TableCell align="left">
												{budgetTargetsProject.name}
											</TableCell>
											<TableCell align="left">
												{
													budgetTargetsProject
														?.budget_category_organization?.name
												}
											</TableCell>
											<TableCell align="left">
												{budgetTargetsProject?.donor?.name}
											</TableCell>
											<TableCell align="left">
												{budgetTargetsProject.total_target_amount}
											</TableCell>
											<TableCell align="left">
												<AmountSpent
													budgetTargetId={budgetTargetsProject.id}
												>
													{(amount: number) => {
														return <span>{amount}</span>;
													}}
												</AmountSpent>
											</TableCell>
											<TableCell align="left">
												<AmountSpent
													budgetTargetId={budgetTargetsProject.id}
												>
													{(amount: number) => {
														return (
															<span>
																{(
																	(amount * 100) /
																	parseInt(
																		budgetTargetsProject.total_target_amount
																	)
																).toFixed(2)}
															</span>
														);
													}}
												</AmountSpent>
											</TableCell>
											<TableCell>
												<IconButton
													aria-haspopup="true"
													onClick={(
														event: React.MouseEvent<HTMLButtonElement>
													) => {
														menuId.current = budgetTargetsProject.id;
														selectedTargetBudget.current = budgetTargetsProject;
														handleClick(event);
													}}
												>
													<MoreVertIcon />
												</IconButton>
												<SimpleMenu
													handleClose={handleClose}
													id={`organizationMenu-${budgetTargetsProject.id}`}
													anchorEl={
														menuId.current == budgetTargetsProject.id
															? anchorEl
															: null
													}
													menuList={menuList}
												/>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell
												style={{ paddingBottom: 0, paddingTop: 0 }}
												colSpan={9}
											>
												<Collapse
													in={openTableRows[index]}
													timeout="auto"
													unmountOnExit
												>
													<Box m={1}>
														<Grid container>
															<Grid xs={12}>
																<Box m={1}>
																	<Typography
																		align="left"
																		variant="subtitle1"
																		style={{
																			fontSize: "0.8rem",
																		}}
																		variantMapping={{
																			subtitle1: "h1",
																		}}
																	>
																		{
																			budgetTargetsProject.description
																		}
																	</Typography>
																</Box>
															</Grid>
														</Grid>
														<BudgetTrackingLineItemTable
															budgetTargetId={budgetTargetsProject.id}
															currency={
																orgCurrencies?.orgCurrencies[0]
																	.currency.code
															}
														/>
													</Box>
												</Collapse>
											</TableCell>
										</TableRow>
									</>
								)
						  )
						: null}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default React.memo(BudgetTargetTable);
