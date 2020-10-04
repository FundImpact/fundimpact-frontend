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

const tableHeadings = [{ label: "#" }, { label: "Name" }, { label: "" }];

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
	})
);

const keyNames = ["name"];

const filterTableHeadingAccordingToUserAccess = (accessAllowed: boolean) =>
	accessAllowed ? tableHeadings : tableHeadings.slice(0, -1);

function RoleTableView({
	userRoles,
	page,
	setPage,
	changePage,
	count,
	userRoleEditAccess,
	loading,
}: {
	userRoles: { id: string; name: string; type: string }[];
	page: number;
	setPage: (value: React.SetStateAction<number>) => void;
	changePage: (prev?: boolean) => void;
	count: number;
	userRoleEditAccess: boolean;
	loading: boolean;
}) {
	if (loading) {
		return <TableSkeleton />;
	}

	if (!userRoles.length) {
		return (
			<Typography align="center" variant="h5">
				No Roles Created
			</Typography>
		);
	}

	return <div>Hello</div>;

	// const tableStyles = styledTable();
	// let tableHeader = filterTableHeadingAccordingToUserAccess(userRoleEditAccess);

	// return (
	// 	<Grid container justify="center">
	// 		<Grid item xs={7}>
	// 			<TableContainer component={Paper}>
	// 				<Table aria-label="simple table">
	// 					<TableHead>
	// 						<TableRow color="primary">
	// 							{tableHeader.map(
	// 								(
	// 									heading: { label: string; keyMapping?: string },
	// 									index: number
	// 								) => (
	// 									<TableCell
	// 										className={tableStyles.th}
	// 										key={index}
	// 										align="left"
	// 									>
	// 										{heading.label}
	// 										{/* {heading.keyMapping && (
	// 											<TableSortLabel
	// 												active={orderBy === heading.keyMapping}
	// 												onClick={() => {
	// 													if (orderBy === heading.keyMapping) {
	// 														setOrder &&
	// 															setOrder(
	// 																order === "asc" ? "desc" : "asc"
	// 															);
	// 													} else {
	// 														setOrderBy &&
	// 															setOrderBy(
	// 																heading.keyMapping || ""
	// 															);
	// 													}
	// 												}}
	// 												direction={order}
	// 											></TableSortLabel>
	// 										)} */}
	// 									</TableCell>
	// 								)
	// 							)}
	// 						</TableRow>
	// 					</TableHead>
	// 					<TableBody>
	// 						{userRoles.map(
	// 							(
	// 								role: { id: string; name: string; type: string },
	// 								index: number
	// 							) => (
	// 								<TableRow key={role.id}>
	// 									<TableCell align="left">{index + 1}</TableCell>
	// 									{keyNames.map((keyName: string, i: number) => {
	// 										return (
	// 											<TableCell key={i} align="left">
	// 												{getValueFromObject(role, keyName.split(","))}
	// 											</TableCell>
	// 										);
	// 									})}
	// 									{userRoleEditAccess && (
	// 										<TableCell align="left">
	// 											<Button
	// 												variant="contained"
	// 												size="small"
	// 												color="primary"
	// 												component={Link}
	// 												to="/settings/add_role"
	// 												state={{ role: role.id }}
	// 											>
	// 												Edit Role
	// 											</Button>
	// 										</TableCell>
	// 									)}
	// 								</TableRow>
	// 							)
	// 						)}
	// 					</TableBody>
	// 					{
	// 						// <TableFooter>
	// 						// 	<TableRow>
	// 						// 		<TablePagination
	// 						// 			rowsPerPageOptions={[]}
	// 						// 			colSpan={8}
	// 						// 			count={count}
	// 						// 			rowsPerPage={count > 10 ? 10 : count}
	// 						// 			page={page}
	// 						// 			SelectProps={{
	// 						// 				inputProps: { "aria-label": "rows per page" },
	// 						// 				native: true,
	// 						// 			}}
	// 						// 			onChangePage={(
	// 						// 				event: React.MouseEvent<HTMLButtonElement> | null,
	// 						// 				newPage: number
	// 						// 			) => {
	// 						// 				if (newPage > page) {
	// 						// 					changePage();
	// 						// 				} else {
	// 						// 					changePage(true);
	// 						// 				}
	// 						// 				setPage(newPage);
	// 						// 			}}
	// 						// 			onChangeRowsPerPage={() => {}}
	// 						// 			style={{ paddingRight: "40px" }}
	// 						// 		/>
	// 						// 	</TableRow>
	// 						// </TableFooter>
	// 					}
	// 				</Table>
	// 			</TableContainer>
	// 		</Grid>
	// 	</Grid>
	// );
}

export default RoleTableView;
