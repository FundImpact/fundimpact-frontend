import { Box, Grid, Table, Typography, TableSortLabel } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles({
	table: {},
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

export default function FITable({
	tableHeading,
	rows,
	pagination,
	order,
	setOrder,
	orderBy,
	setOrderBy,
}: {
	tableHeading: { label: string; keyMapping?: string }[];
	rows: React.ReactNode[];
	pagination?: React.ReactNode;
	order?: "asc" | "desc";
	setOrder?: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy?: string;
	setOrderBy?: React.Dispatch<React.SetStateAction<string>>;
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();

	return (
		<>
			{!rows.length ? (
				<Grid container style={{ backgroundColor: "#F5F6FA" }}>
					<Grid item xs={12}>
						<Box>
							<Typography
								align="center"
								variant="subtitle1"
								variantMapping={{
									subtitle1: "h1",
								}}
							>
								<FormattedMessage
									id={`noAchievementsReported`}
									defaultMessage={`No Achievements Reported`}
									description={`This text will be shown if no target found for table`}
								/>
							</Typography>
						</Box>
					</Grid>
				</Grid>
			) : (
				<Grid>
					<Box m={1}>
						<Typography variant="subtitle2">Achievements</Typography>
					</Box>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
								<TableRow color="primary">
									{rows &&
										rows.length > 0 &&
										tableHeading.map((heading) => (
											<TableCell
												className={tableHeader.th}
												key={heading.label}
												align="left"
											>
												 {/* {heading.label} */}
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
														active={orderBy == heading.keyMapping}
														onClick={() => {
															if (orderBy == heading.keyMapping) {
																setOrder &&
																	setOrder(
																		order == "asc"
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
											</TableCell>
										))}
								</TableRow>
							</TableHead>
							<TableBody className={tableHeader.tbody}>
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
