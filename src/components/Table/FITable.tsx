import { Typography, Table, Grid, Box } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
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
}: {
	tableHeading: { label: string }[];
	rows: any[];
}) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();

	return (
		<>
			{!rows.length ? (
				<Grid container style={{ backgroundColor: "#F5F6FA" }}>
					<Grid xs={12}>
						<Box>
							<Typography
								align="center"
								variant="subtitle1"
								variantMapping={{
									subtitle1: "h1",
								}}
							>
								No Achievement Reported
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
												{heading.label}
											</TableCell>
										))}
								</TableRow>
							</TableHead>
							<TableBody className={tableHeader.tbody}>
								{rows.map((row: any, index: number) => (
									<TableRow key={index}>
										<TableCell component="td" scope="row">
											{index + 1}
										</TableCell>
										{row.map((col: string) => {
											return <TableCell align="left">{col}</TableCell>;
										})}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			)}
		</>
	);
}
