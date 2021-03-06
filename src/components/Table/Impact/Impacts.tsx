import { useQuery } from "@apollo/client";
import {
	Avatar,
	IconButton,
	Menu,
	MenuItem,
	TableCell,
	TablePagination,
	Grid,
	Box,
	Chip,
	Button,
	useTheme,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState, useMemo, useCallback } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
	GET_IMPACT_TARGETS_COUNT,
} from "../../../graphql/Impact/target";
import { IImpactTarget } from "../../../models/impact/impactTarget";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import ImpactTarget from "../../Impact/impactTarget";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import { ImpactHeadings } from "../constants";
import FICollaspeTable from "../FICollapseTable";
import ImpactTrackLineTable from "./impactTrackline";
import pagination from "../../../hooks/pagination/pagination";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import { FormattedMessage } from "react-intl";
import FilterList from "../../FilterList";
import { impactTargetInputFields } from "./inputFields.json";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { GET_SDG } from "../../../graphql/SDG/query";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { IMPACT_TARGET_ACTIONS } from "../../../utils/access/modules/impactTarget/actions";
import { IMPACT_TRACKING_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/impactTrackingLineItem/actions";
import { IMPACT_CATEGORY_ACTIONS } from "../../../utils/access/modules/impactCategory/actions";
import {
	getFetchPolicy,
	removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows,
} from "../../../utils";
import { IMPACT_UNIT_ACTIONS } from "../../../utils/access/modules/impactUnit/actions";
import { SUSTAINABLE_DEVELOPMENT_GOALS_ACTIONS } from "../../../utils/access/modules/sustainableDevelopmentGoals/actions";
import { ITableHeadings } from "../../../models";
import { useDialogDispatch } from "../../../contexts/DialogContext";
import { setCloseDialog, setOpenDialog } from "../../../reducers/dialogReducer";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	IMPACT_CATEGORY_TABLE_EXPORT,
	IMPACT_UNIT_TABLE_EXPORT,
	IMPACT_TARGET_PROJECTS_TABLE_EXPORT,
	IMPACT_TARGET_PROJECTS_TABLE_IMPORT,
	SUSTAINABLE_DEVELOPMENT_GOALS_EXPORT,
} from "../../../utils/endpoints.util";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { DIALOG_TYPE } from "../../../models/constants";
import { useRefetchOnImpactTargetImport } from "../../../hooks/impact";

enum tableHeaders {
	name = 2,
	category = 3,
	target = 4,
	achieved = 5,
	progress = 6,
	sdg = 7,
}

enum tableColumn {
	name = 1,
	category = 2,
	target = 3,
	achievedAndProgress = 4,
	sdg = 5,
}

const chipArray = ({
	arr,
	name,
	removeChips,
}: {
	arr: string[];
	name: string;
	removeChips: (index: number) => void;
}) => {
	return arr.map((element, index) => (
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
				onDelete={() => removeChips(index)}
			/>
		</Box>
	));
};

