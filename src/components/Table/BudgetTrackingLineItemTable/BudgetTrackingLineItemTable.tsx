import React, { useState, useRef } from "react";
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
import CreateBudgetTrackingLineitemDialog from "../../Budget/CreateBudgetTrackingLineitemDialog";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import { getTodaysDate } from "../../../utils";
import { IBudgetTrackingLineitemForm } from "../../../models/budget/budgetForm";

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
	{ label: "Donor name" },
	{ label: "Tags" },
];

const getInitialValues = (budgetTrackingLineItem: any): IBudgetTrackingLineitemForm => {
	return {
		amount: budgetTrackingLineItem ? budgetTrackingLineItem.amount : "",
		note: budgetTrackingLineItem ? budgetTrackingLineItem.note : "",
		conversion_factor: budgetTrackingLineItem ? budgetTrackingLineItem.conversion_factor : "",
		budget_targets_project: budgetTrackingLineItem
			? budgetTrackingLineItem.budget_targets_project.id
			: "",
		annual_year: budgetTrackingLineItem ? budgetTrackingLineItem.annual_year.id : "",
		financial_years_org: budgetTrackingLineItem
			? budgetTrackingLineItem.financial_years_org.id
			: "",
		financial_years_donor: budgetTrackingLineItem
			? budgetTrackingLineItem.financial_years_donor.id
			: "",
		grant_periods_project: budgetTrackingLineItem
			? budgetTrackingLineItem.grant_periods_project.id
			: "",
		organization_currency: budgetTrackingLineItem
			? budgetTrackingLineItem.organization_currency.id
			: "",
		donor: budgetTrackingLineItem ? budgetTrackingLineItem.donor.id : "",
		reporting_date: getTodaysDate(
			budgetTrackingLineItem ? budgetTrackingLineItem.reporting_date : null
		),
		id: budgetTrackingLineItem ? budgetTrackingLineItem.id : "",
	};
};

function BudgetTrackingLineItemTable({
	budgetTrackingLineItems,
}: {
	budgetTrackingLineItems: any;
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const selectedBudgetTrackingLineItem = React.useRef<any>(null);
	const menuId = React.useRef("");

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

	return (
		<TableContainer component={Paper}>
			<CreateBudgetTrackingLineitemDialog
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
						{tableHeading.map((heading) => (
							<TableCell className={tableHeader.th} key={heading.label} align="left">
								{heading.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{/* {wirte here loading} */}
					{budgetTrackingLineItems.map((budgetTrackingLineItem: any, index: number) => (
						<TableRow key={budgetTrackingLineItem.id}>
							<TableCell component="td" scope="row">
								{index + 1}
							</TableCell>
							<TableCell align="left">
								{getTodaysDate(budgetTrackingLineItem.reporting_date)}
							</TableCell>
							<TableCell align="left">{budgetTrackingLineItem.note}</TableCell>
							<TableCell align="left">{budgetTrackingLineItem.amount}</TableCell>
							<TableCell align="left">{budgetTrackingLineItem.donor.name}</TableCell>
							<TableCell align="left"></TableCell>

							<TableCell>
								<IconButton
									aria-haspopup="true"
									onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
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
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default BudgetTrackingLineItemTable;
