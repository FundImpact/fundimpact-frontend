import { ApolloQueryResult, useQuery } from "@apollo/client";
import {
	Avatar,
	Box,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	TableCell,
	TablePagination,
	Grid,
	Button,
	useTheme,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState, useMemo } from "react";
import pagination from "../../../hooks/pagination/pagination";
import { getTodaysDate, uploadPercentageCalculator } from "../../../utils";
import FullScreenLoader from "../../commons/GlobalLoader";
import { deliverableAndimpactTracklineHeading, subTargetTableHeadings } from "../constants";
import { FormattedMessage, useIntl } from "react-intl";
import { budgetSubTargetForm } from "./inputFields.json";
import FilterList from "../../FilterList";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/deliverableTrackingLineItem/actions";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { FINANCIAL_YEAR_ACTIONS } from "../../../utils/access/modules/financialYear/actions";
import { ANNUAL_YEAR_ACTIONS } from "../../../utils/access/modules/annualYear/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../utils";
import { AttachFile } from "../../../models/AttachFile";
import AttachFileForm from "../../Forms/AttachFiles";
import { chipArray } from "../../commons";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	ANNUAL_YEAR_EXPORT,
	DELIVERABLE_LINE_ITEM_PROJECTS_TABLE_EXPORT,
	DELIVERABLE_LINE_ITEM_PROJECTS_TABLE_IMPORT,
	DONOR_EXPORT,
	FINANCIAL_YEAR_EXPORT,
	GRANT_PERIOD_TABLE_EXPORT,
} from "../../../utils/endpoints.util";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { useRefetchOnDeliverableLineItemImport } from "../../../hooks/deliverable";
import {
	GET_DELIVERABLE_SUB_TARGETS,
	GET_DELIVERABLE_SUB_TARGETS_COUNT,
} from "../../../graphql/Deliverable/subTarget";
import FITable from "../FITable";
import { GET_BUDGET_SUB_TARGETS, GET_BUDGET_SUB_TARGETS_COUNT } from "../../../graphql/Budget";
import {
	GET_IMPACT_SUB_TARGETS,
	GET_IMPACT_SUB_TARGETS_COUNT,
} from "../../../graphql/Impact/subTarget";
import { ISubTarget } from "../../../models/common/subtarget";
import SubTarget from "../../Forms/SubTargetForm";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BudgetLineItemTable from "../Budget/BudgetLineItemTable";
import FIDialog from "../../Dialog/Dialog";
import DeliverablesTrackLineTable from "../Deliverable/DeliverableTrackLine";
import ImpactTrackLineTable from "../Impact/impactTrackline";
import { YearTagPayload } from "../../../models/yearTags";
import { GET_YEARTAGS } from "../../../graphql/yearTags/query";
import BudgetLineitem from "../../Budget/BudgetLineitem";
import { IBudgetTrackingLineitemForm } from "../../../models/budget/budgetForm";

enum tableHeaders {
	date = 1,
	note = 2,
	achieved = 3,
	year = 4,
}

const getTargetId = (tableType: "deliverable" | "impact" | "budget") =>
	tableType === "budget"
		? "budget_targets_project"
		: tableType === "deliverable"
		? "deliverable_target_project"
		: tableType === "impact"
		? "impact_target_project"
		: "";

