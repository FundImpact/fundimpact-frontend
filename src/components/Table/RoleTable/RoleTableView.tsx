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
	TableFooter,
	TablePagination,
	Typography,
} from "@material-ui/core";
import { getValueFromObject } from "../../../utils";
import { Link } from "react-router-dom";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import { useDashBoardData } from "../../../contexts/dashboardContext";

const tableHeadings = [{ label: "#" }, { label: "Name", keyMapping: "name" }, { label: "" }];

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
		tbody: {
			"& tr:nth-child(odd) td": { background: theme.palette.action.hover },
		},
	})
);

const keyNames = ["name"];

const filterTableHeadingAccordingToUserAccess = (accessAllowed: boolean) =>
	accessAllowed ? tableHeadings : tableHeadings.slice(0, -1);

function RoleTableView({
	userRoles,
	userRoleEditAccess,
	loading,
	order,
	setOrder,
	page,
	setPage,
	changePage,
	count
}: {
	userRoles: { id: string; name: string; type: string }[];
	userRoleEditAccess: boolean;
	loading: boolean;
	order: "asc" | "desc";
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	changePage: (prev?: boolean) => void;
	count: number
}) {
	const dashboardData = useDashBoardData();
	const tableStyles = styledTable();
	if (loading) {
		return <TableSkeleton />;
	}

	if (!userRoles.length) {
		return (
			<Typography align="center" variant="h5">
				No Roles
			</Typography>
		);
	}

	let tableHeader = filterTableHeadingAccordingToUserAccess(userRoleEditAccess);

	return (
		<Grid container justify="center">
			<Grid item xs={7}>
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow color="primary">
								{tableHeader.map(
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
											{heading.keyMapping && (
												<TableSortLabel
													active={heading.keyMapping == "name"}
													onClick={() => {
														setOrder(order === "asc" ? "desc" : "asc");
													}}
													direction={order}
												></TableSortLabel>
											)}
										</TableCell>
									)
								)}
							</TableRow>
						</TableHead>
						<TableBody className={tableStyles.tbody}>
							{userRoles.map(
								(
									role: { id: string; name: string; type: string },
									index: number
								) => (
									<TableRow key={role.id}>
										<TableCell align="left">{page * 10 + index + 1}</TableCell>
										{keyNames.map((keyName: string, i: number) => {
											return (
												<TableCell key={i} align="left">
													{getValueFromObject(role, keyName.split(","))}
												</TableCell>
											);
										})}
										{userRoleEditAccess && (
											<TableCell align="left">
												{role.type !==
													`admin-org-${dashboardData?.organization?.id}` && (
													<Button
														variant="contained"
														size="small"
														color="primary"
														component={Link}
														to="/settings/add_role"
														state={{
															role: role.id,
															name: role.name,
														}}
													>
														Edit Role
													</Button>
												)}
											</TableCell>
										)}
									</TableRow>
								)
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									page={page}
									count={count}
									rowsPerPage={count > 10 ? 10 : count}
									colSpan={8}
									SelectProps={{
										inputProps: { "aria-label": "rows per page" },
										native: true,
									}}
									onChangeRowsPerPage={() => {}}
									onChangePage={(
										event: React.MouseEvent<HTMLButtonElement> | null,
										newPage: number
									) => {
										if (newPage > page) {
											changePage();
										} else {
											changePage(true);
										}
										setPage(newPage);
									}}
									style={{ paddingRight: "40px" }}
									rowsPerPageOptions={[]}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);
}

export default RoleTableView;
