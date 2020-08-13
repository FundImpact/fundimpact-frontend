import { IconButton, Menu, MenuItem, Table } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { useQuery } from "@apollo/client";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/queries/budget";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IBudgetTargetProjectResponse } from "../../../models/budget/query";
import React from "react";

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
	{ label: "Organization Currency" },
	{ label: "Project" },
	{ label: "Name" },
	{ label: "Description" },
	{ label: "Total Target Amount" },
	{ label: "Conversion Factor" },
];

export default function BudgetTargetTable() {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	console.log(`table header`, tableHeader);
	const { data, loading, error } = useQuery(GET_BUDGET_TARGET_PROJECT);
	console.log("data :>> ", data);
	return (
		<TableContainer component={Paper}>
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
					{data
						? data.budgetTargetsProjects.map(
								(
									budgetTargetsProject: IBudgetTargetProjectResponse,
									index: number
								) => (
									<TableRow key={budgetTargetsProject.id}>
										<TableCell component="td" scope="row">
											{index + 1}
										</TableCell>
										<TableCell align="left">
											{
												budgetTargetsProject?.organization_currency
													?.currency?.name
											}
										</TableCell>
										<TableCell align="left">
											{budgetTargetsProject.project?.name}
										</TableCell>
										<TableCell align="left">
											{budgetTargetsProject.name}
										</TableCell>
										<TableCell align="left">
											{budgetTargetsProject.description}
										</TableCell>
										<TableCell align="left">
											{budgetTargetsProject.total_target_amount}
										</TableCell>
										<TableCell align="left">
											{budgetTargetsProject.conversion_factor}
										</TableCell>
										<TableCell>
											<IconButton aria-label="delete">
												<MoreVertIcon />
											</IconButton>
											<Menu open={false} id="simple-menu" keepMounted>
												<MenuItem>Profile</MenuItem>
												<MenuItem>My account</MenuItem>
												<MenuItem>Logout</MenuItem>
											</Menu>
										</TableCell>
									</TableRow>
								)
						  )
						: null}
				</TableBody>
			</Table>
		</TableContainer>
	);
}