function EditSubTarget({
	subTarget,
	refetch,
	tableType,
	donorId,
}: {
	subTarget: any;
	refetch:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| undefined;
	tableType: "deliverable" | "impact" | "budget";
	donorId?: string;
}) {
	const notificationDispatch = useNotificationDispatch();
	const [tracklineDonors, setTracklineDonors] = useState<
		{
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}[]
	>([]);
	const [openDeleteDeliverableLineItem, setOpenDeleteDeliverableLineItem] = useState(false);

	// const { data } = useQuery(GET_DELIVERABLE_TRANCHE, {
	// 	variables: { filter: { deliverable_tracking_lineitem: subTarget.id } },
	// });

	const dashBoardData = useDashBoardData();

	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [subTargetData, setsubTargetData] = useState<ISubTarget | null>();
	const handleMenuClose = () => {
		setMenuAnchor(null);
	};
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchor(event.currentTarget);
	};

	const subTargetAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM,
		DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS.UPDATE_DELIVERABLE_TRACKING_LINE_ITEM
	);
	const subTargetDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM,
		DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS.DELETE_DELIVERABLE_TRACKING_LINE_ITEM
	);

	const [subTargetFileArray, setSubTargetFileArray] = useState<AttachFile[]>([]);
	const [openAttachFiles, setOpenAttachFiles] = useState(false);
	const [openForm, setOpenForm] = useState(false);

	const initialValues1: IBudgetTrackingLineitemForm = {
		amount: "",
		note: "",
		budget_sub_target: (subTarget?.id as any) || "",
		annual_year: "",
		reporting_date: getTodaysDate(),
		financial_year_org: "",
		financial_year_donor: "",
		timeperiod_start: "",
		timeperiod_end: "",
		attachments: [],
	};
	return (
		<>
			<TableCell>
				<IconButton
					style={{
						visibility: subTargetAccess || subTargetDeleteAccess ? "visible" : "hidden",
					}}
					aria-label="delete"
					onClick={handleMenuClick}
				>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
			<Menu
				onClose={handleMenuClose}
				open={Boolean(menuAnchor)}
				keepMounted
				anchorEl={menuAnchor}
				id="deliverable-trackline-simple-menu"
			>
				{subTargetAccess && (
					<MenuItem
						onClick={() => {
							setsubTargetData({
								id: subTarget?.id,
								[getTargetId(tableType)]: subTarget?.[getTargetId(tableType)]?.id,
								timeperiod_start: getTodaysDate(subTarget?.timeperiod_start),
								timeperiod_end: getTodaysDate(subTarget?.timeperiod_end),
								target_value: subTarget?.target_value,
								donor: subTarget?.donor?.id,
								financial_year_org: subTarget.financial_year_org?.id,
								financial_year_donor: subTarget.financial_year_donor?.id,
								grant_periods_project: subTarget.grant_periods_project?.id,
								annual_year: subTarget.annual_year?.id,
								project: subTarget.project?.id,
							});
							handleMenuClose();
						}}
					>
						<FormattedMessage
							id="editAchievementMenu"
							defaultMessage="Edit Sub Target"
							description="This text will be show on deliverable or impact target table for edit achievement menu"
						/>
					</MenuItem>
				)}
				{/* {subTargetDeleteAccess && (
					<MenuItem
						onClick={() => {
							setsubTargetData({
								id: subTarget?.id,
								[getTargetId(tableType)]: subTarget?.[getTargetId(tableType)]?.id,
								timeperiod_start: getTodaysDate(
									subTarget?.timeperiod_start
								),
								timeperiod_end: getTodaysDate(
									subTarget?.timeperiod_end
								),
                                financial_year_donor: subTarget.financial_year_donor?.id,
                                grant_periods_project: subTarget.grant_periods_project?.id,
								annual_year: subTarget.annual_year?.id,
                                project: subTarget.project?.id,
								target_value: subTarget?.target_value,
								financial_year_org: subTarget.financial_year_org?.id,
							});
							setOpenDeleteDeliverableLineItem(true);
							handleMenuClose();
						}}
					>
						<FormattedMessage
							id="deleteAchievementMenu"
							defaultMessage="Delete Achievement"
							description="This text will be show on deliverable or impact target table for edit achievement menu"
						/>
					</MenuItem>
				)} */}
				{subTargetAccess && (
					<MenuItem
						onClick={() => {
							setOpenForm(true);
							handleMenuClose();
						}}
					>
						<>
							{tableType === "budget" ? (
								<FormattedMessage
									id="reportLineItem"
									defaultMessage="Report Line Item"
									description="Report Line Item"
								/>
							) : (
								<FormattedMessage
									id="reportAchievements"
									defaultMessage="Report Achievements"
									description="Report Achievements"
								/>
							)}
						</>
					</MenuItem>
				)}
				{subTargetAccess && (
					<MenuItem
						onClick={() => {
							setSubTargetFileArray(subTarget?.attachments);
							setOpenAttachFiles(true);
							handleMenuClose();
						}}
					>
						<FormattedMessage
							id="viewDocumentsMenu"
							defaultMessage="View Documents"
							description="This text will be show on deliverable or impact target table for view documents menu"
						/>
					</MenuItem>
				)}
			</Menu>
			{subTargetData && (
				<SubTarget
					open={subTargetData !== null}
					handleClose={() => {
						setsubTargetData(null);
						setOpenDeleteDeliverableLineItem(false);
					}}
					formAction={FORM_ACTIONS.UPDATE}
					formType={tableType}
					data={subTargetData}
					reftechOnSuccess={refetch}
					dialogType={
						openDeleteDeliverableLineItem ? DIALOG_TYPE.DELETE : DIALOG_TYPE.FORM
					}
				/>
			)}
			{openAttachFiles && subTargetFileArray && (
				<AttachFileForm
					{...{
						open: openAttachFiles,
						handleClose: () => setOpenAttachFiles(false),
						filesArray: subTargetFileArray,
						setFilesArray: setSubTargetFileArray,
						// parentOnSave: attachFileOnSave,
						uploadApiConfig: {
							ref: "deliverable-tracking-lineitem",
							refId: subTarget?.id,
							field: "attachments",
							path: `org-${dashBoardData?.organization?.id}/project-${dashBoardData?.project?.id}/deliverable-tracking-lineitem`,
						},
						parentOnSuccessCall: () => {
							if (refetch) refetch();
							setSubTargetFileArray([]);
						},
					}}
				/>
			)}
			{openForm && tableType === "budget" && (
				<BudgetLineitem
					formAction={FORM_ACTIONS.CREATE}
					open={openForm}
					targetId={subTargetData?.id}
					initialValues={initialValues1}
					handleClose={() => setOpenForm(!openForm)}
				/>
			)}
		</>
	);
}

