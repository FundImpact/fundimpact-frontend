import { useQuery } from "@apollo/client";
import {
	IconButton,
	Menu,
	MenuItem,
	TableCell,
	TablePagination,
	Box,
	Grid,
	Chip,
	Avatar,
	Button,
	useTheme,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	GET_DELIVERABLE_TARGETS_COUNT,
} from "../../../graphql/Deliverable/target";
import pagination from "../../../hooks/pagination/pagination";
import { IDeliverableTarget } from "../../../models/deliverable/deliverableTarget";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import DeliverableTarget from "../../Deliverable/DeliverableTarget";
import DeliverableTrackLine from "../../Deliverable/DeliverableTrackline";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import { deliverableHeadings } from "../constants";
import FICollaspeTable from "../FICollapseTable";
import DeliverableTracklineTable from "./DeliverableTrackLine";
import FilterList from "../../FilterList";
import { deliverableTargetInputFields } from "./inputFields.json";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../graphql/Deliverable/category";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_TARGET_ACTIONS } from "../../../utils/access/modules/deliverableTarget/actions";
import { DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/deliverableTrackingLineItem/actions";
import {
	getFetchPolicy,
	getOptionFromTargetValueOptions,
	removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows,
} from "../../../utils";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { ITableHeadings } from "../../../models";
import { useDialogDispatch } from "../../../contexts/DialogContext";
import { setCloseDialog, setOpenDialog } from "../../../reducers/dialogReducer";
import { FormatListBulleted } from "@material-ui/icons";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	DELIVERABLE_CATEGORY_TABLE_EXPORT,
	DELIVERABLE_CATEGORY_UNIT_EXPORT,
	DELIVERABLE_TARGET_PROJECTS_TABLE_EXPORT,
	DELIVERABLE_TARGET_PROJECTS_TABLE_IMPORT,
	DELIVERABLE_UNIT_TABLE_EXPORT,
} from "../../../utils/endpoints.util";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { DELIVERABLE_TYPE, DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { useRefetchOnDeliverableTargetImport } from "../../../hooks/deliverable";
import SubTargetTable from "../SubTarget";
import SubTarget from "../../Forms/SubTargetForm";
import {
	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
	GET_DELIVERABLE_TRACKLINE_COUNT,
} from "../../../graphql/Deliverable/trackline";
import {
	GET_DELIVERABLE_SUB_TARGETS,
	GET_DELIVERABLE_SUB_TARGETS_COUNT,
} from "../../../graphql/Deliverable/subTarget";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import RemoveOutlinedIcon from "@material-ui/icons/RemoveOutlined";
import ShowChartOutlinedIcon from "@material-ui/icons/ShowChartOutlined";
import AssessmentIcon from "@material-ui/icons/Assessment";
enum tableHeaders {
	name = 2,
	category = 3,
	target = 4,
	achieved = 5,
	progress = 6,
}

enum tableColumn {
	name = 1,
	category = 2,
	target = 3,
	achievedAndProgress = 4,
}

const chipArray = ({
	removeChip,
	name,
	list,
}: {
	removeChip: (index: number) => void;
	list: string[];
	name: string;
}) => {
	return list.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

const EditDeliverableTargetIcon = ({ deliverableTarget }: { deliverableTarget: any }) => {
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [targetLineDialog, setTargetLineDialog] = useState<boolean>();
	const [targetData, setTargetData] = useState<IDeliverableTarget | null>();
	const [openDeleteDeliverableTarget, setOpenDeleteDeliverableTarget] = useState(false);
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setMenuAnchor(null);
	};
	const dialogDispatch = useDialogDispatch();
	const deliverableTragetEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.UPDATE_DELIVERABLE_TARGET
	);
	const deliverableTragetDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.DELETE_DELIVERABLE_TARGET
	);

	const deliverableTracklineCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM,
		DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS.CREATE_DELIVERABLE_TRACKING_LINE_ITEM
	);

	useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: {
			filter: { id: deliverableTarget.id },
		},
		fetchPolicy: getFetchPolicy(),
	});

	useEffect(() => {
		if (targetLineDialog)
			dialogDispatch(
				setOpenDialog(
					<SubTarget
						open={targetLineDialog}
						handleClose={() => {
							setTargetLineDialog(false);
							dialogDispatch(setCloseDialog());
						}}
						formAction={FORM_ACTIONS.CREATE}
						formType={deliverableTarget?.type || DELIVERABLE_TYPE.DELIVERABLE}
						target={deliverableTarget.id}
						qualitativeParent={deliverableTarget?.is_qualitative || false}
						targetValueOptions={
							deliverableTarget?.value_qualitative_option?.options || []
						}
					/>
				)
			);
	}, [deliverableTarget, targetLineDialog]);

	let value_qualitative_option_string = "";
	deliverableTarget?.value_qualitative_option?.options.forEach(
		(elem: { id: string; name: string }, index: number) => {
			value_qualitative_option_string =
				value_qualitative_option_string +
				`${elem?.name || "-"}${
					index != deliverableTarget?.value_qualitative_option?.options?.length - 1
						? ","
						: ""
				}`;
		}
	);

	return (
		<>
			<TableCell>
				<IconButton
					style={{
						visibility:
							deliverableTragetEditAccess ||
							deliverableTracklineCreateAccess ||
							deliverableTragetDeleteAccess
								? "visible"
								: "hidden",
					}}
					aria-label="delete"
					onClick={handleMenuClick}
				>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
			<Menu
				id="deliverable-target-simple-menu"
				anchorEl={menuAnchor}
				keepMounted
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
			>
				{deliverableTragetEditAccess && (
					<MenuItem
						onClick={() => {
							setTargetData({
								id: deliverableTarget.id,
								name: deliverableTarget.name,
								description: deliverableTarget.description,
								deliverable_category_org:
									deliverableTarget?.deliverable_category_org?.id,
								deliverable_unit_org: deliverableTarget?.deliverable_unit_org?.id,
								is_qualitative: deliverableTarget?.is_qualitative,
								value_calculation: deliverableTarget?.value_calculation,
								value_qualitative_option: value_qualitative_option_string,
								project: deliverableTarget.project.id,
							});
							handleMenuClose();
						}}
					>
						<FormattedMessage
							id="editTargetMenu"
							defaultMessage="Edit Target"
							description="This text will be show on deliverable or impact target table for edit target menu"
						/>
					</MenuItem>
				)}
				{/* Change This to Deliverable Sub Target Access */}
				{deliverableTracklineCreateAccess && (
					<MenuItem
						onClick={() => {
							setTargetLineDialog(true);
							handleMenuClose();
						}}
						disabled={!deliverableTarget?.sub_target_required}
					>
						<FormattedMessage
							id="addSubTarget"
							defaultMessage="Add Sub Target"
							description="This text will be show on deliverable or impact target table for add Subtarget menu"
						/>
					</MenuItem>
				)}
				{/* {deliverableTracklineCreateAccess && (
					<MenuItem
						onClick={() => {
							setTargetLineDialog(true);
							handleMenuClose();
						}}
					>
						<FormattedMessage
							id="reportAchievementMenu"
							defaultMessage="Report Achievement"
							description="This text will be show on deliverable or impact target table for report achievement menu"
						/>
					</MenuItem>
				)} */}
				{deliverableTragetDeleteAccess && (
					<MenuItem
						onClick={() => {
							setTargetData({
								id: deliverableTarget.id,
								name: deliverableTarget.name,
								description: deliverableTarget.description,
								deliverable_category_org:
									deliverableTarget?.deliverable_category_org?.id,
								deliverable_unit_org: deliverableTarget?.deliverable_unit_org?.id,
								is_qualitative: deliverableTarget?.is_qualitative,
								value_calculation: deliverableTarget?.value_calculation,
								value_qualitative_option: value_qualitative_option_string,
								project: deliverableTarget.project.id,
							});
							handleMenuClose();
							setOpenDeleteDeliverableTarget(true);
						}}
					>
						<FormattedMessage
							id="deleteDeliverableTarget"
							defaultMessage="Delete Deliverable Target"
						/>
					</MenuItem>
				)}
			</Menu>
			{targetData && (
				<DeliverableTarget
					open={targetData !== null}
					handleClose={() => {
						setTargetData(null);
						setOpenDeleteDeliverableTarget(false);
					}}
					type={DELIVERABLE_ACTIONS.UPDATE}
					formType={deliverableTarget.type}
					data={targetData}
					project={deliverableTarget.project.id}
					dialogType={openDeleteDeliverableTarget ? DIALOG_TYPE.DELETE : DIALOG_TYPE.FORM}
					value_qualitative_option={
						deliverableTarget?.value_qualitative_option?.options || []
					}
				/>
			)}
		</>
	);
};

