import { Box, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React from "react";
import { FormattedMessage } from "react-intl";

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

function Row(props: {
	row: { collaspeTable: React.ReactNode; column: React.ReactNode[] };
	index: number;
}) {
	const { row, index } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow key={index}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
						data-testid={`collaspeButton${index}`}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{row.column.map((col) => {
					return col;
				})}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>{row.collaspeTable}</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function CollapsibleTable({
	tableHeading,
	rows,
	pagination,
}: {
	tableHeading: { label: string }[];
	rows: { collaspeTable: React.ReactNode; column: React.ReactNode[] }[];
	pagination?: React.ReactNode;
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	return (
		<TableContainer component={Paper} className={classes.tableContainer}>
			{!rows.length ? (
				<Box mt={5} display="flex" justifyContent="center">
					{" "}
					<Typography variant="h5" gutterBottom color="textSecondary">
						<FormattedMessage
							id={`noTargetFound`}
							defaultMessage={`No Target Found`}
							description={`This text will be shown if no target found for table`}
						/>
					</Typography>
				</Box>
			) : (
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow key={1} color="primary">
							{rows &&
								rows.length > 0 &&
								tableHeading.map((heading, index) => (
									<TableCell
										key={heading.label + index}
										align="left"
										className={tableHeader.th}
									>
										{heading.label}
										{/* <FormattedMessage
											id={`${heading.label
												.toString()
												.replace(/ /g, "")
												.toLowerCase()}`}
											defaultMessage={`${heading.label}`}
											description={`This text will be shown on table for ${heading.label} heading`}
										/> */}
									</TableCell>
								))}
						</TableRow>
					</TableHead>
					<TableBody className={tableHeader.tbody}>
						{rows.map((row, index) => (
							<Row key={index} index={index} row={row} />
						))}
					</TableBody>
					<TableFooter>
						<TableRow key={1}>{rows.length > 0 && pagination}</TableRow>
					</TableFooter>
				</Table>
			)}
		</TableContainer>
	);
}
