import { IconButton, Menu, MenuItem, Table } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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

function createRow(
	col1: string,
	col2: string,
	col3: string,
	col4: string,
	col5: string,
	col6: string
) {
	return { col1, col2, col3, col4, col5, col6 };
}

const rows = [
	createRow("[ + ] Pamphlets for Training 1", "Collaterals", "Print", "10K", "0", "0"),
	createRow("[ + ] Pamphlets for Training 2", "Collaterals", "Print", "10K", "0", "0"),
	createRow("[ + ] Pamphlets for Training 3", "Collaterals", "Print", "10K", "0", "0"),
	createRow("[ + ] Pamphlets for Training 4", "Collaterals", "Print", "10K", "0", "0"),
	createRow("[ + ] Pamphlets for Training 5", "Collaterals", "Print", "10K", "0", "0"),
];

const tableHeading = [
	{ label: "S.no" },
	{ label: "Deliverables" },
	{ label: "Head" },
	{ label: "Sub Head" },
	{ label: "Budget" },
	{ label: "Spent" },
	{ label: "%" },
	{ label: "" },
];

export default function DeliverablesTable() {
	// let tt: TableCellProps;
	// tt.
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	console.log(`table header`, tableHeader);

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
						{/* <TableCell>Dessert (100g serving)</TableCell>
						<TableCell align="left">col2</TableCell>
						<TableCell align="left">col3&nbsp;(g)</TableCell>
						<TableCell align="left">col4&nbsp;(g)</TableCell>
						<TableCell align="left">col5&nbsp;(g)</TableCell> */}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{rows.map((row, index) => (
						<TableRow key={index}>
							<TableCell component="td" scope="row">
								{index + 1}
							</TableCell>
							<TableCell align="left">{row.col1}</TableCell>
							<TableCell align="left">{row.col2}</TableCell>
							<TableCell align="left">{row.col3}</TableCell>
							<TableCell align="left">{row.col4}</TableCell>
							<TableCell align="left">{row.col5}</TableCell>
							<TableCell align="left">{row.col6}</TableCell>
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
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