function DeliverableTargetAchievementAndProgress({
	deliverableTargetId,
	deliverableTargetUnit,
	project,
	qualitativeParent,
	targetValueOptions,
}: {
	deliverableTargetId: string;
	deliverableTargetUnit: string;
	project: string | number;
	qualitativeParent?: boolean;
	targetValueOptions?: { id: string; name: string }[];
}) {
	const { data } = useQuery(GET_DELIVERABLE_TRACKLINE_COUNT, {
		variables: {
			filter: {
				deliverable_sub_target: {
					deliverable_target_project: deliverableTargetId,
					project,
				},
			},
		},
		skip: qualitativeParent,
	});

	const { data: deliverableSubTargetCount } = useQuery(GET_DELIVERABLE_SUB_TARGETS_COUNT, {
		variables: {
			filter: {
				deliverable_target_project: deliverableTargetId,
				project,
			},
		},
		skip: qualitativeParent,
	});

	const { data: deliverableSubTargets } = useQuery(GET_DELIVERABLE_SUB_TARGETS, {
		variables: {
			filter: {
				deliverable_target_project: deliverableTargetId,
				project,
			},
			sort: "created_at:DESC",
		},
		skip: !qualitativeParent,
	});

	const { data: deliverableTrackingLineitems } = useQuery(
		GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
		{
			variables: {
				filter: {
					deliverable_sub_target: {
						deliverable_target_project: deliverableTargetId,
						project,
					},
				},
				sort: "created_at:DESC",
			},
			skip: !qualitativeParent,
		}
	);

	const [DeliverableTargetAchieved, setDeliverableTargetAchieved] = useState<number>();
	const [DeliverableTargetProgess, setDeliverableTargetProgess] = useState<string>();

	useEffect(() => {
		if (data && deliverableSubTargetCount) {
			let deliverableTargetTotalAmount =
				deliverableSubTargetCount?.deliverableSubTargetsConnection?.aggregate?.sum
					?.target_value || 0;
			setDeliverableTargetAchieved(
				data.deliverableTrackingLineitemsConnection?.aggregate?.sum?.value || 0
			);
			setDeliverableTargetProgess(
				(
					((data.deliverableTrackingLineitemsConnection?.aggregate?.sum?.value || 0) /
						deliverableTargetTotalAmount) *
					100
				).toFixed(2)
			);
		}
	}, [data, deliverableSubTargetCount]);

	const deliverableAchievedFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.DELIVERABLE_ACHIEVED
	);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);

	return (
		<>
			{qualitativeParent ? (
				<>
					<TableCell>
						<Chip
							icon={<AssessmentIcon fontSize="small" />}
							label={
								deliverableSubTargets?.deliverableSubTargets?.[0]
									?.target_value_qualitative && targetValueOptions
									? getOptionFromTargetValueOptions(
											targetValueOptions,
											deliverableSubTargets?.deliverableSubTargets?.[0]
												?.target_value_qualitative
									  )
									: "-"
							}
							color="primary"
							size="small"
						/>
					</TableCell>
					{deliverableAchievedFindAccess && (
						<TableCell>
							<Chip
								icon={<AddOutlinedIcon fontSize="small" />}
								label={
									deliverableTrackingLineitems?.deliverableTrackingLineitems?.[0]
										?.value_qualitative && targetValueOptions
										? getOptionFromTargetValueOptions(
												targetValueOptions,
												deliverableTrackingLineitems
													?.deliverableTrackingLineitems?.[0]
													?.value_qualitative
										  )
										: "-"
								}
								color="primary"
								size="small"
							/>
						</TableCell>
					)}
					<TableCell>-</TableCell>
				</>
			) : (
				<>
					<TableCell>
						<Chip
							icon={<AssessmentIcon fontSize="small" />}
							label={`${
								deliverableSubTargetCount?.deliverableSubTargetsConnection
									?.aggregate?.sum?.target_value || 0
							} ${deliverableTargetUnit}`}
							color="primary"
							size="small"
						/>
					</TableCell>
					{deliverableAchievedFindAccess && (
						<TableCell>
							<Chip
								icon={<AddOutlinedIcon fontSize="small" />}
								label={`${DeliverableTargetAchieved} ${
									deliverableUnitFindAccess ? deliverableTargetUnit : ""
								}`}
								color="primary"
								size="small"
							/>
						</TableCell>
					)}
					<TableCell>
						<Chip
							icon={<ShowChartOutlinedIcon fontSize="small" />}
							label={`${DeliverableTargetProgess} %`}
							color="primary"
							size="small"
						/>
					</TableCell>
				</>
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

let deliverableCategoryHash: { [key: string]: string } = {};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	console.log("filterListObjectKeyValuePair", filterListObjectKeyValuePair);
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArray({
			list: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "deliverable_category_org") {
			return chipArray({
				list: filterListObjectKeyValuePair[1].map((ele) => deliverableCategoryHash[ele]),
				name: "dc",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

const getTableHeadingByDeliverableTracklineAccess = (
	headings: ITableHeadings[],
	collapseTableAccess: boolean
) => (collapseTableAccess ? headings : headings.slice(1));

const getDefaultFilterList = () => ({
	name: "",
	deliverable_category_org: [],
});

export default function DeliverablesTable({
	type = DELIVERABLE_TYPE.DELIVERABLE,
}: {
	type?: DELIVERABLE_TYPE;
}) {
	const dashboardData = useDashBoardData();
	const [page, setPage] = React.useState(0);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<any>(getDefaultFilterList());

	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});

	const deliverableTracklineFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM,
		DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS.FIND_DELIVERABLE_TRACKING_LINE_ITEM
	);

	useEffect(() => {
		if (deliverableCategories) {
			deliverableTargetInputFields[1].optionsArray =
				deliverableCategories.deliverableCategory;
			deliverableCategoryHash = mapIdToName(
				deliverableCategories.deliverableCategory,
				deliverableCategoryHash
			);
		}
	}, [deliverableCategories]);

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > page) {
			changePage();
		} else {
			changePage(true);
		}
		setPage(newPage);
	};

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject: any) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		setQueryFilter({
			project_with_deliverable_targets: {
				project: dashboardData?.project?.id,
			},
			type,
		});
		setFilterList(getDefaultFilterList());
	}, [dashboardData, setFilterList, setQueryFilter]);

	useEffect(() => {
		if (filterList) {
			setQueryFilter(() => {
				let filter:
					| {
							[key: string]:
								| string
								| string[]
								| number
								| undefined
								| { [keyName: string]: string[] };
					  }
					| any = {
					project_with_deliverable_targets: {
						project: dashboardData?.project?.id,
					},
					type,
				};
				if (filterList.name) {
					filter.name = filterList.name;
				}
				// if (filterList.is_qualitative) {
				// 	filter.is_qualitative = filterList.is_qualitative;
				// }
				if (filterList?.deliverable_category_org.length) {
					filter.deliverable_category_org = filterList.deliverable_category_org as string[];
				}
				return filter;
			});
		}
	}, [filterList, dashboardData]);

	const { refetchOnDeliverableTargetImport } = useRefetchOnDeliverableTargetImport();

	let {
		count,
		queryData: deliverableTargetData,
		changePage,
		countQueryLoading,
		queryLoading,
		queryRefetch: refetchDeliverableTargetProject,
		countRefetch: refetchDeliverableTargetProjectCount,
	} = pagination({
		query: GET_DELIVERABLE_TARGET_BY_PROJECT,
		countQuery: GET_DELIVERABLE_TARGETS_COUNT,
		countFilter: queryFilter,
		customFetchPolicy: "network-only",
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	const refetchDeliverableTargetProjectTable = useCallback(() => {
		refetchDeliverableTargetProjectCount?.().then(() => refetchDeliverableTargetProject?.());
		refetchOnDeliverableTargetImport(type);
	}, [refetchDeliverableTargetProjectCount, refetchDeliverableTargetProject]);

	const [rows, setRows] = useState<any>([]);
	const limit = 10;

	const deliverableCategoryFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	const deliverableAchievedFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.DELIVERABLE_ACHIEVED
	);
	const deliverableImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.DELIVERABLE_IMPORT_FROM_CSV
	);
	const deliverableExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.DELIVERABLE_EXPORT
	);

	const theme = useTheme();
	const { jwt } = useAuth();
	useEffect(() => {
		if (
			deliverableTargetData &&
			deliverableTargetData.deliverableTargetList &&
			deliverableTargetData.deliverableTargetList.length
		) {
			let deliverableTargetList = deliverableTargetData.deliverableTargetList;
			let array: { collaspeTable: any; column: any[] }[] = [];
			for (let i = 0; i < deliverableTargetList.length; i++) {
				let row: { collaspeTable: any; column: any[] } = {
					collaspeTable: null,
					column: [],
				};
				row.collaspeTable = (
					// <DeliverableTracklineTable deliverableTargetId={deliverableTargetList[i].id} />
					<SubTargetTable
						targetId={deliverableTargetList[i].id}
						tableType={deliverableTargetList[i].type}
					/>
				);
				let column = [
					<TableCell component="td" scope="row" key={deliverableTargetList[i]?.id}>
						{page * limit + i + 1}
					</TableCell>,
					<TableCell
						key={deliverableTargetList[i].name + `${deliverableTargetList[i]?.id}-1`}
					>
						{deliverableTargetList[i].name}
					</TableCell>,
					<TableCell
						key={
							deliverableTargetList[i]?.deliverable_category_org?.name +
							`${deliverableTargetList[i]?.id}-2`
						}
					>
						{deliverableTargetList[i]?.deliverable_category_org?.name}
					</TableCell>,
				];

				// Columsn
				column.push(
					<DeliverableTargetAchievementAndProgress
						key={Math.random()}
						deliverableTargetId={deliverableTargetList[i].id}
						qualitativeParent={deliverableTargetList[i]?.is_qualitative || false}
						targetValueOptions={
							deliverableTargetList[i]?.value_qualitative_option?.options || []
						}
						deliverableTargetUnit={deliverableTargetList[i]?.deliverable_unit_org?.name}
						project={dashboardData?.project?.id || ""}
					/>
				);

				// Action Columns
				column.push(
					<EditDeliverableTargetIcon
						key={Math.random()}
						deliverableTarget={deliverableTargetList[i]}
					/>
				);

				const filteredDeliverableTableColumns = filterTableHeadingsAndRows(column, {
					[tableColumn.category]: !deliverableCategoryFindAccess,
				});

				row.column = filteredDeliverableTableColumns;
				array.push(row);
			}

			setRows(array);
		} else {
			setRows([]);
		}
	}, [deliverableTargetData, deliverableCategoryFindAccess, page]);

	const filteredDeliverableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(deliverableHeadings, {
				[tableHeaders.category]: !deliverableCategoryFindAccess,
				[tableHeaders.achieved]: !deliverableAchievedFindAccess,
			}),
		[deliverableCategoryFindAccess, deliverableAchievedFindAccess]
	);

	let deliverableTablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			colSpan={9}
			count={count}
			rowsPerPage={count > limit ? limit : count}
			page={page}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);

	filteredDeliverableHeadings[filteredDeliverableHeadings.length - 1].renderComponent = () => (
		<>
			<FilterList
				initialValues={{
					name: "",
					deliverable_category_org: [],
				}}
				setFilterList={setFilterList}
				inputFields={deliverableTargetInputFields}
			/>
		</>
	);
	return (
		<>
			{countQueryLoading || queryLoading ? (
				<TableSkeleton />
			) : (
				<>
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
					<FICollaspeTable
						order={order}
						orderBy={orderBy}
						setOrder={setOrder}
						setOrderBy={setOrderBy}
						tableHeading={getTableHeadingByDeliverableTracklineAccess(
							filteredDeliverableHeadings,
							deliverableTracklineFindAccess
						)}
						rows={rows}
						pagination={deliverableTablePagination}
						showNestedTable={deliverableTracklineFindAccess}
						tableActionButton={({
							importButtonOnly,
						}: {
							importButtonOnly?: boolean;
						}) => (
							<ImportExportTableMenu
								tableName="Deliverable"
								tableExportUrl={`${DELIVERABLE_TARGET_PROJECTS_TABLE_EXPORT}/${dashboardData?.project?.id}`}
								tableImportUrl={`${DELIVERABLE_TARGET_PROJECTS_TABLE_IMPORT}/${dashboardData?.project?.id}`}
								onImportTableSuccess={refetchDeliverableTargetProjectTable}
								importButtonOnly={importButtonOnly}
								hideExport={!deliverableExportAccess}
								hideImport={!deliverableImportFromCsvAccess}
							>
								<>
									<Button
										variant="outlined"
										style={{ marginRight: theme.spacing(1) }}
										onClick={() =>
											exportTable({
												tableName: "Deliverable category",
												jwt: jwt as string,
												tableExportUrl: `${DELIVERABLE_CATEGORY_TABLE_EXPORT}`,
											})
										}
									>
										Deliverable Category
									</Button>
									<Button
										variant="outlined"
										style={{ marginRight: theme.spacing(1) }}
										onClick={() =>
											exportTable({
												tableName: "Deliverable unit",
												jwt: jwt as string,
												tableExportUrl: `${DELIVERABLE_UNIT_TABLE_EXPORT}`,
											})
										}
									>
										Deliverable Unit
									</Button>
									<Button
										variant="outlined"
										style={{ marginRight: theme.spacing(1), float: "right" }}
										onClick={() =>
											exportTable({
												tableName: "Deliverable Target Template",
												jwt: jwt as string,
												tableExportUrl: `${DELIVERABLE_TARGET_PROJECTS_TABLE_EXPORT}/${dashboardData?.project?.id}?header=true`,
											})
										}
									>
										Deliverable Target Template
									</Button>
								</>
							</ImportExportTableMenu>
						)}
					/>
				</>
			)}
		</>
	);
}
