import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles({
	table: {
		width: "100%",
	},
	tableContainer: {
		height: "47vh",
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

function Row(props: { row: { collaspeTable: any; column: any[] }; index: number }) {
	const { row, index } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow key={index}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="td" scope="row">
					{index + 1}
				</TableCell>
				{row.column.map((col) => {
					return <TableCell align="left">{col}</TableCell>;
				})}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>{row.collaspeTable && row.collaspeTable}</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function CollapsibleTable({
	tableHeading,
	rows,
}: {
	tableHeading: { label: string }[];
	rows: { collaspeTable: any; column: any[] }[];
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	return (
		<TableContainer component={Paper} className={classes.tableContainer}>
			{!rows.length ? (
				<Box mt={5} display="flex" justifyContent="center">
					{" "}
					<Typography variant="h5" gutterBottom color="textSecondary">
						No targets Found :(
					</Typography>
				</Box>
			) : (
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow color="primary">
							{rows &&
								rows.length > 0 &&
								tableHeading.map((heading) => (
									<TableCell
										key={heading.label}
										align="left"
										className={tableHeader.th}
									>
										{heading.label}
									</TableCell>
								))}
						</TableRow>
					</TableHead>
					<TableBody className={tableHeader.tbody}>
						{rows.map((row, index) => (
							<Row key={index} index={index} row={row} />
						))}
					</TableBody>
				</Table>
			)}
		</TableContainer>
	);
}