function EditImpactTargetIcon({ impactTarget }: { impactTarget: any }) {
	const [impactTargetMenuAnchor, setImpactTargetMenuAnchor] = useState<null | HTMLElement>(null);
	const [impactTargetLineDialog, setImpactTargetLineDialog] = useState<boolean>();
	const [impactTargetData, setImpactTargetData] = useState<IImpactTarget | null>();
	const [openDeleteImpactTargetDialog, setOpenDeleteImpactTargetDialog] = useState(false);
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setImpactTargetMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setImpactTargetMenuAnchor(null);
	};

	const impactTragetEditAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.UPDATE_IMPACT_TARGET
	);
	const impactTragetDeleteAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.DELETE_IMPACT_TARGET
	);

	const impactTracklineCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_TRACKING_LINE_ITEM,
		IMPACT_TRACKING_LINE_ITEM_ACTIONS.CREATE_IMPACT_TRACKING_LINE_ITEM
	);

	useQuery(GET_IMPACT_TARGET_BY_PROJECT, {
		variables: {
			filter: { id: impactTarget.id },
		},
		fetchPolicy: getFetchPolicy(),
	});
	const dialogDispatch = useDialogDispatch();

	useEffect(() => {
		if (impactTargetLineDialog)
			dialogDispatch(
				setOpenDialog(
					<ImpactTrackLine
						open={impactTargetLineDialog}
						handleClose={() => {
							setImpactTargetLineDialog(false);
							dialogDispatch(setCloseDialog());
						}}
						type={IMPACT_ACTIONS.CREATE}
						impactTarget={impactTarget.id}
					/>
				)
			);
	}, [impactTarget, impactTargetLineDialog]);

	return (
		<>
			<TableCell>
				<IconButton
					aria-label="impact-target-edit"
					onClick={handleMenuClick}
					style={{
						visibility:
							impactTragetEditAccess ||
							impactTracklineCreateAccess ||
							impactTragetDeleteAccess
								? "visible"
								: "hidden",
					}}
				>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
			<Menu
				id="impact-target-simple-menu"
				anchorEl={impactTargetMenuAnchor}
				keepMounted
				open={Boolean(impactTargetMenuAnchor)}
				onClose={handleMenuClose}
			>
				{impactTragetEditAccess && (
					<MenuItem
						onClick={() => {
							setImpactTargetData({
								id: impactTarget.id,
								name: impactTarget.name,
								target_value: impactTarget.target_value,
								description: impactTarget.description,
								impact_category_org: impactTarget?.impact_category_org?.id,
								impact_units_org: impactTarget?.impact_units_org?.id,
								sustainable_development_goal:
									impactTarget.sustainable_development_goal?.id,
								project: impactTarget.project.id,
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
				{impactTragetDeleteAccess && (
					<MenuItem
						onClick={() => {
							setImpactTargetData({
								id: impactTarget.id,
								name: impactTarget.name,
								target_value: impactTarget.target_value,
								description: impactTarget.description,
								impact_category_org: impactTarget?.impact_category_org?.id,
								impact_units_org: impactTarget?.impact_units_org?.id,
								sustainable_development_goal:
									impactTarget.sustainable_development_goal?.id,
								project: impactTarget.project.id,
							});
							setOpenDeleteImpactTargetDialog(true);
							handleMenuClose();
						}}
					>
						<FormattedMessage id="deleteTargetMenu" defaultMessage="Delete Target" />
					</MenuItem>
				)}
				{impactTracklineCreateAccess && (
					<MenuItem
						onClick={() => {
							handleMenuClose();
							setImpactTargetLineDialog(true);
						}}
					>
						<FormattedMessage
							id="reportAchievementMenu"
							defaultMessage="Report Achievement"
							description="This text will be show on deliverable or impact target table for report achievement menu"
						/>
					</MenuItem>
				)}
			</Menu>
			{impactTargetData && (
				<ImpactTarget
					open={impactTargetData !== null}
					handleClose={() => {
						setImpactTargetData(null);
						setOpenDeleteImpactTargetDialog(false);
					}}
					type={IMPACT_ACTIONS.UPDATE}
					data={impactTargetData}
					project={impactTarget.project.id}
					dialogType={
						openDeleteImpactTargetDialog ? DIALOG_TYPE.DELETE : DIALOG_TYPE.FORM
					}
				/>
			)}
		</>
	);
}

const getTableHeadingByImpactTracklineAccess = (
	headings: ITableHeadings[],
	collapseTableAccess: boolean
) => (collapseTableAccess ? headings : headings.slice(1));

function ImpactTargetAchievementAndProgress({
	impactTargetId,
	impactTargetValue,
	impactTargetUnit,
}: {
	impactTargetId: string;
	impactTargetValue: number;
	impactTargetUnit: string;
}) {
	const { data } = useQuery(GET_ACHIEVED_VALLUE_BY_TARGET, {
		variables: { filter: { impactTargetProject: impactTargetId } },
	});
	const [impactTargetAchieved, setImpactTargetAchieved] = useState<number>();
	const [impactTargetProgess, setImpactTargetProgess] = useState<string>();
	useEffect(() => {
		if (data) {
			setImpactTargetAchieved(data.impactTrackingSpendValue);
			setImpactTargetProgess(
				((data.impactTrackingSpendValue / impactTargetValue) * 100).toFixed(2)
			);
		}
	}, [data, impactTargetValue]);

	const impactAchievedFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.IMPACT_ACHIEVED
	);

	const impactUnitFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.FIND_IMPACT_UNIT
	);

	return (
		<>
			{impactAchievedFindAccess && (
				<TableCell>{`${impactTargetAchieved} ${
					impactUnitFindAccess ? impactTargetUnit : ""
				}`}</TableCell>
			)}
			<TableCell>{impactTargetProgess} %</TableCell>
		</>
	);
}

let impactCategoryHash: { [key: string]: string } = {};
let sustainableDevelopmentHash: { [key: string]: string } = {};

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

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any[];
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "impact_category_org") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => impactCategoryHash[ele]),
				name: "ic",
				removeChips: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "sustainable_development_goal") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => sustainableDevelopmentHash[ele]),
				name: "sdg",
				removeChips: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArray({
			arr: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChips: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};

const getDefaultFilterList = () => ({
	name: "",
	target_value: "",
	impact_category_org: [],
	sustainable_development_goal: [],
});

export default function ImpactsTable() {
	const dashboardData = useDashBoardData();
	const [rows, setRows] = useState<
		{ collaspeTable: React.ReactNode; column: React.ReactNode[] }[]
	>([]);

	const [impactPage, setImpactPage] = React.useState(0);

	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>(getDefaultFilterList());

	const impactTracklineFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TRACKING_LINE_ITEM,
		IMPACT_TRACKING_LINE_ITEM_ACTIONS.FIND_IMPACT_TRACKING_LINE_ITEM
	);

	const impactCategoryFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.FIND_IMPACT_CATEGORY
	);

	const impactAchievedFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.IMPACT_ACHIEVED
	);
	const impactImportFromCsvAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.IMPACT_CREATE_FROM_CSV
	);
	const impactExportAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.IMPACT_EXPORT
	);

	const sdgFindAccess = userHasAccess(
		MODULE_CODES.SUSTAINABLE_DEVELOPMENT_GOALS,
		SUSTAINABLE_DEVELOPMENT_GOALS_ACTIONS.FIND_SUSTAINABLE_DEVELOPMENT_GOALS
	);

	const { data: categories } = useQuery(GET_IMPACT_CATEGORY_BY_ORG, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});

	const { data: sdgList } = useQuery(GET_SDG);

	useEffect(() => {
		if (categories) {
			impactTargetInputFields[2].optionsArray = categories.impactCategoryOrgList;
			impactCategoryHash = mapIdToName(categories.impactCategoryOrgList, impactCategoryHash);
		}
	}, [categories]);

	useEffect(() => {
		setQueryFilter({
			project: dashboardData?.project?.id,
		});
		setFilterList(getDefaultFilterList());
	}, [dashboardData, setFilterList, setQueryFilter]);

	useEffect(() => {
		if (sdgList) {
			impactTargetInputFields[3].optionsArray = sdgList.sustainableDevelopmentGoalList;
			sustainableDevelopmentHash = mapIdToName(
				sdgList.sustainableDevelopmentGoalList,
				sustainableDevelopmentHash
			);
		}
	}, [sdgList]);

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		if (filterList) {
			setQueryFilter(() => {
				let filter: {
					[key: string]: string | string[] | number | { [keyName: string]: string[] };
				} = {
					project: dashboardData?.project?.id || "",
				};
				if (filterList.name) {
					filter.name = filterList.name;
				}
				if (filterList.target_value) {
					filter.target_value = filterList.target_value;
				}
				if (filterList.sustainable_development_goal.length) {
					filter.sustainable_development_goal = filterList.sustainable_development_goal;
				}
				if (filterList.impact_category_org.length) {
					filter.impact_category_org = filterList?.impact_category_org as string[];
				}
				return filter;
			});
		}
	}, [filterList, dashboardData]);

	let {
		count,
		queryData: impactTargets,
		changePage,
		countQueryLoading,
		queryLoading,
		queryRefetch: refetchImpactTargetProjectList,
		countRefetch: refetchImpactTargetProjectCount,
	} = pagination({
		query: GET_IMPACT_TARGET_BY_PROJECT,
		countQuery: GET_IMPACT_TARGETS_COUNT,
		countFilter: queryFilter,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	const { refetchOnImpactTargetImport } = useRefetchOnImpactTargetImport();

	const refetchImpactTargetProjectTable = useCallback(() => {
		refetchImpactTargetProjectCount?.().then(() => refetchImpactTargetProjectList?.());
		refetchOnImpactTargetImport();
	}, [refetchImpactTargetProjectCount, refetchImpactTargetProjectList]);

	const limit = 10;
	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > impactPage) {
			changePage();
		} else {
			changePage(true);
		}
		setImpactPage(newPage);
	};

	useEffect(() => {
		if (impactTargets) {
			let impactTargetProjectList = impactTargets.impactTargetProjectList;
			let array: { collaspeTable: React.ReactNode; column: React.ReactNode[] }[] = [];
			for (let i = 0; i < impactTargetProjectList.length; i++) {
				let row: { collaspeTable: React.ReactNode; column: React.ReactNode[] } = {
					collaspeTable: null,
					column: [],
				};

				row.collaspeTable = (
					<ImpactTrackLineTable impactTargetId={impactTargetProjectList[i].id} />
				); // row collaspeTable for impact

				let column = [
					<TableCell component="td" scope="row" key={impactTargetProjectList[i]?.id}>
						{impactPage * limit + i + 1}
					</TableCell>,
					<TableCell
						key={
							impactTargetProjectList[i]?.name + `${impactTargetProjectList[i]?.id}-1`
						}
					>
						{impactTargetProjectList[i]?.name}
					</TableCell>,
					<TableCell
						key={
							impactTargetProjectList[i]?.impact_category_org?.name +
							`${impactTargetProjectList[i]?.id}-2`
						}
					>
						{impactTargetProjectList[i]?.impact_category_org?.name}
					</TableCell>,
					<TableCell
						key={
							impactTargetProjectList[i]?.target_value +
							`${impactTargetProjectList[i]?.id}-3`
						}
					>{`${impactTargetProjectList[i]?.target_value} ${impactTargetProjectList[i]?.impact_units_org?.name}`}</TableCell>,
				];
				column.push(
					<ImpactTargetAchievementAndProgress
						key={Math.random()}
						impactTargetId={impactTargetProjectList[i].id}
						impactTargetValue={impactTargetProjectList[i]?.target_value}
						impactTargetUnit={impactTargetProjectList[i]?.impact_units_org?.name}
					/>
				);
				column.push(
					<TableCell key={impactTargetProjectList[i]?.sustainable_development_goal?.id}>
						{impactTargetProjectList[i]?.sustainable_development_goal?.name ? (
							<Avatar
								alt="SD"
								src={impactTargetProjectList[i]?.sustainable_development_goal?.icon}
							/>
						) : (
							"-"
						)}
						{}
					</TableCell>
				);

				column.push(
					<EditImpactTargetIcon
						key={Math.random()}
						impactTarget={impactTargetProjectList[i]}
					/>
				);

				const filteredImpactTableColumns = filterTableHeadingsAndRows(column, {
					[tableColumn.category]: !impactCategoryFindAccess,
					[tableColumn.sdg]: !sdgFindAccess,
				});

				row.column = filteredImpactTableColumns;
				array.push(row);
			}
			setRows(array);
		} else {
			setRows([]);
		}
	}, [impactTargets, impactCategoryFindAccess, sdgFindAccess, impactPage]);

	const filteredImpactHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(ImpactHeadings, {
				[tableHeaders.category]: !impactCategoryFindAccess,
				[tableHeaders.achieved]: !impactAchievedFindAccess,
				[tableHeaders.sdg]: !sdgFindAccess,
			}),
		[impactCategoryFindAccess, impactAchievedFindAccess, sdgFindAccess]
	);

	let impactTablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			colSpan={9}
			count={count}
			rowsPerPage={count > limit ? limit : count}
			page={impactPage}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);

	const theme = useTheme();
	const { jwt } = useAuth();

	filteredImpactHeadings[filteredImpactHeadings.length - 1].renderComponent = () => (
		<>
			<FilterList
				initialValues={{
					name: "",
					target_value: "",
					sustainable_development_goal: [],
					impact_category_org: [],
				}}
				setFilterList={setFilterList}
				inputFields={impactTargetInputFields}
			/>
		</>
	);

	return (
		<>
			{queryLoading || countQueryLoading ? (
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
						rows={rows}
						pagination={impactTablePagination}
						tableHeading={getTableHeadingByImpactTracklineAccess(
							filteredImpactHeadings,
							impactTracklineFindAccess
						)}
						showNestedTable={impactTracklineFindAccess}
						tableActionButton={({
							importButtonOnly,
						}: {
							importButtonOnly?: boolean;
						}) => (
							<ImportExportTableMenu
								tableName="Impact"
								tableExportUrl={`${IMPACT_TARGET_PROJECTS_TABLE_EXPORT}/${dashboardData?.project?.id}`}
								tableImportUrl={`${IMPACT_TARGET_PROJECTS_TABLE_IMPORT}/${dashboardData?.project?.id}`}
								onImportTableSuccess={refetchImpactTargetProjectTable}
								importButtonOnly={importButtonOnly}
								hideImport={!impactImportFromCsvAccess}
								hideExport={!impactExportAccess}
							>
								<>
									<Button
										variant="outlined"
										style={{ marginRight: theme.spacing(1) }}
										onClick={() =>
											exportTable({
												tableName: "Impact category",
												jwt: jwt as string,
												tableExportUrl: IMPACT_CATEGORY_TABLE_EXPORT,
											})
										}
									>
										Impact Category
									</Button>
									<Button
										variant="outlined"
										style={{ marginRight: theme.spacing(1) }}
										onClick={() =>
											exportTable({
												tableName: "Impact unit",
												jwt: jwt as string,
												tableExportUrl: IMPACT_UNIT_TABLE_EXPORT,
											})
										}
									>
										Impact Unit
									</Button>
									<Button
										variant="outlined"
										style={{ marginRight: theme.spacing(1) }}
										onClick={() =>
											exportTable({
												tableName: "Sustainable Development Goals",
												jwt: jwt as string,
												tableExportUrl: SUSTAINABLE_DEVELOPMENT_GOALS_EXPORT,
											})
										}
									>
										Sustainable Development Goals
									</Button>
									<Button
										variant="outlined"
										style={{ marginRight: theme.spacing(1), float: "right" }}
										onClick={() =>
											exportTable({
												tableName: "Impact Target Template",
												jwt: jwt as string,
												tableExportUrl: `${IMPACT_TARGET_PROJECTS_TABLE_EXPORT}/${dashboardData?.project?.id}?header=true`,
											})
										}
									>
										Impact Target Template
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
