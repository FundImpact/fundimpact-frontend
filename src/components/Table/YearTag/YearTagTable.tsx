import React, { useState, useEffect, useMemo, useCallback } from "react";
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
	Slide,
	Dialog,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../Menu";
import Donor from "../../Donor";
import { Entity_Name, FORM_ACTIONS } from "../../../models/constants";
import { IDONOR_RESPONSE } from "../../../models/donor/query";
import { GET_ORG_DONOR, GET_DONOR_COUNT } from "../../../graphql/donor";
import { GET_YEARTAGS } from "../../../graphql/yearTags/query";
import { IDONOR } from "../../../models/donor";
import pagination from "../../../hooks/pagination";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import TableSkeleton from "../../Skeletons/TableSkeleton";
// import { donorTableHeading as tableHeading } from "../constants";
import { yearTagTableHeadings as tableHeading } from "../constants";
import { getValueFromObject } from "../../../utils";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { DONOR_ACTIONS } from "../../../utils/access/modules/donor/actions";
import { COUNTRY_ACTION } from "../../../utils/access/modules/country/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../utils";
import { FormattedMessage } from "react-intl";
import ContactDialog from "../../ContactDialog";
import ContactListDialog from "../../ContactListDialog";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import { COUNTRY_EXPORT, DONOR_EXPORT, DONOR_IMPORT } from "../../../utils/endpoints.util";
import { useAuth } from "../../../contexts/userContext";
import { exportTable } from "../../../utils/importExportTable.utils";
import { YearTagPayload } from "../../../models/yearTags";
import { useApolloClient } from "@apollo/client";
import { yearTagList } from "./dummyData.json";
import { IYearTag } from "../../../models/yearTags";
import TabelsDialog from "./TabelsDialog";

enum tableHeader {
	name = 1,
	legalName = 2,
	shortName = 3,
	country = 4,
}

const YearTagCountries = () => {
	const [open, setOpen] = useState<boolean>(false);

	const openDialog = () => {
		setOpen(true);
	};

	const closeDialog = () => {
		setOpen(false);
	};
	return (
		<>
			<TabelsDialog open={open} handleClose={closeDialog} />
			<IconButton onClick={openDialog}>
				<VisibilityIcon />
			</IconButton>
		</>
	);
};

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

const getInitialValues = (donor: IDONOR_RESPONSE | null): IDONOR => {
	return {
		country: donor?.country?.id || "",
		legal_name: donor?.legal_name || "",
		name: donor?.name || "",
		short_name: donor?.short_name || "",
		id: donor?.id || "",
	};
};

