import { Box, Grid, Table, Typography, TableSortLabel } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import React from "react";
import { FormattedMessage } from "react-intl";
import { ITableHeadings } from "../../models";

const useStyles = makeStyles({
	table: {
		width: "100%",
	},
});

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, backgroundColor: theme.palette.background.paper },
		tbody: {
			"& tr:nth-child(odd)": { background: theme.palette.action.hover },
			"& tr:nth-child(even)": { background: theme.palette.background.paper },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
			},
		},
	})
);

export default function FITable({
	tableHeading,
	rows,
	pagination,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	noRowHeading,
	rowHeading,
}: {
	tableHeading: ITableHeadings[];
	rows: React.ReactNode[];
	pagination?: React.ReactNode;
	order?: "asc" | "desc";
	setOrder?: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy?: string;
	setOrderBy?: React.Dispatch<React.SetStateAction<string>>;
	noRowHeading?: string;
	rowHeading?: string;
}) {
	const classes = useStyles();
	const tableStyles = styledTable();
	const theme = useTheme();

	return (
		<>
			{!rows.length ? (
				<Grid container>
					{noRowHeading && (
						<Grid item xs={12}>
							<Box>
								<Typography
									align="center"
									variant="subtitle1"
									variantMapping={{
										subtitle1: "h1",
									}}
								>
									{noRowHeading}
								</Typography>
							</Box>
						</Grid>
					)}
				</Grid>
			) : (
				<Grid>
					{rowHeading && (
						<Box m={1}>
							<Typography variant="subtitle2">{rowHeading}</Typography>
						</Box>
					)}
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
								<TableRow color="primary">
									{rows &&
										rows.length > 0 &&
										tableHeading.map((heading) => (
											<TableCell
												className={tableStyles.th}
												key={heading.label}
												align="left"
											>
												{heading.renderComponent ? (
													heading.renderComponent()
												) : (
													<>
														<FormattedMessage
															id={
																"tableHeading" +
																heading.label.replace(/ /g, "")
															}
															defaultMessage={`${heading.label}`}
															description={`This text will be shown on table for ${heading.label} heading`}
														/>
														{order && heading.keyMapping && (
															<TableSortLabel
																active={
																	orderBy === heading.keyMapping
																}
																onClick={() => {
																	if (
																		orderBy ===
																		heading.keyMapping
																	) {
																		setOrder &&
																			setOrder(
																				order === "asc"
																					? "desc"
																					: "asc"
																			);
																	} else {
																		setOrderBy &&
																			setOrderBy(
																				heading.keyMapping ||
																					""
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
								{rows.map((row: any, index: number) => (
									<TableRow key={index}>
										{row.map((col: React.ReactNode) => {
											return col;
										})}
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>{rows.length > 0 && pagination}</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</Grid>
			)}
		</>
	);
}
