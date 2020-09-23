import { useQuery } from "@apollo/client";
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
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";

import {
	GET_DELIVERABLE_LINEITEM_FYDONOR,
	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
	GET_DELIVERABLE_TRACKLINE_COUNT,
} from "../../../graphql/Deliverable/trackline";
import pagination from "../../../hooks/pagination/pagination";
import { IDeliverableTargetLine } from "../../../models/deliverable/deliverableTrackline";
import { getTodaysDate } from "../../../utils";
import FullScreenLoader from "../../commons/GlobalLoader";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import DeliverableTrackline from "../../Deliverable/DeliverableTrackline";
import { deliverableAndimpactTracklineHeading } from "../constants";
import FITable from "../FITable";
import { FormattedMessage } from "react-intl";
import { GET_ANNUAL_YEARS, GET_FINANCIAL_YEARS } from "../../../graphql";
import { deliverableTracklineInputFields } from "./inputFields.json";
import FilterList from "../../FilterList";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { removeFilterListObjectElements } from "../../../utils/filterList";

const chipArray = ({
	arr,
	name,
	removeChip,
}: {
	removeChip: (index: number) => void;
	name: string;
	arr: string[];
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
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

// import {
// 	GET_DELIVERABLE_LINEITEM_FYDONOR,
// 	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
// } from "../../../graphql/Deliverable/trackline";
function EditDeliverableTrackLineIcon({ deliverableTrackline }: { deliverableTrackline: any }) {
	const [tracklineDonorsMapValues, setTracklineDonorsMapValues] = useState<any>({});
	const [tracklineDonors, setTracklineDonors] = useState<
		{
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}[]
	>([]);

	const { data } = useQuery(GET_DELIVERABLE_LINEITEM_FYDONOR, {
		variables: { filter: { deliverable_tracking_lineitem: deliverableTrackline.id } },
	});

	useEffect(() => {
		let deliverableTracklineMapValueObj: any = {};
		let donors: any = [];
		data?.deliverableLinitemFyDonorList?.forEach((elem: any) => {
			deliverableTracklineMapValueObj[`${elem.project_donor.id}mapValues`] = {
				id: elem.id,
				financial_year: elem.financial_year?.id,
				grant_periods_project: elem.grant_periods_project?.id,
				deliverable_tracking_lineitem: elem.deliverable_tracking_lineitem?.id,
				project_donor: elem.project_donor?.id,
			};
			donors.push({
				id: elem.project_donor?.id,
				name: elem.project_donor?.donor?.name,
				donor: elem.project_donor?.donor,
			});
		});
		setTracklineDonors(donors);
		setTracklineDonorsMapValues(deliverableTracklineMapValueObj);
	}, [data]);

	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [
		deliverableTracklineData,
		setDeliverableTracklineData,
	] = useState<IDeliverableTargetLine | null>();
	const handleMenuClose = () => {
		setMenuAnchor(null);
	};
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchor(event.currentTarget);
	};
	return (
		<>
			<TableCell>
				<IconButton aria-label="delete" onClick={handleMenuClick}>
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
				<MenuItem
					onClick={() => {
						setDeliverableTracklineData({
							id: deliverableTrackline?.id,
							deliverable_target_project:
								deliverableTrackline.deliverable_target_project?.id,
							annual_year: deliverableTrackline.annual_year?.id,
							reporting_date: getTodaysDate(deliverableTrackline?.reporting_date),
							value: deliverableTrackline?.value,
							note: deliverableTrackline?.note,
							financial_year: deliverableTrackline.financial_year?.id,
							donors: tracklineDonors,
							donorMapValues: tracklineDonorsMapValues,
						});

						handleMenuClose();
					}}
				>
					<FormattedMessage
						id="editAchievementMenu"
						defaultMessage="Edit Achievement"
						description="This text will be show on deliverable or impact target table for edit achievement menu"
					/>
				</MenuItem>
			</Menu>
			{deliverableTracklineData && (
				<DeliverableTrackline
					open={deliverableTracklineData !== null}
					handleClose={() => setDeliverableTracklineData(null)}
					type={DELIVERABLE_ACTIONS.UPDATE}
					data={deliverableTracklineData}
					deliverableTarget={deliverableTrackline.deliverable_target_project.id}
				/>
			)}
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

let financialYearHash: { [key: string]: string } = {};
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
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
			arr: [filterListObjectKeyValuePair[1]],
		});
	}
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "financial_year") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => financialYearHash[ele]),
				name: "fy",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "annual_year") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => annualYearHash[ele]),
				name: "ay",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