const ImportExportTableMenuHoc = ({
	importButtonOnly,
	refetchDonorTable,
}: {
	importButtonOnly?: boolean;
	refetchDonorTable: () => void;
}) => {
	const theme = useTheme();
	const { jwt } = useAuth();

	const donorExportAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.EXPORT_DONOR);
	const donorImportAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.IMPORT_DONOR);
	return (
		<ImportExportTableMenu
			tableName="Donors"
			tableExportUrl={DONOR_EXPORT}
			tableImportUrl={DONOR_IMPORT}
			onImportTableSuccess={() => refetchDonorTable?.()}
			hideExport={!donorExportAccess}
			hideImport={!donorImportAccess}
			importButtonOnly={importButtonOnly}
		>
			<>
				<Button
					variant="outlined"
					style={{ marginRight: theme.spacing(1) }}
					onClick={() =>
						exportTable({
							tableName: "Country",
							jwt: jwt as string,
							tableExportUrl: `${COUNTRY_EXPORT}`,
						})
					}
				>
					Country Export
				</Button>
				<Button
					variant="outlined"
					style={{ marginRight: theme.spacing(1), float: "right" }}
					onClick={() =>
						exportTable({
							tableName: "Donor Template",
							jwt: jwt as string,
							tableExportUrl: `${DONOR_EXPORT}?header=true`,
						})
					}
				>
					Donor Template
				</Button>
			</>
		</ImportExportTableMenu>
	);
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
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});

	const dashboardData = useDashBoardData();

	const countryFindAccess = userHasAccess(MODULE_CODES.COUNTRY, COUNTRY_ACTION.FIND_COUNTRY);

	const filteredTableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(tableHeading, {
				[tableHeader.country]: !countryFindAccess,
			}),
		[countryFindAccess]
	);

	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	useEffect(() => {
		let newFilterListObject: { [key: string]: string | string[] } = {};
		for (let key in tableFilterList) {
			if (tableFilterList[key] && tableFilterList[key].length) {
				newFilterListObject[key] = tableFilterList[key];
			}
		}
		setQueryFilter({
			organization: dashboardData?.organization?.id,
			...newFilterListObject,
		});
	}, [tableFilterList, dashboardData]);

	const [openYearTagEditDialog, setOpenYearTagEditDialog] = useState(false);
	const [openContactAddDialog, setOpenContactAddDialog] = useState(false);
	const [openContactListDialog, setOpenContactListDialog] = useState(false);
	const [openDeleteYearTagDialog, setOpenDeleteYearTagDialog] = useState(false);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	let {
		changePage,
		count,
		queryData: donorList,
		queryLoading,
		countQueryLoading,
		queryRefetch: refetchDonorsList,
		countRefetch: refetchDonorCount,
	} = pagination({
		countQuery: GET_DONOR_COUNT,
		countFilter: queryFilter,
		query: GET_ORG_DONOR,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	const [getYearTags, yearTagsResponse] = useLazyQuery(GET_YEARTAGS);

	useEffect(() => {
		getYearTags();
	}, []);

	// console.log("donorList: ", yearTagsResponse);

	const apolloClient = useApolloClient();

	const refetchDonorTable = useCallback(() => {
		apolloClient.query({
			query: GET_ORG_DONOR,
			variables: {
				filter: {
					organization: dashboardData?.organization?.id,
				},
			},
			fetchPolicy: "network-only",
		});
		refetchDonorCount?.().then(() => refetchDonorsList?.());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetchDonorCount, refetchDonorsList]);

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

	const donorEditAccess = userHasAccess(MODULE_CODES.DONOR, DONOR_ACTIONS.UPDATE_DONOR);

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

	if (!donorList?.orgDonors?.length) {
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
				<ImportExportTableMenuHoc
					refetchDonorTable={refetchDonorTable}
					importButtonOnly={true}
				/>
			</Box>
		);
	}

	return (
		<TableContainer component={Paper}>
			{/* <Donor
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenDonorEditDialog(false)}
				initialValues={getInitialValues(selectedYearTag.current)}
				open={openDonorEditDialog}
			/>
			<Donor
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenDeleteDonorDialog(false)}
				initialValues={getInitialValues(selectedYearTag.current)}
				open={openDeleteDonorDialog}
				deleteDonor={true}
			/>
			<ContactDialog
				entity_id={selectedYearTag.current?.id || ""}
				entity_name={Entity_Name.donor}
				formAction={FORM_ACTIONS.CREATE}
				open={openContactAddDialog}
				handleClose={() => setOpenContactAddDialog(false)}
			/>
			<ContactListDialog
				entity_id={selectedYearTag.current?.id || ""}
				entity_name={Entity_Name.donor}
				open={openContactListDialog}
				handleClose={() => setOpenContactListDialog(false)}
			/> */}
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{/* {console.log("filteredTableHeadings: ", filteredTableHeadings)} */}
						{/* Check if yearTagList has data */}
						{true
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
							<ImportExportTableMenuHoc refetchDonorTable={refetchDonorTable} />
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className={tableStyles.tbody}>
					{/* <TableRow>
						<TableCell>k</TableCell>
					</TableRow> */}
					{/* {console.log(
						"getValueFromObject: ",
						getValueFromObject(donorList?.orgDonors[0], keyNames[0].split(","))
					)} */}
					{/* {console.log("yearTagsResponse: ", yearTagsResponse)} */}
					{yearTagsResponse.data?.yearTags.map((yearTag: IYearTag, index: number) => (
						<TableRow key={yearTag.id}>
							<TableCell component="td" scope="row">
								{page * 10 + index + 1}
							</TableCell>
							<TableCell align="left">{yearTag.name}</TableCell>
							<TableCell align="left">{yearTag.type}</TableCell>
							<TableCell align="left">{yearTag.start_date}</TableCell>
							<TableCell align="left">{yearTag.end_date}</TableCell>
							<TableCell align="left">
								<YearTagCountries />
							</TableCell>
							<TableCell>
								<IconButton
									aria-haspopup="true"
									onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
										selectedYearTag.current = yearTag;
										handleClick(event);
									}}
									style={{ visibility: "visible" }}
								>
									<MoreVertIcon />
								</IconButton>
								{/* Year tag edit accces */}
								{true && (
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
				{true ? (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[]}
								colSpan={8}
								count={yearTagList.length}
								rowsPerPage={count > 10 ? 10 : count}
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
