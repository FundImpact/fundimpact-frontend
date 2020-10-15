import { useQuery } from "@apollo/client";
import {
	IconButton,
	Menu,
	MenuItem,
	TableCell,
	Box,
	TablePagination,
	Chip,
	Avatar,
	Grid,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState, useMemo } from "react";

import {
	GET_IMPACT_LINEITEM_FYDONOR,
	GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
	GET_IMPACT_TRACKLINE_COUNT,
} from "../../../graphql/Impact/trackline";
import { IImpactTargetLine } from "../../../models/impact/impactTargetline";
import { getTodaysDate } from "../../../utils";
import FullScreenLoader from "../../commons/GlobalLoader";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import { deliverableAndimpactTracklineHeading } from "../constants";
import FITable from "../FITable";
import pagination from "../../../hooks/pagination/pagination";
import { FormattedMessage, useIntl } from "react-intl";
import { impactTracklineInputFields } from "./inputFields.json";
import FilterList from "../../FilterList";
import { GET_ANNUAL_YEARS, GET_FINANCIAL_YEARS } from "../../../graphql";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { IMPACT_TRACKING_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/impactTrackingLineItem/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../utils";
import { FINANCIAL_YEAR_ACTIONS } from "../../../utils/access/modules/financialYear/actions";
import { ANNUAL_YEAR_ACTIONS } from "../../../utils/access/modules/annualYear/actions";

enum tableHeaders {
	date = 1,
	note = 2,
	achieved = 3,
	year = 4,
}

const chipArray = ({
	removeChip,
	name,
	arr,
}: {
	removeChip: (index: number) => void;
	name: string;
	arr: string[];
}) => {
	return arr.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
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
				label={element}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

function EditImpactTargetLineIcon({ impactTargetLine }: { impactTargetLine: any }) {
	const [impactTracklineDonorsMapValues, setImpactTracklineDonorsMapValues] = useState<any>({});
	const [impactTracklineDonors, setImpactTracklineDonors] = useState<
		{
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}[]
	>([]);

	const { data } = useQuery(GET_IMPACT_LINEITEM_FYDONOR, {
		variables: { filter: { impact_tracking_lineitem: impactTargetLine.id } },
		onCompleted(data) {
			let impactMapValueobj: any = {};
			let impactProjectDonors: any = [];
			data.impactLinitemFyDonorList.forEach((elem: any) => {
				impactMapValueobj[`${elem.project_donor.id}mapValues`] = {
					id: elem.id,
					financial_year: elem.financial_year?.id,
					grant_periods_project: elem.grant_periods_project?.id,
					impact_tracking_lineitem: elem.impact_tracking_lineitem?.id,
					project_donor: elem.project_donor?.id,
				};
				impactProjectDonors.push({
					id: elem.project_donor?.id,
					name: elem.project_donor?.donor?.name,
					donor: elem.project_donor?.donor,
				});
			});
			setImpactTracklineDonors(impactProjectDonors);
			setImpactTracklineDonorsMapValues(impactMapValueobj);
		},
		onError(data) {},
	});
	useEffect(() => {
		let impactMapValueobj: any = {};
		let impactProjectDonors: any = [];
		data?.impactLinitemFyDonorList?.forEach((elem: any) => {
			impactMapValueobj[`${elem.project_donor.id}mapValues`] = {
				id: elem.id,
				financial_year: elem.financial_year?.id,
				grant_periods_project: elem.grant_periods_project?.id,
				impact_tracking_lineitem: elem.impact_tracking_lineitem?.id,
				project_donor: elem.project_donor?.id,
			};
			impactProjectDonors.push({
				id: elem.project_donor?.id,
				name: elem.project_donor?.donor?.name,
				donor: elem.project_donor?.donor,
			});
		});
		setImpactTracklineDonors(impactProjectDonors);
		setImpactTracklineDonorsMapValues(impactMapValueobj);
	}, [data]);
	const [impactTracklineMenuAnchor, setImpactTracklineMenuAnchor] = useState<null | HTMLElement>(
		null
	);
	const [impactTargetLineData, setImpactTargetLineData] = useState<IImpactTargetLine | null>();
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setImpactTracklineMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setImpactTracklineMenuAnchor(null);
	};

	const impactTracklineEditAccess = userHasAccess(
		MODULE_CODES.IMPACT_TRACKING_LINE_ITEM,
		IMPACT_TRACKING_LINE_ITEM_ACTIONS.UPDATE_IMPACT_TRACKING_LINE_ITEM
	);

	return (
		<>
			<TableCell>
				<IconButton
					style={{ visibility: impactTracklineEditAccess ? "visible" : "hidden" }}
					aria-label="impact_trackline-edit"
					onClick={handleMenuClick}
				>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
			<Menu
				id="impact-trackline-simple-menu"
				anchorEl={impactTracklineMenuAnchor}
				keepMounted
				open={Boolean(impactTracklineMenuAnchor)}
				onClose={handleMenuClose}
			>
				{impactTracklineEditAccess && (
					<MenuItem
						onClick={() => {
							setImpactTargetLineData({
								id: impactTargetLine.id,
								impact_target_project: impactTargetLine.impact_target_project?.id,
								annual_year: impactTargetLine.annual_year?.id,
								reporting_date: getTodaysDate(impactTargetLine?.reporting_date),
								value: impactTargetLine?.value,
								note: impactTargetLine?.note,
								financial_year: impactTargetLine.financial_year?.id,
								donors: impactTracklineDonors,
								impactDonorMapValues: impactTracklineDonorsMapValues,
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
				)}
			</Menu>
			{impactTargetLineData && (
				<ImpactTrackLine
					open={impactTargetLineData !== null}
					handleClose={() => setImpactTargetLineData(null)}
					type={IMPACT_ACTIONS.UPDATE}
					data={impactTargetLineData}
					impactTarget={impactTargetLine.impact_target_project.id}
					alreadyMappedDonorsIds={impactTracklineDonors?.map((donor) => donor.id)}
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

let annualYearHash: { [key: string]: string } = {};
let financialYearHash: { [key: string]: string } = {};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "annual_year") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => annualYearHash[ele]),
				name: "ay",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "financial_year") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((ele) => financialYearHash[ele]),
				name: "fy",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArray({
			arr: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};

export default function ImpactTrackLineTable({ impactTargetId }: { impactTargetId: string }) {
	// const { loading, data } = useQuery(GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET, {
	// 	variables: { filter: { impact_target_project: impactTargetId } },
	// });

	const [impactTracklinePage, setImpactTracklinePage] = React.useState(0);
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
	const dashBoardData = useDashBoardData();
	const [queryFilter, setQueryFilter] = useState({});
	const [orderBy, setOrderBy] = useState<string>("created_at");

	const { data: impactFyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: dashBoardData?.organization?.country?.id } },
	});
	const { data: getAnnualYears } = useQuery(GET_ANNUAL_YEARS);

	useEffect(() => {
		if (getAnnualYears) {
			impactTracklineInputFields[3].optionsArray = getAnnualYears.annualYears;
			annualYearHash = mapIdToName(getAnnualYears.annualYears, annualYearHash);
		}
	}, [getAnnualYears]);

	useEffect(() => {
		if (impactFyData) {
			impactTracklineInputFields[4].optionsArray = impactFyData.financialYearList;
			financialYearHash = mapIdToName(impactFyData.financialYearList, financialYearHash);
		}
	}, [impactFyData]);

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		setQueryFilter({
			impact_target_project: impactTargetId,
		});
	}, [impactTargetId]);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				impact_target_project: impactTargetId,
				...newFilterListObject,
			});
		}
	}, [filterList, impactTargetId]);

	const handleImpactLineChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > impactTracklinePage) {
			changePage();
		} else {
			changePage(true);
		}
		setImpactTracklinePage(newPage);
	};

	let {
		count,
		queryData: impactTracklineData,
		changePage,
		countQueryLoading: countLoading,
		queryLoading: loading,
	} = pagination({
		query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
		countQuery: GET_IMPACT_TRACKLINE_COUNT,
		countFilter: queryFilter,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});
	const limit = 10;
	const [rows, setRows] = useState<React.ReactNode[]>([]);

	const financialYearFindAccess = userHasAccess(
		MODULE_CODES.FINANCIAL_YEAR,
		FINANCIAL_YEAR_ACTIONS.FIND_FINANCIAL_YEAR
	);

	const annualYearFindAccess = userHasAccess(
		MODULE_CODES.ANNUAL_YEAR,
		ANNUAL_YEAR_ACTIONS.FIND_ANNUAL_YEAR
	);

	useEffect(() => {
		if (
			impactTracklineData &&
			impactTracklineData.impactTrackingLineitemList &&
			impactTracklineData.impactTrackingLineitemList.length
		) {
			let impactTrackingLineitemList = impactTracklineData.impactTrackingLineitemList;
			let arr = [];
			for (let i = 0; i < impactTrackingLineitemList.length; i++) {
				if (impactTrackingLineitemList[i]) {
					let row = [
						<TableCell
							component="td"
							scope="row"
							key={impactTrackingLineitemList[i]?.id}
						>
							{impactTracklinePage * limit + i + 1}
						</TableCell>,
						<TableCell
							key={
								impactTrackingLineitemList[i]?.reporting_date +
								`${impactTrackingLineitemList[i]?.id}-1`
							}
						>
							{getTodaysDate(impactTrackingLineitemList[i]?.reporting_date)}
						</TableCell>,
						<TableCell
							key={
								impactTrackingLineitemList[i]?.note +
								`${impactTrackingLineitemList[i]?.id}-2`
							}
						>
							{impactTrackingLineitemList[i]?.note
								? impactTrackingLineitemList[i]?.note
								: "-"}
						</TableCell>,
						<TableCell
							key={
								impactTrackingLineitemList[i]?.value +
								`${impactTrackingLineitemList[i]?.id}-3`
							}
						>{`${impactTrackingLineitemList[i]?.value} ${impactTrackingLineitemList[i]?.impact_target_project?.impact_category_unit?.impact_units_org?.name}`}</TableCell>,
						<TableCell key={Math.random() + `${impactTrackingLineitemList[i]?.id}-4`}>
							{" "}
							<Box display="flex">
								{financialYearFindAccess && (
									<Box mr={1}>
										<Chip
											avatar={<Avatar>FY</Avatar>}
											label={
												impactTrackingLineitemList[i]?.financial_year
													? impactTrackingLineitemList[i]?.financial_year
															?.name
													: "-"
											}
											size="small"
											color="primary"
										/>
									</Box>
								)}
								{annualYearFindAccess && (
									<Chip
										avatar={<Avatar>AY</Avatar>}
										label={
											impactTrackingLineitemList[i]?.annual_year
												? impactTrackingLineitemList[i]?.annual_year?.name
												: "-"
										}
										size="small"
										color="primary"
									/>
								)}
							</Box>
						</TableCell>,
					];
					row.push(
						<EditImpactTargetLineIcon
							key={Math.random()}
							impactTargetLine={impactTrackingLineitemList[i]}
						/>
					);
					arr.push(row);
				}
			}
			setRows(arr);
		} else {
			setRows([]);
		}
	}, [impactTracklineData, annualYearFindAccess, financialYearFindAccess, impactTracklinePage]);

	const filteredImpactTracklineTableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(deliverableAndimpactTracklineHeading, {
				[tableHeaders.year]: !annualYearFindAccess && !financialYearFindAccess,
			}),
		[annualYearFindAccess, financialYearFindAccess]
	);

	let tablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			colSpan={9}
			count={count}
			rowsPerPage={count > limit ? limit : count}
			page={impactTracklinePage}
			onChangePage={handleImpactLineChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);
	const intl = useIntl();

	let rowHeadingImpact = intl.formatMessage({
		id: `AchievementsHeading`,
		defaultMessage: `Achievements`,
		description: `This text will be shown for description of table`,
	});

	let noRowHeadingImpact = intl.formatMessage({
		id: `noAchievementsReported`,
		defaultMessage: `No Achievements Reported`,
		description: `This text will be shown if no target found for table`,
	});

	filteredImpactTracklineTableHeadings[
		filteredImpactTracklineTableHeadings.length - 1
	].renderComponent = () => (
		<FilterList
			initialValues={{
				reporting_date: "",
				note: "",
				value: "",
				annual_year: [],
				financial_year: [],
			}}
			setFilterList={setFilterList}
			inputFields={impactTracklineInputFields}
		/>
	);

	return (
		<>
			{countLoading ? <FullScreenLoader /> : null}
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
				tableHeading={filteredImpactTracklineTableHeadings}
				rows={rows}
				pagination={tablePagination}
				order={order}
				orderBy={orderBy}
				setOrder={setOrder}
				setOrderBy={setOrderBy}
				noRowHeading={noRowHeadingImpact}
				rowHeading={rowHeadingImpact}
			/>
		</>
	);
}