const mapIdToName = (
	arr: { id: string; name: string }[],
	initialObject: { [key: string]: string }
) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		initialObject
	);
};

let financialYearOrgHash: { [key: string]: string } = {};
let financialYearDonorHash: { [key: string]: string } = {};
let annualYearHash: { [key: string]: string } = {};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] === "string") {
		return chipArray({
			list: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "financial_year_org") {
			return chipArray({
				list: filterListObjectKeyValuePair[1].map((ele) => financialYearOrgHash[ele]),
				name: "fd",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "financial_year_donor") {
			return chipArray({
				list: filterListObjectKeyValuePair[1].map((ele) => financialYearDonorHash[ele]),
				name: "fo",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "annual_year") {
			return chipArray({
				list: filterListObjectKeyValuePair[1].map((ele) => annualYearHash[ele]),
				name: "ay",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

const LineItemTableButton = ({
	targetId,
	tableType,
	donor,
	subTargetId,
}: {
	targetId: string;
	tableType: "deliverable" | "impact" | "budget";
	donor?: any;
	subTargetId?: string;
}) => {
	const [openLineItemTable, setOpenLineItemTable] = useState(false);
	return (
		<>
			<IconButton onClick={() => setOpenLineItemTable(true)}>
				<VisibilityIcon />
			</IconButton>
			{openLineItemTable && (
				<FIDialog
					{...{
						open: openLineItemTable,
						handleClose: () => setOpenLineItemTable(false),
						header: tableType === "budget" ? "Expenditures" : "Achievements",
					}}
				>
					{tableType === "budget" && (
						<BudgetLineItemTable
							budgetTargetId={targetId}
							donor={donor}
							subTargetId={subTargetId}
						/>
					)}
					{tableType === "deliverable" && (
						<DeliverablesTrackLineTable deliverableTargetId={targetId} />
					)}
					{tableType === "impact" && <ImpactTrackLineTable impactTargetId={targetId} />}
				</FIDialog>
			)}
		</>
	);
};

export default function SubTargetTable({
	targetId,
	tableType,
	donor,
}: {
	targetId: string;
	tableType: "deliverable" | "impact" | "budget";
	donor?: any;
}) {
	const [TracklinePage, setTracklinePage] = React.useState(0);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		timeperiod_start: "",
		timeperiod_end: "",
		target_value: "",
		donor: [],
		financial_year_org: [],
		financial_year_donor: [],
		grant_periods_project: [],
		annual_year: [],
	});
	const [queryFilter, setQueryFilter] = useState({});

	const dashBoardData = useDashBoardData();

	const [yearTagsLists, setYearTagsLists] = useState<{
		annualYear: any;
		financialYear: any;
	}>({
		annualYear: [],
		financialYear: [],
	});
	const { data: yearTags } = useQuery(GET_YEARTAGS, {
		onError: (err) => {
			console.log("err", err);
		},
	});

	useEffect(() => {
		let yearTagsListsObj: {
			annualYear: YearTagPayload[];
			financialYear: YearTagPayload[];
		} = {
			annualYear: [],
			financialYear: [],
		};
		yearTags?.yearTags?.forEach((elem: YearTagPayload) => {
			if (elem.type === "annual") {
				yearTagsListsObj.annualYear.push(elem);
			} else if (elem.type === "financial") {
				yearTagsListsObj.financialYear.push(elem);
			}
		});
		setYearTagsLists(yearTagsListsObj);
	}, [yearTags]);

	const getSubTargetFindQuery = () =>
		tableType === "budget"
			? GET_BUDGET_SUB_TARGETS
			: tableType === "deliverable"
			? GET_DELIVERABLE_SUB_TARGETS
			: tableType === "impact"
			? GET_IMPACT_SUB_TARGETS
			: GET_DELIVERABLE_SUB_TARGETS;

	const getSubTargetCountQuery = () =>
		tableType === "budget"
			? GET_BUDGET_SUB_TARGETS_COUNT
			: tableType === "deliverable"
			? GET_DELIVERABLE_SUB_TARGETS_COUNT
			: tableType === "impact"
			? GET_IMPACT_SUB_TARGETS_COUNT
			: GET_DELIVERABLE_SUB_TARGETS_COUNT;

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		if (yearTagsLists?.annualYear?.length) {
			budgetSubTargetForm[6].optionsArray = yearTagsLists?.annualYear;
			annualYearHash = mapIdToName(yearTagsLists?.annualYear, annualYearHash);
		}
		if (yearTagsLists?.financialYear?.length) {
			budgetSubTargetForm[4].optionsArray = yearTagsLists?.financialYear;
			financialYearDonorHash = mapIdToName(
				yearTagsLists?.financialYear,
				financialYearDonorHash
			);
			budgetSubTargetForm[5].optionsArray = yearTagsLists?.financialYear;
			financialYearOrgHash = mapIdToName(yearTagsLists?.financialYear, financialYearOrgHash);
		}
	}, [yearTagsLists]);

	useEffect(() => {
		setQueryFilter({
			[getTargetId(tableType)]: targetId,
		});
	}, [targetId]);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && !Array.isArray(filterList[key])) {
					newFilterListObject[key] = filterList[key];
				}
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				[getTargetId(tableType)]: targetId,
				...newFilterListObject,
			});
		}
	}, [filterList, targetId]);

	const handleDeliverableLineChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > TracklinePage) {
			changePage();
		} else {
			changePage(true);
		}
		setTracklinePage(newPage);
	};

	let {
		count,
		queryData: subTargetData,
		changePage,
		countQueryLoading,
		queryLoading: loading,
		queryRefetch,
		countRefetch,
	} = pagination({
		query: getSubTargetFindQuery(),
		countQuery: getSubTargetCountQuery(),
		countFilter: queryFilter,
		queryFilter,
		aggregateCount: true,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});
	const limit = 10;
	const [rows, setRows] = useState<any>([]);
	const { refetchOnDeliverableLineItemImport } = useRefetchOnDeliverableLineItemImport(targetId);

	const financialYearFindAccess = userHasAccess(
		MODULE_CODES.FINANCIAL_YEAR,
		FINANCIAL_YEAR_ACTIONS.FIND_FINANCIAL_YEAR
	);

	const annualYearFindAccess = userHasAccess(
		MODULE_CODES.ANNUAL_YEAR,
		ANNUAL_YEAR_ACTIONS.FIND_ANNUAL_YEAR
	);

	const deliverableTracklineImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM,
		DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS.DELIVERABLE_TRACKING_LINE_ITEM_IMPORT_FROM_CSV
	);
	const deliverableTracklineExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM,
		DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS.DELIVERABLE_TRACKING_LINE_ITEM_EXPORT
	);
	const getListObjectKey = () =>
		tableType === "budget"
			? "budgetSubTargets"
			: tableType === "deliverable"
			? "deliverableSubTargets"
			: tableType === "impact"
			? "deliverableSubTargets"
			: "budgetSubTargets";

	useEffect(() => {
		if (subTargetData?.[getListObjectKey()]?.length) {
			let subTargetList = subTargetData[getListObjectKey()];
			let arr = [];
			for (let i = 0; i < subTargetList.length; i++) {
				if (subTargetList[i]) {
					let row = [
						<TableCell component="td" scope="row" key={subTargetList[i]?.id}>
							{TracklinePage * limit + i + 1}
						</TableCell>,
						<TableCell
							key={subTargetList[i]?.target_value + `${subTargetList[i]?.id}-1`}
						>
							{subTargetList[i]?.target_value}
						</TableCell>,
						<TableCell
							key={
								getTodaysDate(subTargetList[i]?.timeperiod_start) +
								`${subTargetList[i]?.id}-1`
							}
						>
							<div>
								{require("moment")(
									getTodaysDate(subTargetList[i]?.timeperiod_start)
								).format("MMM d, YY") +
									" - " +
									require("moment")(
										getTodaysDate(subTargetList[i]?.timeperiod_end)
									).format("MMM d, YY")}
							</div>
						</TableCell>,

						<TableCell
							key={
								subTargetList[i]?.financial_year_donor?.name +
								`${subTargetList[i]?.id}-2`
							}
						>
							<Box display="flex">
								<Box mr={1}>
									<Chip
										avatar={
											<Avatar
												style={{
													width: "30px",
													height: "30px",
												}}
											>
												<span>{"FYO"}</span>
											</Avatar>
										}
										label={subTargetList[i]?.financial_year_org?.name}
										size="small"
										color="primary"
									/>
								</Box>
								<Box mr={1}>
									<Chip
										avatar={
											<Avatar
												style={{
													width: "30px",
													height: "30px",
												}}
											>
												<span>{"FYD"}</span>
											</Avatar>
										}
										label={subTargetList[i]?.financial_year_donor?.name}
										size="small"
										color="primary"
									/>
								</Box>
								<Box mr={1}>
									<Chip
										avatar={
											<Avatar
												style={{
													width: "30px",
													height: "30px",
												}}
											>
												<span>{"AY"}</span>
											</Avatar>
										}
										label={subTargetList[i]?.annual_year?.name}
										size="small"
										color="primary"
									/>
								</Box>
							</Box>
						</TableCell>,
						<TableCell
							key={subTargetList[i]?.donor?.name + `${subTargetList[i]?.id}-3`}
						>
							<Chip
								label={
									subTargetList[i]?.donor?.name +
									" - " +
									subTargetList[i]?.grant_periods_project?.name
								}
								size="small"
								color="primary"
							/>
						</TableCell>,
						<TableCell
							key={
								subTargetList[i]?.grant_periods_project?.name +
								`${subTargetList[i]?.id}-5`
							}
						>
							<LineItemTableButton
								{...{
									tableType,
									donor,
									targetId,
									subTargetId: subTargetList[i]?.id,
								}}
							/>
						</TableCell>,
					];
					row.push(
						<EditSubTarget
							key={subTargetList[i]}
							subTarget={subTargetList[i]}
							refetch={queryRefetch}
							tableType={tableType}
						/>
					);
					arr.push(row);
				}
			}
			setRows(arr);
		} else {
			setRows([]);
		}
	}, [subTargetData, annualYearFindAccess, financialYearFindAccess, TracklinePage]);

	interface ITableHeadings {
		label: string;
		keyMapping?: string;
		renderComponent?: () => React.ReactNode;
	}

	const filteredDeliverableTracklineTableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(deliverableAndimpactTracklineHeading, {
				[tableHeaders.year]: !annualYearFindAccess && !financialYearFindAccess,
			}),
		[annualYearFindAccess, financialYearFindAccess]
	);

	let deliverableTracklineTablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			count={count}
			rowsPerPage={count > limit ? limit : count}
			page={TracklinePage}
			onChangePage={handleDeliverableLineChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);
	const intl = useIntl();

	const theme = useTheme();
	const { jwt } = useAuth();

	subTargetTableHeadings[subTargetTableHeadings.length - 1].renderComponent = () => (
		<>
			<FilterList
				initialValues={{
					timeperiod_start: "",
					timeperiod_end: "",
					target_value: "",
					donor: [],
					financial_year_org: [],
					financial_year_donor: [],
					grant_periods_project: [],
					annual_year: [],
				}}
				setFilterList={setFilterList}
				inputFields={budgetSubTargetForm}
			/>
		</>
	);

	return (
		<>
			{countQueryLoading ? <FullScreenLoader /> : null}
			{loading ? <FullScreenLoader /> : null}
			<Grid container>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			<FITable
				tableHeading={subTargetTableHeadings}
				rows={rows}
				pagination={deliverableTracklineTablePagination}
				order={order}
				orderBy={orderBy}
				setOrder={setOrder}
				setOrderBy={setOrderBy}
				noRowHeading={intl.formatMessage({
					id: `noSubTargetHeading`,
					defaultMessage: `No Sub Targets Found`,
					description: `This text will be shown if no target found for table`,
				})}
				rowHeading={intl.formatMessage({
					id: `subTargetHeading`,
					defaultMessage: `Sub Targets`,
					description: `This text will be shown for description of table`,
				})}
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Deliverable Lineitem"
						tableExportUrl={`${DELIVERABLE_LINE_ITEM_PROJECTS_TABLE_EXPORT}/${targetId}`}
						tableImportUrl={`${DELIVERABLE_LINE_ITEM_PROJECTS_TABLE_IMPORT}/${targetId}`}
						onImportTableSuccess={() => {
							countRefetch?.().then(() => queryRefetch?.());
							refetchOnDeliverableLineItemImport();
						}}
						importButtonOnly={importButtonOnly}
						hideImport={!deliverableTracklineImportFromCsvAccess}
						hideExport={!deliverableTracklineExportAccess}
					>
						<>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1) }}
								onClick={() =>
									exportTable({
										tableName: "Financial Year",
										jwt: jwt as string,
										tableExportUrl: `${FINANCIAL_YEAR_EXPORT}/${dashBoardData?.organization?.country?.id}`,
									})
								}
							>
								Financial Year
							</Button>
							<Button
								onClick={() =>
									exportTable({
										tableName: "Annual Year",
										jwt: jwt as string,
										tableExportUrl: ANNUAL_YEAR_EXPORT,
									})
								}
								style={{ marginRight: theme.spacing(1) }}
								variant="outlined"
							>
								Annual Year
							</Button>
							<Button
								onClick={() =>
									exportTable({
										tableName: "Deliverable Trackline Template",
										jwt: jwt as string,
										tableExportUrl: `${DELIVERABLE_LINE_ITEM_PROJECTS_TABLE_EXPORT}/${targetId}?header=true`,
									})
								}
								style={{ marginRight: theme.spacing(1), float: "right" }}
								variant="outlined"
							>
								Sub Target Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			/>
		</>
	);
}
