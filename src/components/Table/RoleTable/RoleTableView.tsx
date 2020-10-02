import React from "react";
import CommonTable from "../CommonTable";
import {
	makeStyles,
	Theme,
	createStyles,
	TableContainer,
	Table,
	TableHead,
	Paper,
	TableCell,
	TableSortLabel,
	TableRow,
	TableBody,
	Button,
	Grid,
} from "@material-ui/core";
import { getValueFromObject } from "../../../utils";
import { Link } from "react-router-dom";

const tableHeadings = [{ label: "#" }, { label: "Name" }, { label: "" }];

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
	})
);

const keyNames = ["name"];

function RoleTableView({ userRoles }: { userRoles: { id: string; name: string; type: string }[] }) {
	const tableStyles = styledTable();
	return (
		<Grid container justify="center">
			<Grid item xs={7}>
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow color="primary">
								{tableHeadings.map(
									(
										heading: { label: string; keyMapping?: string },
										index: number
									) => (
										<TableCell
											className={tableStyles.th}
											key={index}
											align="left"
										>
											{heading.label}
											{/* {heading.keyMapping && (
												<TableSortLabel
													active={orderBy === heading.keyMapping}
													onClick={() => {
														if (orderBy === heading.keyMapping) {
															setOrder &&
																setOrder(
																	order === "asc" ? "desc" : "asc"
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
											)} */}
										</TableCell>
									)
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{userRoles.map(
								(
									role: { id: string; name: string; type: string },
									index: number
								) => (
									<TableRow key={role.id}>
										<TableCell align="left">{index + 1}</TableCell>
										{keyNames.map((keyName: string, i: number) => {
											return (
												<TableCell key={i} align="left">
													{getValueFromObject(role, keyName.split(","))}
												</TableCell>
											);
										})}
										<TableCell align="left">
											<Button
												variant="contained"
												size="small"
												color="primary"
												component={Link}
												to="/settings/add_role"
												state={{ role: role.id }}
											>
												Edit Role
											</Button>
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);
}

export default RoleTableView;