export default function DeliverablesTrackLineTable({
	deliverableTargetId,
}: {
	deliverableTargetId: string;
}) {
	const [TracklinePage, setTracklinePage] = React.useState(0);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		reporting_date: "",
		note: "",
		value: "",
		annual_year: [],
		financial_year: [],
	});
	const [queryFilter, setQueryFilter] = useState({});

	const dashBoardData = useDashBoardData();

	const { data: getAnnualYears } = useQuery(GET_ANNUAL_YEARS);

	const { data: impactFyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: dashBoardData?.organization?.country?.id } },
	});

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		if (getAnnualYears) {
			deliverableTracklineInputFields[3].optionsArray = getAnnualYears.annualYears;
			annualYearHash = mapIdToName(getAnnualYears.annualYears, annualYearHash);
		}
	}, [getAnnualYears]);

	useEffect(() => {
		if (impactFyData) {
			deliverableTracklineInputFields[4].optionsArray = impactFyData.financialYearList;
			financialYearHash = mapIdToName(impactFyData.financialYearList, financialYearHash);
		}
	}, [impactFyData]);

	useEffect(() => {
		setQueryFilter({
			deliverable_target_project: deliverableTargetId,
		});
	}, [deliverableTargetId]);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				deliverable_target_project: deliverableTargetId,
				...newFilterListObject,
			});
		}
	}, [filterList, deliverableTargetId]);

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
		queryData: deliverableTracklineData,
		changePage,
		countQueryLoading,
		queryLoading: loading,
	} = pagination({
		query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
		countQuery: GET_DELIVERABLE_TRACKLINE_COUNT,
		countFilter: queryFilter,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});
	const limit = 10;
	const [rows, setRows] = useState<React.ReactNode[]>([]);
	useEffect(() => {
		if (
			deliverableTracklineData &&
			deliverableTracklineData.deliverableTrackingLineitemList &&
			deliverableTracklineData.deliverableTrackingLineitemList.length
		) {
			let deliverableTrackingLineitemList =
				deliverableTracklineData.deliverableTrackingLineitemList;
			let arr = [];
			for (let i = 0; i < deliverableTrackingLineitemList.length; i++) {
				if (deliverableTrackingLineitemList[i]) {
					let row = [
						<TableCell
							component="td"
							scope="row"
							key={deliverableTrackingLineitemList[i]?.id}
						>
							{TracklinePage * limit + i + 1}
						</TableCell>,
						<TableCell
							key={
								getTodaysDate(deliverableTrackingLineitemList[i]?.reporting_date) +
								`${deliverableTrackingLineitemList[i]?.id}-1`
							}
						>
							{getTodaysDate(deliverableTrackingLineitemList[i]?.reporting_date)}
						</TableCell>,
						<TableCell
							key={
								deliverableTrackingLineitemList[i]?.note +
								`${deliverableTrackingLineitemList[i]?.id}-2`
							}
						>
							{deliverableTrackingLineitemList[i]?.note
								? deliverableTrackingLineitemList[i]?.note
								: "-"}
						</TableCell>,
						<TableCell
							key={
								deliverableTrackingLineitemList[i]?.value +
								`${deliverableTrackingLineitemList[i]?.id}-3`
							}
						>{`${deliverableTrackingLineitemList[i]?.value} ${deliverableTrackingLineitemList[i]?.deliverable_target_project?.deliverable_category_unit?.deliverable_units_org?.name}`}</TableCell>,
						<TableCell
							key={
								deliverableTrackingLineitemList[i]?.financial_year?.name +
								+`${deliverableTrackingLineitemList[i]?.id}-4`
							}
						>
							<Box display="flex">
								<Box mr={1}>
									<Chip
										avatar={<Avatar>FY</Avatar>}
										label={
											deliverableTrackingLineitemList[i]?.financial_year
												? deliverableTrackingLineitemList[i]?.financial_year
														?.name
												: "-"
										}
										size="small"
										color="primary"
									/>
								</Box>
								<Chip
									avatar={<Avatar>AY</Avatar>}
									label={
										deliverableTrackingLineitemList[i]?.annual_year
											? deliverableTrackingLineitemList[i]?.annual_year?.name
											: "-"
									}
									size="small"
									color="primary"
								/>
							</Box>
						</TableCell>,
					];
					row.push(
						<EditDeliverableTrackLineIcon
							key={deliverableTrackingLineitemList[i]}
							deliverableTrackline={deliverableTrackingLineitemList[i]}
						/>
					);
					arr.push(row);
				}
			}
			setRows(arr);
		} else {
			setRows([]);
		}
	}, [deliverableTracklineData]);
	let deliverableTracklineTablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			colSpan={9}
			count={count}
			rowsPerPage={count > limit ? limit : count}
			page={TracklinePage}
			onChangePage={handleDeliverableLineChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);
	return (
		<>
			{countQueryLoading ? <FullScreenLoader /> : null}
			{loading ? <FullScreenLoader /> : null}
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
								reporting_date: "",
								note: "",
								value: "",
								annual_year: [],
								financial_year: [],
							}}
							setFilterList={setFilterList}
							inputFields={deliverableTracklineInputFields}
						/>
					</Box>
				</Grid>
			</Grid>
			<FITable
				tableHeading={deliverableAndimpactTracklineHeading}
				rows={rows}
				pagination={deliverableTracklineTablePagination}
				order={order}
				orderBy={orderBy}
				setOrder={setOrder}
				setOrderBy={setOrderBy}
			/>
		</>
	);
}
