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
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";
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

function EditDeliverableTargetIcon({ deliverableTarget }: { deliverableTarget: any }) {
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [targetLineDialog, setTargetLineDialog] = useState<boolean>();
	const [targetData, setTargetData] = useState<IDeliverableTarget | null>();
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setMenuAnchor(null);
	};

	return (
		<>
			<TableCell>
				<IconButton aria-label="delete" onClick={handleMenuClick}>
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
				<MenuItem
					onClick={() => {
						setTargetData({
							id: deliverableTarget.id,
							name: deliverableTarget.name,
							target_value: deliverableTarget.target_value,
							description: deliverableTarget.description,
							deliverableCategory:
								deliverableTarget.deliverable_category_unit
									?.deliverable_category_org?.id,
							deliverableUnit:
								deliverableTarget.deliverable_category_unit?.deliverable_units_org
									?.id,
							deliverable_category_unit:
								deliverableTarget.deliverable_category_unit.id,
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
				<MenuItem
					onClick={() => {
						handleMenuClose();
						setTargetLineDialog(true);
					}}
				>
					<FormattedMessage
						id="reportAchievementMenu"
						defaultMessage="Report Achievement"
						description="This text will be show on deliverable or impact target table for report achievement menu"
					/>
				</MenuItem>
			</Menu>
			{targetData && (
				<DeliverableTarget
					open={targetData !== null}
					handleClose={() => setTargetData(null)}
					type={DELIVERABLE_ACTIONS.UPDATE}
					data={targetData}
					project={deliverableTarget.project.id}
				/>
			)}
			{targetLineDialog && (
				<DeliverableTrackLine
					open={targetLineDialog}
					handleClose={() => setTargetLineDialog(false)}
					type={DELIVERABLE_ACTIONS.CREATE}
					deliverableTarget={deliverableTarget.id}
				/>
			)}
		</>
	);
}

function DeliverableTargetAchievementAndProgress({
	deliverableTargetId,
	deliverableTargetValue,
	deliverableTargetUnit,
}: {
	deliverableTargetId: string;
	deliverableTargetValue: number;
	deliverableTargetUnit: string;
}) {
	const { data } = useQuery(GET_ACHIEVED_VALLUE_BY_TARGET, {
		variables: { filter: { deliverableTargetProject: deliverableTargetId } },
	});
	const [DeliverableTargetAchieved, setDeliverableTargetAchieved] = useState<number>();
	const [DeliverableTargetProgess, setDeliverableTargetProgess] = useState<string>();

	useEffect(() => {
		if (data) {
			setDeliverableTargetAchieved(data.deliverableTrackingTotalValue);
			setDeliverableTargetProgess(
				((data.deliverableTrackingTotalValue / deliverableTargetValue) * 100).toFixed(2)
			);
		}
	}, [data, deliverableTargetValue]);
	return (
		<>
			<TableCell>{`${DeliverableTargetAchieved} ${deliverableTargetUnit}`}</TableCell>
			<TableCell>{DeliverableTargetProgess} %</TableCell>
		</>
	);
}

const mapIdToName = (arr: { id: string; name: string }[], initialObject: { [key: string]: string }) => {
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

export default function DeliverablesTable() {
	const dashboardData = useDashBoardData();
	const [page, setPage] = React.useState(0);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		target_value: "",
		deliverable_category_org: [],
	});

	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});

	useEffect(() => {
		if (deliverableCategories) {
			deliverableTargetInputFields[2].optionsArray =
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
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		setQueryFilter({
			project: dashboardData?.project?.id,
		});
	}, [dashboardData]);

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
				if (filterList.deliverable_category_org.length) {
					filter.deliverable_category_unit = {
						deliverable_category_org: filterList.deliverable_category_org as string[],
					};
				}
				return filter;
			});
		}
	}, [filterList, dashboardData]);

	let {
		count,
		queryData: deliverableTargetData,
		changePage,
		countQueryLoading,
		queryLoading,
	} = pagination({
		query: GET_DELIVERABLE_TARGET_BY_PROJECT,
		countQuery: GET_DELIVERABLE_TARGETS_COUNT,
		countFilter: queryFilter,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	const [rows, setRows] = useState<any>([]);
	const limit = 10;
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
					<DeliverableTracklineTable deliverableTargetId={deliverableTargetList[i].id} />
				);

				if (deliverableTargetList[i].deliverable_category_unit) {
					let column = [
						<TableCell component="td" scope="row" key={deliverableTargetList[i]?.id}>
							{page * limit + i + 1}
						</TableCell>,
						<TableCell
							key={
								deliverableTargetList[i].name + `${deliverableTargetList[i]?.id}-1`
							}
						>
							{deliverableTargetList[i].name}
						</TableCell>,
						<TableCell
							key={
								deliverableTargetList[i].deliverable_category_unit
									.deliverable_category_org.name +
								`${deliverableTargetList[i]?.id}-2`
							}
						>
							{
								deliverableTargetList[i].deliverable_category_unit
									.deliverable_category_org.name
							}
						</TableCell>,
						<TableCell
							key={
								deliverableTargetList[i].target_value +
								`${deliverableTargetList[i]?.id}-3`
							}
						>
							{`${deliverableTargetList[i].target_value} ${deliverableTargetList[i].deliverable_category_unit.deliverable_units_org.name}
							`}
						</TableCell>,
					];

					// Columsn
					column.push(
						<DeliverableTargetAchievementAndProgress
							key={Math.random()}
							deliverableTargetId={deliverableTargetList[i].id}
							deliverableTargetValue={deliverableTargetList[i].target_value}
							deliverableTargetUnit={
								deliverableTargetList[i].deliverable_category_unit
									.deliverable_units_org.name
							}
						/>
					);

					// Action Columns
					column.push(
						<EditDeliverableTargetIcon
							key={Math.random()}
							deliverableTarget={deliverableTargetList[i]}
						/>
					);
					row.column = column;
					array.push(row);
				}
			}

			setRows(array);
		} else {
			setRows([]);
		}
	}, [deliverableTargetData]);

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
	return (
		<>
			{countQueryLoading || queryLoading ? (
				<TableSkeleton />
			) : (
				<>
					<Grid container>
						<Grid item xs={11}>
							<Box my={2} display="flex" flexWrap="wrap">
								{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
									createChipArray({
										filterListObjectKeyValuePair,
										removeFilterListElements,
									})
								)}
							</Box>
						</Grid>
						<Grid item xs={1}>
							<Box mt={2}>
								<FilterList
									initialValues={{
										name: "",
										target_value: "",
										deliverable_category_org: [],
									}}
									setFilterList={setFilterList}
									inputFields={deliverableTargetInputFields}
								/>
							</Box>
						</Grid>
					</Grid>
					<FICollaspeTable
						order={order}
						orderBy={orderBy}
						setOrder={setOrder}
						setOrderBy={setOrderBy}
						tableHeading={deliverableHeadings}
						rows={rows}
						pagination={deliverableTablePagination}
					/>
				</>
			)}
		</>
	);
}
