import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useLazyQuery } from "@apollo/client";
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
	Button,
	Paper,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../Menu";
import { FORM_ACTIONS } from "../../../models/constants";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { GET_YEARTAGS, GET_YEARTAGS_COUNT } from "../../../graphql/yearTags/query";
import pagination from "../../../hooks/pagination";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import { yearTagTableHeadings as tableHeading } from "../constants";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { DONOR_ACTIONS } from "../../../utils/access/modules/donor/actions";
import { COUNTRY_ACTION } from "../../../utils/access/modules/country/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../utils";
import { FormattedMessage } from "react-intl";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import { COUNTRY_EXPORT, DONOR_EXPORT, DONOR_IMPORT } from "../../../utils/endpoints.util";
import { useAuth } from "../../../contexts/userContext";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useApolloClient } from "@apollo/client";
import { IYearTag } from "../../../models/yearTags";
import YearTagCountries from "./TabelsDialog";
import YearTag from "../../YearTag";
import { YEARTAG_ACTIONS } from "../../../utils/access/modules/yearTag/actions";

enum tableHeader {
	name = 1,
	legalName = 2,
	shortName = 3,
	country = 4,
}

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

const keyNames = ["name", "type", "start_date", "end_date"];

const getInitialValues = (yearTag: IYearTag | null): IYearTag => {
	return {
		name: yearTag?.name || "",
		start_date: yearTag?.start_date || "",
		end_date: yearTag?.end_date || "",
		type: yearTag?.type || "",
		id: yearTag?.id || "",
	};
};

// const ImportExportTableMenuHoc = ({
// 	importButtonOnly,
// 	refetchDonorTable,
// }: {
// 	importButtonOnly?: boolean;
// 	refetchDonorTable: () => void;
// }) => {
// 	const theme = useTheme();
// 	const { jwt } = useAuth();

// 	const donorExportAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.EXPORT_DONOR);
// 	const donorImportAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.IMPORT_DONOR);
// 	return (
// 		<ImportExportTableMenu
// 			tableName="Donors"
// 			tableExportUrl={DONOR_EXPORT}
// 			tableImportUrl={DONOR_IMPORT}
// 			onImportTableSuccess={() => refetchDonorTable?.()}
// 			hideExport={!donorExportAccess}
// 			hideImport={!donorImportAccess}
// 			importButtonOnly={importButtonOnly}
// 		>
// 			<>
// 				<Button
// 					variant="outlined"
// 					style={{ marginRight: theme.spacing(1) }}
// 					onClick={() =>
// 						exportTable({
// 							tableName: "Country",
// 							jwt: jwt as string,
// 							tableExportUrl: `${COUNTRY_EXPORT}`,
// 						})
// 					}
// 				>
// 					Country Export
// 				</Button>
// 				<Button
// 					variant="outlined"
// 					style={{ marginRight: theme.spacing(1), float: "right" }}
// 					onClick={() =>
// 						exportTable({
// 							tableName: "Donor Template",
// 							jwt: jwt as string,
// 							tableExportUrl: `${DONOR_EXPORT}?header=true`,
// 						})
// 					}
// 				>
// 					Donor Template
// 				</Button>
// 			</>
// 		</ImportExportTableMenu>
// 	);
// };

function YearTagTable({
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string | string[] };
}) {
	const classes = useStyles();
	const tableStyles = styledTable();
	const selectedYearTag = React.useRef<any | null>(null);
	const [page, setPage] = useState<number>(0);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [pageCount, setPageCount] = useState(0);

	const countryFindAccess = userHasAccess(MODULE_CODES.COUNTRY, COUNTRY_ACTION.FIND_COUNTRY);

	const filteredTableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(tableHeading, {
				[tableHeader.country]: !countryFindAccess,
			}),
		[countryFindAccess]
	);

	const [openYearTagEditDialog, setOpenYearTagEditDialog] = useState(false);
	const [openDeleteYearTagDialog, setOpenDeleteYearTagDialog] = useState(false);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	let {
		changePage,
		count,
		queryData: yearTagList,
		queryLoading,
		countQueryLoading,
		queryRefetch: refetchYearTagsList,
		countRefetch: refetchYearTagsCount,
	} = pagination({
		countQuery: GET_YEARTAGS_COUNT,
		countFilter: {},
		query: GET_YEARTAGS,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	useEffect(() => {
		if (count?.aggregate?.count) {
			setPageCount(count.aggregate.count);
		}
	}, [count]);

	const apolloClient = useApolloClient();

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
						console.log("Closed");
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
						console.log("Closed");
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
				{/* <ImportExportTableMenuHoc
					refetchDonorTable={refetchDonorTable}
					importButtonOnly={true}
				/> */}
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
							? filteredTableHeadings.map(
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
											)}
										</TableCell>
									)
							  )
							: null}
						<TableCell className={tableStyles.th} align="left">
							{/* <ImportExportTableMenuHoc refetchDonorTable={refetchDonorTable} /> */}
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
				{/* Check if yearTagList has data */}
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
								onChangeRowsPerPage={() => {}}
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
