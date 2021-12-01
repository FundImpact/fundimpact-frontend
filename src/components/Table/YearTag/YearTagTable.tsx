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
	TableSortLabel,
	Typography,
	Box,
	Paper,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../Menu";
import { FORM_ACTIONS } from "../../../models/constants";
import { GET_YEARTAGS, GET_YEARTAGS_COUNT } from "../../../graphql/yearTags/query";
import pagination from "../../../hooks/pagination";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import { yearTagTableHeadings as tableHeading } from "../constants";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { FormattedMessage } from "react-intl";
import { useApolloClient } from "@apollo/client";
import { IYearTag } from "../../../models/yearTags";
import YearTagCountries from "./TabelsDialog";
import YearTag from "../../YearTag";
import { YEARTAG_ACTIONS } from "../../../utils/access/modules/yearTag/actions";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
		tbody: {
			"& tr:nth-child(odd) td": { background: theme.palette.action.hover },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
				fontSize: "13px",
			},
		},
	})
);

const getInitialValues = (yearTag: IYearTag | null): IYearTag => {
	return {
		name: yearTag?.name || "",
		start_date: yearTag?.start_date || "",
		end_date: yearTag?.end_date || "",
		type: yearTag?.type || "",
		id: yearTag?.id || "",
		country_id: yearTag?.country_id || [],
	};
};

function YearTagTable({
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string | string[] };
}) {
	const classes = useStyles();
	const tableStyles = styledTable();
	const selectedYearTag = React.useRef<any | null>(null);
	const [page, setPage] = useState<number>(0);
	const [ytOrderBy, setYTOrderBy] = useState<string>("created_at");
	const [ytOrder, setYTOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [pageCount, setPageCount] = useState(0);
	console.log("pageCount", pageCount);

	const [openYearTagEditDialog, setOpenYearTagEditDialog] = useState(false);
	const [openDeleteYearTagDialog, setOpenDeleteYearTagDialog] = useState(false);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	useEffect(() => {
		let newFilterListObject: { [key: string]: string | string[] } = {};
		for (let key in tableFilterList) {
			if (tableFilterList[key] && tableFilterList[key].length) {
				newFilterListObject[key] = tableFilterList[key];
			}
		}
		setQueryFilter(newFilterListObject);
	}, [tableFilterList]);

	let { changePage, count, queryData: yearTagList, queryLoading, countQueryLoading } = pagination(
		{
			countQuery: GET_YEARTAGS_COUNT,
			countFilter: {},
			query: GET_YEARTAGS,
			queryFilter,
			sort: `${ytOrderBy}:${ytOrder.toUpperCase()}`,
		}
	);

	console.log("count", count);

	const countryList = yearTagList?.yearTags.map((elem: any) => {
		return elem.country_id;
	});

	if (countryList) {
		console.log("countryList", [...countryList]);
	}
	// countryList.map((data: any) => {
	// 	console.log("data country", data);
	// });

	useEffect(() => {
		if (count?.aggregate?.count) {
			setPageCount(count.aggregate.count);
		}
	}, [count]);

	//this means new element has been added to the list
	useEffect(() => {
		setPage(0);
	}, [count, setPage]);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const yearTagEditAccess = userHasAccess(MODULE_CODES.YEAR_TAG, YEARTAG_ACTIONS.UPDATE_YEAR_TAG);

	const menuList = [
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenYearTagEditDialog(true);
						handleClose();
					}}
				>
					<FormattedMessage
						id="yearTagEdit"
						defaultMessage="Edit"
						description="This text will be shown on menu item to edit year tag"
					/>
				</MenuItem>
			),
		},
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenDeleteYearTagDialog(true);
						handleClose();
					}}
				>
					<FormattedMessage
						id="yearTagDelete"
						defaultMessage="Delete"
						description="This text will be shown on menu item to delete year tag"
					/>
				</MenuItem>
			),
		},
	];

	if (countQueryLoading || queryLoading) {
		return <TableSkeleton />;
	}

	if (!yearTagList?.yearTags?.length) {
		return (
			<Box
				m={2}
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
			>
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
		<TableContainer component={Paper}>
			<YearTag
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenYearTagEditDialog(false)}
				initialValues={getInitialValues(selectedYearTag.current)}
				open={openYearTagEditDialog}
			/>
			<YearTag
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenDeleteYearTagDialog(false)}
				initialValues={getInitialValues(selectedYearTag.current)}
				open={openDeleteYearTagDialog}
				deleteYearTag={true}
			/>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{yearTagList?.yearTags?.length > 0
							? tableHeading.map(
									(
										obj: { label: string; keyMapping?: string },
										index: number
									) => (
										<TableCell
											className={tableStyles.th}
											key={index}
											align="left"
										>
											{obj.label}
											{obj.keyMapping && (
												<TableSortLabel
													active={ytOrderBy === obj.keyMapping}
													onClick={() => {
														if (ytOrderBy === obj.keyMapping) {
															setYTOrder &&
																setYTOrder(
																	ytOrder === "asc"
																		? "desc"
																		: "asc"
																);
														} else {
															setYTOrderBy &&
																setYTOrderBy(obj.keyMapping || "");
														}
													}}
													direction={ytOrder}
												></TableSortLabel>
											)}
										</TableCell>
									)
							  )
							: null}
						<TableCell className={tableStyles.th} align="left">
							No Data found
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className={tableStyles.tbody}>
					{yearTagList?.yearTags.map((yearTag: IYearTag, index: number) => (
						<TableRow key={yearTag.id}>
							<TableCell component="td" scope="row">
								{page * 10 + index + 1}
							</TableCell>
							<TableCell align="left">{yearTag.name}</TableCell>
							<TableCell align="left">{yearTag.type}</TableCell>
							<TableCell align="left">{yearTag.start_date}</TableCell>
							<TableCell align="left">{yearTag.end_date}</TableCell>
							<TableCell align="left">
								<YearTagCountries yearTag={yearTag} />
							</TableCell>
							<TableCell>
								<IconButton
									aria-haspopup="true"
									onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
										selectedYearTag.current = yearTag;
										handleClick(event);
									}}
									style={{ visibility: yearTagEditAccess ? "visible" : "hidden" }}
								>
									<MoreVertIcon />
								</IconButton>
								{yearTagEditAccess && (
									<SimpleMenu
										handleClose={handleClose}
										id={`organizationMenu-${yearTag.id}`}
										anchorEl={
											selectedYearTag?.current?.id === yearTag.id
												? anchorEl
												: null
										}
										menuList={menuList}
									/>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
				{yearTagList?.yearTags.length > 0 ? (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[]}
								colSpan={8}
								count={pageCount}
								rowsPerPage={pageCount > 10 ? 10 : pageCount}
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
										changePage();
									} else {
										changePage(true);
									}
									setPage(newPage);
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

export default React.memo(YearTagTable);
