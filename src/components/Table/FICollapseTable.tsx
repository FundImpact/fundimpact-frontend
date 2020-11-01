import { Box, Typography, TableSortLabel } from "@material-ui/core";
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
import { ITableHeadings } from "../../models";

const useStyles = makeStyles({
	table: {
		width: "100%",
	},
	tableContainer: {},
});

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, backgroundColor: theme.palette.background.paper },
		tbody: {
			"& tr:nth-child(4n+1)": { background: theme.palette.action.hover },
			"& tr:nth-child(even)": { background: theme.palette.action.selected },
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
	showNestedTable?: boolean;
}) {
	const { row, index, showNestedTable = true } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow key={index}>
				{showNestedTable && (
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
				)}
				{row.column.map((col) => {
					return col;
				})}
			</TableRow>
			{showNestedTable && (
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box margin={1}>{row.collaspeTable}</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</React.Fragment>
	);
}

export default function CollapsibleTable({
	tableHeading,
	rows,
	pagination,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	showNestedTable = true,
}: {
	tableHeading: ITableHeadings[];
	rows: { collaspeTable: React.ReactNode; column: React.ReactNode[] }[];
	pagination?: React.ReactNode;
	order?: "asc" | "desc";
	setOrder?: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy?: string;
	setOrderBy?: React.Dispatch<React.SetStateAction<string>>;
	showNestedTable?: boolean;
}) {
	const classes = useStyles();
	const tableStyles = styledTable();
	if (!rows.length) {
		return (
			<Box m={2} display="flex" justifyContent="center">
				{" "}
				<Typography variant="subtitle1" gutterBottom color="textSecondary">
					<FormattedMessage
						id={`nodataFound`}
						defaultMessage={`No Data Found`}
						description={`This text will be shown if no data found for table`}
					/>
				</Typography>
			</Box>
		);
	}
	return (
		<TableContainer component={Paper} className={classes.tableContainer}>
			{rows.length && (
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow key={1} color="primary">
							{rows &&
								rows.length > 0 &&
								tableHeading.map((heading, index) => (
									<TableCell
										key={heading.label + index}
										align="left"
										className={tableStyles.th}
									>
										{heading.renderComponent ? (
											heading.renderComponent()
										) : (
											<>
												{heading.label && (
													<FormattedMessage
														id={
															"tableHeading" +
															heading.label.replace(/ /g, "")
														}
														defaultMessage={`${heading.label}`}
														description={`This text will be shown on table for ${heading.label} heading`}
													/>
												)}
												{order && heading.keyMapping && (
													<TableSortLabel
														active={orderBy === heading.keyMapping}
														onClick={() => {
															if (orderBy === heading.keyMapping) {
																setOrder &&
																	setOrder(
																		order === "asc"
																			? "desc"
																			: "asc"
																	);
															} else {
																setOrderBy &&
																	setOrderBy(
																		heading.keyMapping || ""
																	);
															}
														}}
														direction={order}
													></TableSortLabel>
												)}
											</>
										)}
									</TableCell>
								))}
						</TableRow>
					</TableHead>
					<TableBody className={tableStyles.tbody}>
						{rows.map((row, index) => (
							<Row
								key={index}
								index={index}
								row={row}
								showNestedTable={showNestedTable}
							/>
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
