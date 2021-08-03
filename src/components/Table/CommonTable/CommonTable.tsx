import React, { useState, useEffect } from "react";
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	IconButton,
	MenuItem,
	TableFooter,
	TablePagination,
	Collapse,
	Box,
	Typography,
	TableSortLabel,
	Grid,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../Menu";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import { ICommonTableRow, ICommonTable, ITableHeadings } from "../../../models";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { getValueFromObject } from "../../../utils";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
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

function CommonTableRow<T extends { id: string }>({
	rowData,
	serialNo,
	openAllRows,
	rows,
	children,
	collapsableTable = false,
}: {
	rowData: T;
	openAllRows: boolean;
	serialNo: number;
	rows: ICommonTableRow[];
	children: any; //change
	collapsableTable?: boolean;
}) {
	const [openRow, setOpenRow] = useState(false);
	const childrenArray = React.Children.toArray(children);
	const intl = useIntl();

	useEffect(() => {
		setOpenRow(openAllRows);
	}, [openAllRows]);

	return (
		<>
			<TableRow>
				{collapsableTable && (
					<TableCell>
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpenRow(!openRow)}
							data-testid={`collaspeButton-${serialNo}`}
						>
							{openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
				)}
				<TableCell component="td" scope="row">
					{serialNo}
				</TableCell>
				{rows.map((row, i: number) => {
					return (
						<TableCell key={i} align="left">
							{(row.valueAccessKey &&
								getValueFromObject(rowData, row.valueAccessKey.split(",")) &&
								intl.formatMessage({
									id: `rowData${getValueFromObject(
										rowData,
										row.valueAccessKey.split(",")
									)}`,
									defaultMessage: `${getValueFromObject(
										rowData,
										row.valueAccessKey.split(",")
									)}`,
									description: `This text will be show in row as ${getValueFromObject(
										rowData,
										row.valueAccessKey.split(",")
									)}`,
								})) ||
								(row.renderComponent && row.renderComponent(rowData))}
						</TableCell>
					);
				})}
				{childrenArray[0]}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
					<Collapse in={openRow} timeout="auto" unmountOnExit>
						<Box m={1}>{children[1] && children[1](rowData)}</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

const removeNullElementsFromMenuList = (element: { children: JSX.Element | null }) =>
	element.children;

function CommonTable<T extends { id: string }>({
	tableHeadings,
	rows,
	openAllRows,
	selectedRow,
	children,
	valuesList,
	toggleDialogs,
	editMenuName,
	collapsableTable = false,
	changePage,
	count,
	limit,
	setLimit,
	loading,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	setOpenAttachFiles,
	tableActionButton,
}: ICommonTable<T>) {
	const tableStyles = styledTable();
	const [page, setPage] = useState<number>(0);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const [defaultRows, setDefaultRows] = useState(limit || 5);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	//this means that new item has been added
	useEffect(() => {
		setPage(0);
	}, [count, setPage]);

	const getTablePaginationColSpan = () => tableHeadings.length + (tableActionButton ? 1 : 0);

	const menuList = editMenuName
		.map((element, index) => ({
			children:
				(element && (
					<MenuItem
						onClick={() => {
							toggleDialogs(index, true);
							if (setOpenAttachFiles && element === "View Documents")
								setOpenAttachFiles(true);
							handleClose();
						}}
					>
						{element}
					</MenuItem>
				)) ||
				null,
		}))
		.filter(removeNullElementsFromMenuList);

	const classes = useStyles();

	if (loading) {
		return <TableSkeleton />;
	}

	if (!valuesList.length) {
		return (
			<>
				<Box
					m={2}
					display="flex"
					justifyContent="center"
					flexDirection="column"
					alignItems="center"
				>
					<Typography variant="subtitle1" gutterBottom color="textSecondary">
						<FormattedMessage
							id={`nodataFound`}
							defaultMessage={`No Data Found`}
							description={`This text will be shown if no data found for table`}
						/>
					</Typography>
					<Box>{tableActionButton?.({ importButtonOnly: true })}</Box>
				</Box>
			</>
		);
	}

	let childrenArray = React.Children.toArray(children);

	return (
		<TableContainer component={Paper}>
			{/* childrenArray[0]  is the dialog we want in the table*/}
			{childrenArray[0]}
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{valuesList.length
							? tableHeadings.map((heading: ITableHeadings, index: number) => (
									<TableCell className={tableStyles.th} key={index} align="left">
										{heading.renderComponent ? (
											heading.renderComponent()
										) : (
											<Grid container>
												<Grid item xs={12} style={{ display: "flex" }}>
													{heading.label && (
														<FormattedMessage
															id={
																"tableHeading" +
																heading.label.replace(/ /g, "")
															}
															description={`This text will be shown on table for ${heading.label} heading`}
															defaultMessage={`${heading.label}`}
														/>
													)}
													{order && heading.keyMapping && (
														<TableSortLabel
															direction={order}
															active={orderBy === heading.keyMapping}
															onClick={() => {
																if (
																	orderBy === heading.keyMapping
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
																			heading.keyMapping || ""
																		);
																}
															}}
														></TableSortLabel>
													)}
												</Grid>
											</Grid>
										)}
										{index === tableHeadings.length - 1 &&
											tableActionButton?.({ importButtonOnly: false })}
									</TableCell>
							  ))
							: null}
					</TableRow>
				</TableHead>
				<TableBody className={tableStyles.tbody}>
					{valuesList
						.filter((element) => element)
						.map((rowData: T, index: number) => (
							<CommonTableRow
								key={rowData?.id}
								collapsableTable={collapsableTable}
								rowData={rowData}
								rows={rows}
								openAllRows={openAllRows}
								serialNo={page * defaultRows + index + 1}
							>
								<TableCell>
									<IconButton
										aria-haspopup="true"
										onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
											selectedRow.current = rowData;
											handleClick(event);
										}}
										style={{
											visibility: menuList.length > 0 ? "visible" : "hidden",
										}}
									>
										<MoreVertIcon />
									</IconButton>
									{menuList.length > 0 && (
										<SimpleMenu
											handleClose={handleClose}
											id={`organizationMenu-${rowData?.id}`}
											anchorEl={
												selectedRow?.current?.id === rowData?.id
													? anchorEl
													: null
											}
											menuList={menuList}
										/>
									)}
								</TableCell>
								{/* children[1] is a function which is used to retrive the value of row*/}
								{Array.isArray(children) && children?.length >= 1 && children[1]}
							</CommonTableRow>
						))}
				</TableBody>
				{valuesList.length && count ? (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, "All"]}
								colSpan={getTablePaginationColSpan()}
								count={count}
								rowsPerPage={limit || 5}
								page={page}
								SelectProps={{
									inputProps: { "aria-label": "rows per page" },
									native: true,
								}}
								onChangePage={(
									event: React.MouseEvent<HTMLButtonElement> | null,
									newPage: number
								) => {
									if (newPage > page) {
										changePage && changePage();
									} else {
										changePage && changePage(true);
									}
									setPage(newPage);
								}}
								onChangeRowsPerPage={(event: any) => {
									console.log("value-" + event.target.value);
									// console.log("limit-"+limit);
									// console.log("defaultrows"+defaultRows);
									if (event.target.value == "All") {
										if (setLimit) {
											console.log(1);
											setDefaultRows(count);
											setLimit(count);
										}
									} else if (event.target.value == 5) {
										if (setLimit) {
											console.log(2);
											setDefaultRows(5);
											setLimit(5);
										}
									} else if (event.target.value == 10) {
										if (setLimit) {
											console.log(3);
											setDefaultRows(10);
											setLimit(10);
										}
									}
									setPage(0);
									console.log(typeof event.target.value);
									console.log("limit-" + limit);
									console.log("defaultrows" + defaultRows);
								}}
								style={{ paddingRight: "40px" }}
							/>
						</TableRow>
					</TableFooter>
				) : null}
			</Table>
		</TableContainer>
	);
}

export default CommonTable;
