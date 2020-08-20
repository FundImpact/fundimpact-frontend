import React from "react";
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { getTodaysDate } from "../../../utils/index";

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

const tableHeading = [
	{ label: "S.no" },
	{ label: "Amount" },
	{ label: "Organization Currency" },
	{ label: "Financial Year Org" },
	{ label: "Financial Year Donor" },
	{ label: "Annual year" },
	{ label: "Conversion Factor" },
	{ label: "Reporting Date" },
	{ label: "Donor" },
];

function BudgetTrackingLineItemTable({
	budgetTrackingLineItems,
}: {
	budgetTrackingLineItems: any;
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{tableHeading.map((heading) => (
							<TableCell key={heading.label} align="left">
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
							<TableCell align="left">{budgetTrackingLineItem.amount}</TableCell>
							<TableCell align="left">
								{budgetTrackingLineItem.organization_currency.currency.name}
							</TableCell>
							<TableCell align="left">
								{budgetTrackingLineItem.financial_years_org.name}
							</TableCell>
							<TableCell align="left">
								{budgetTrackingLineItem.financial_years_donor.name}
							</TableCell>
							<TableCell align="left">
								{budgetTrackingLineItem.annual_year.name}
							</TableCell>
							<TableCell align="left">
								{budgetTrackingLineItem.conversion_factor}
							</TableCell>
							<TableCell align="left">
								{getTodaysDate(budgetTrackingLineItem.reporting_date)}
							</TableCell>
							<TableCell align="left">{budgetTrackingLineItem.donor.name}</TableCell>
							{/* <TableCell>
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
										</TableCell> */}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default BudgetTrackingLineItemTable;
