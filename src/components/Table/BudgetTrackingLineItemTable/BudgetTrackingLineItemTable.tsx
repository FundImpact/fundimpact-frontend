import React, { useState, useEffect } from "react";
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	IconButton,
	MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../Menu/Menu";
import CreateBudgetLineitemDialog from "../../Budget/CreateBudgetLineitemDialog";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import { getTodaysDate } from "../../../utils";
import { IBudgetTrackingLineitem } from "../../../models/budget/budget";
import {
	IBUDGET_TRACKING_LINE_ITEM_RESPONSE,
	IGET_BUDGET_TARCKING_LINE_ITEM,
} from "../../../models/budget/query";
import { GET_PROJECT_BUDGET_TARCKING } from "../../../graphql/queries/budget/query";
import { useLazyQuery, useApolloClient } from "@apollo/client";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

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

const tableHeading = [
	{ label: "S.no" },
	{ label: "Date" },
	{ label: "Note" },
	{ label: "Amount" },
	{ label: "Tags" },
	{ label: "" },
];

const getInitialValues = (
	budgetTrackingLineItem: IBUDGET_TRACKING_LINE_ITEM_RESPONSE | null
): IBudgetTrackingLineitem => {
	return {
		amount: budgetTrackingLineItem ? budgetTrackingLineItem.amount : 0,
		note: budgetTrackingLineItem ? budgetTrackingLineItem.note : "",
		budget_targets_project: budgetTrackingLineItem
			? budgetTrackingLineItem.budget_targets_project.id
			: "",
		annual_year: budgetTrackingLineItem ? budgetTrackingLineItem.annual_year.id : "",
		reporting_date: getTodaysDate(
			budgetTrackingLineItem ? budgetTrackingLineItem.reporting_date : undefined
		),
		id: budgetTrackingLineItem ? budgetTrackingLineItem.id : "",
	};
};

function BudgetTrackingLineItemTable({
	currency,
	budgetTargetId,
}: {
	currency: string;
	budgetTargetId: string;
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	const selectedBudgetTrackingLineItem = React.useRef<IBUDGET_TRACKING_LINE_ITEM_RESPONSE | null>(
		null
	);
	const menuId = React.useRef("");
	const apolloClient = useApolloClient();

	const [openDialog, setOpenDialog] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [getProjectBudgetTrackingData, { data, called }] = useLazyQuery(
		GET_PROJECT_BUDGET_TARCKING
	);

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

	let oldCachedProjectBudgetTrackingData: IGET_BUDGET_TARCKING_LINE_ITEM | null = null;
	try {
		oldCachedProjectBudgetTrackingData = apolloClient.readQuery<IGET_BUDGET_TARCKING_LINE_ITEM>(
			{
				query: GET_PROJECT_BUDGET_TARCKING,
				variables: {
					filter: {
						budget_targets_project: budgetTargetId,
					},
				},
			}
		);
	} catch (error) {}

	useEffect(() => {
		if (!oldCachedProjectBudgetTrackingData) {
			getProjectBudgetTrackingData({
				variables: {
					filter: {
						budget_targets_project: budgetTargetId,
					},
				},
			});
		}
	}, [oldCachedProjectBudgetTrackingData, budgetTargetId, getProjectBudgetTrackingData]);

	return (
		<TableContainer component={Paper}>
			<CreateBudgetLineitemDialog
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
						{oldCachedProjectBudgetTrackingData?.projBudgetTrackings?.length
							? tableHeading.map((heading: { label: string }, index: number) => (
									<TableCell className={tableHeader.th} key={index} align="left">
										{heading.label == "Amount"
											? `Amount (${currency})`
											: heading.label}
									</TableCell>
							  ))
							: null}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{oldCachedProjectBudgetTrackingData &&
						oldCachedProjectBudgetTrackingData.projBudgetTrackings.map(
							(
								budgetTrackingLineItem: IBUDGET_TRACKING_LINE_ITEM_RESPONSE,
								index: number
							) => (
								<TableRow key={budgetTrackingLineItem.id}>
									<TableCell component="td" scope="row">
										{index + 1}
									</TableCell>
									<TableCell align="left">
										{getTodaysDate(budgetTrackingLineItem.reporting_date)}
									</TableCell>
									<TableCell align="left">
										{budgetTrackingLineItem.note}
									</TableCell>
									<TableCell align="left">
										{budgetTrackingLineItem.amount}
									</TableCell>
									<TableCell align="left"></TableCell>

									<TableCell>
										<IconButton
											aria-haspopup="true"
											onClick={(
												event: React.MouseEvent<HTMLButtonElement>
											) => {
												menuId.current = budgetTrackingLineItem.id;
												selectedBudgetTrackingLineItem.current = budgetTrackingLineItem;
												handleClick(event);
											}}
										>
											<MoreVertIcon />
										</IconButton>
										<SimpleMenu
											handleClose={handleClose}
											id={`organizationMenu-${budgetTrackingLineItem.id}`}
											anchorEl={
												menuId.current == budgetTrackingLineItem.id
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
			</Table>
		</TableContainer>
	);
}

export default React.memo(BudgetTrackingLineItemTable);
