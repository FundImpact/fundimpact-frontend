import React, { useState } from "react";
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	IconButton,
	MenuItem,
	TableFooter,
	TablePagination,
	Typography,
	Box,
	Chip,
	Avatar,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../../Menu";
import BudgetLineitem from "../../../Budget/BudgetLineitem";
import { FORM_ACTIONS } from "../../../../models/budget/constants";
import { getTodaysDate } from "../../../../utils";
import { IBudgetTrackingLineitem } from "../../../../models/budget";
import { IBUDGET_LINE_ITEM_RESPONSE } from "../../../../models/budget/query";
import {
	GET_PROJECT_BUDGET_TARCKING,
	GET_PROJ_BUDGET_TRACINGS_COUNT,
} from "../../../../graphql/Budget";
import pagination from "../../../../hooks/pagination";
import TableSkeleton from "../../../Skeletons/TableSkeleton";
import { budgetLineItemTableHeading as tableHeading } from "../../constants";

const useStyles = makeStyles((theme: Theme) => ({
	table: {
		minWidth: 650,
	},
	chipColor: {
		backgroundColor: theme.palette.grey[500],
		color: theme.palette.background.paper,
	},
	avatarColor: {
		backgroundColor: theme.palette.grey[600],
		color: theme.palette.background.paper,
	},
}));

const StyledTableHeader = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
		tbody: {
			"& tr:nth-child(even) td": { background: "#F5F6FA" },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
				fontSize: "13px",
			},
		},
	})
);

//The value of the year tags is the way to retrieve value from budgetLineItem and keyName is the name
//that we want to display in the chip
const yearTags = {
	FYO: "fy_org,name",
	FYD: "fy_donor,name",
	AY: "annual_year,name",
};

function getValue(obj: any, key: string[]): any {
	if (!obj?.hasOwnProperty(key[0])) {
		return "";
	}
	if (key.length == 1) {
		return obj[key[0]];
	}
	return getValue(obj[key[0]], key.slice(1));
}

const getInitialValues = (
	budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE | null
): IBudgetTrackingLineitem => {
	return {
		amount: budgetLineItem?.amount || 0,
		note: budgetLineItem?.note || "",
		budget_targets_project: budgetLineItem?.budget_targets_project?.id || "",
		annual_year: budgetLineItem?.annual_year?.id || "",
		reporting_date: getTodaysDate(budgetLineItem?.reporting_date || undefined),
		id: budgetLineItem?.id || "",
		grant_periods_project: budgetLineItem?.grant_periods_project?.id || "",
		fy_org: budgetLineItem?.fy_org?.id || "",
		fy_donor: budgetLineItem?.fy_donor?.id || "",
	};
};

function BudgetLineItemTable({
	currency,
	budgetTargetId,
}: {
	currency: string;
	budgetTargetId: string;
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	const selectedBudgetTrackingLineItem = React.useRef<IBUDGET_LINE_ITEM_RESPONSE | null>(null);
	const menuId = React.useRef("");

	const [openDialog, setOpenDialog] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [page, setPage] = React.useState(0);

	let {
		count,
		queryData: budgetLineitemData,
		changePage,
		countQueryLoading,
		queryLoading,
	} = pagination({
		query: GET_PROJECT_BUDGET_TARCKING,
		countQuery: GET_PROJ_BUDGET_TRACINGS_COUNT,
		countFilter: {
			budget_targets_project: budgetTargetId,
		},
		queryFilter: {
			budget_targets_project: budgetTargetId,
		},
		sort: "created_at:DESC",
	});

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
					Edit Budget Target Line Item
				</MenuItem>
			),
		},
	];

	if (countQueryLoading || queryLoading) {
		return <TableSkeleton lines={3} />;
	}

	return (
		<>
			{budgetLineitemData && budgetLineitemData?.projBudgetTrackings?.length === 0 && (
				<Box>
					<Typography align="center">No Budget Line Item Available</Typography>
				</Box>
			)}
			<TableContainer component={Paper}>
				<BudgetLineitem
					open={openDialog}
					handleClose={() => {
						setOpenDialog(false);
						selectedBudgetTrackingLineItem.current = null;
						menuId.current = "";
					}}
					formAction={FORM_ACTIONS.UPDATE}
					initialValues={getInitialValues(selectedBudgetTrackingLineItem.current)}
				/>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow color="primary">
							{budgetLineitemData?.projBudgetTrackings?.length
								? tableHeading.map((heading: { label: string }, index: number) => (
										<TableCell
											className={tableHeader.th}
											key={index}
											align="left"
										>
											{heading.label === "Amount"
												? `Amount ${currency ? "(" + currency + ")" : ""}`
												: heading.label}
										</TableCell>
								  ))
								: null}
						</TableRow>
					</TableHead>
					<TableBody className={tableHeader.tbody}>
						{budgetLineitemData &&
							budgetLineitemData.projBudgetTrackings.map(
								(budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE, index: number) => (
									<TableRow key={budgetLineItem.id}>
										<TableCell component="td" scope="row">
											{page * 10 + index + 1}
										</TableCell>

										<TableCell align="left">
											{getTodaysDate(budgetLineItem.reporting_date, true)}
										</TableCell>
										<TableCell align="left">{budgetLineItem.note}</TableCell>
										<TableCell align="left">{budgetLineItem.amount}</TableCell>
										<TableCell align="left">
											{budgetLineItem?.grant_periods_project?.name}
										</TableCell>

										<TableCell align="left">
											<Box display="flex">
												{Object.entries(yearTags).map(
													([objKey, objVal], arrIndex) => {
														return (
															getValue(
																budgetLineItem,
																objVal.split(",")
															) && (
																<Box mr={1} key={arrIndex}>
																	<Chip
																		classes={{
																			avatar:
																				classes.avatarColor,
																			root: classes.chipColor,
																		}}
																		avatar={
																			<Avatar>
																				<span
																					className={
																						classes.avatarColor
																					}
																				>
																					{objKey}
																				</span>
																			</Avatar>
																		}
																		label={getValue(
																			budgetLineItem,
																			objVal.split(",")
																		)}
																		size="small"
																	/>
																</Box>
															)
														);
													}
												)}
											</Box>
										</TableCell>

										<TableCell>
											<IconButton
												aria-haspopup="true"
												onClick={(
													event: React.MouseEvent<HTMLButtonElement>
												) => {
													menuId.current = budgetLineItem.id;
													selectedBudgetTrackingLineItem.current = budgetLineItem;
													handleClick(event);
												}}
											>
												<MoreVertIcon />
											</IconButton>
											<SimpleMenu
												handleClose={handleClose}
												id={`organizationMenu-${budgetLineItem.id}`}
												anchorEl={
													menuId.current === budgetLineItem.id
														? anchorEl
														: null
												}
												menuList={menuList}
											/>
										</TableCell>
									</TableRow>
								)
							)}
					</TableBody>
					{budgetLineitemData?.projBudgetTrackings?.length ? (
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[]}
									colSpan={8}
									count={count}
									rowsPerPage={count > 10 ? 10 : count}
									page={page}
									SelectProps={{
										inputProps: { "aria-label": "rows per page" },
										native: true,
									}}
									onChangePage={(
										event: React.MouseEvent<HTMLButtonElement> | null,
										newPage: number
									) => {
										if (newPage > page) {
											changePage();
										} else {
											changePage(true);
										}
										setPage(newPage);
									}}
									onChangeRowsPerPage={() => {}}
								/>
							</TableRow>
						</TableFooter>
					) : null}
				</Table>
			</TableContainer>
		</>
	);
}

export default React.memo(BudgetLineItemTable);
