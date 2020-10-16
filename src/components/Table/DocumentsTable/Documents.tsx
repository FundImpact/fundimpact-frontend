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
import React, { useEffect, useState, useMemo } from "react";

import { getTodaysDate, isValidImage } from "../../../utils";
import FullScreenLoader from "../../commons/GlobalLoader";

import FITable from "../FITable";
import { useIntl } from "react-intl";
import { GET_ORGANISATIONS_DOCUMENTS } from "../../../graphql";
import FilterList from "../../FilterList";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/deliverableTrackingLineItem/actions";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { FINANCIAL_YEAR_ACTIONS } from "../../../utils/access/modules/financialYear/actions";
import { ANNUAL_YEAR_ACTIONS } from "../../../utils/access/modules/annualYear/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../utils";
import { Attachments } from "../../../models/AttachFile";
import { documentsHeadings } from "../constants";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";

export default function DocumentsTable() {
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
	// const {data} = useQuery()
	// const removeFilterListElements = (key: string, index?: number) =>
	// 	setFilterList((filterListObject) =>
	// 		removeFilterListObjectElements({ filterListObject, key, index })
	// 	);

	// useEffect(() => {
	// 	if (filterList) {
	// 		let newFilterListObject: { [key: string]: string | string[] } = {};
	// 		for (let key in filterList) {
	// 			if (filterList[key] && filterList[key].length) {
	// 				newFilterListObject[key] = filterList[key];
	// 			}
	// 		}
	// 		setQueryFilter({
	// 			deliverable_target_project: deliverableTargetId,
	// 			...newFilterListObject,
	// 		});
	// 	}
	// }, [filterList, deliverableTargetId]);

	// const handleDeliverableLineChangePage = (
	// 	event: React.MouseEvent<HTMLButtonElement> | null,
	// 	newPage: number
	// ) => {
	// 	if (newPage > TracklinePage) {
	// 		changePage();
	// 	} else {
	// 		changePage(true);
	// 	}
	// 	setTracklinePage(newPage);
	// };

	// let {
	// 	count,
	// 	queryData: deliverableTracklineData,
	// 	changePage,
	// 	countQueryLoading,
	// 	queryLoading: loading,
	// } = pagination({
	// 	query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
	// 	countQuery: GET_DELIVERABLE_TRACKLINE_COUNT,
	// 	countFilter: queryFilter,
	// 	queryFilter,
	// 	sort: `${orderBy}:${order.toUpperCase()}`,
	// });

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

	const { data } = useQuery(GET_ORGANISATIONS_DOCUMENTS);
	useEffect(() => {
		let arr: any = [];
		data?.organizationList?.map(
			(organization: {
				id: string;
				name: string;
				short_name: string;
				attachments: Attachments[];
			}) => {
				organization.attachments?.map((document: Attachments, index: number) => {
					let row = [
						<TableCell component="td" scope="row" key={index}>
							{TracklinePage * limit + index + 1}
						</TableCell>,
						<TableCell key={index}>{document.name}</TableCell>,
						<TableCell key={`${index}-1`}>{`${document.size}Kb`}</TableCell>,
						<TableCell key={`${index}-2`}>{document.ext}</TableCell>,
						<TableCell key={`${index}-3`}>
							{getTodaysDate(new Date(document.created_at))}
						</TableCell>,
						<TableCell key={`${index}-4`}>
							<IconButton
								onClick={() => {
									var win = window.open(document.url, "_blank");
									win?.focus();
								}}
							>
								{isValidImage(document.ext) ? <VisibilityIcon /> : <GetAppIcon />}
							</IconButton>
						</TableCell>,
						<TableCell key={`${index}-5`}>
							<IconButton disabled>
								<MoreVertIcon />
							</IconButton>
						</TableCell>,
					];
					arr.push(row);
				});
				setRows(arr);
			},
			[]
		);
	}, [data]);

	// let deliverableTracklineTablePagination = (
	// 	<TablePagination
	// 		rowsPerPageOptions={[]}
	// 		colSpan={9}
	// 		count={count}
	// 		rowsPerPage={count > limit ? limit : count}
	// 		page={TracklinePage}
	// 		onChangePage={handleDeliverableLineChangePage}
	// 		onChangeRowsPerPage={() => {}}
	// 		style={{ paddingRight: "40px" }}
	// 	/>
	// );
	const intl = useIntl();

	// filteredDeliverableTracklineTableHeadings[
	// 	filteredDeliverableTracklineTableHeadings.length - 1
	// ].renderComponent = () => (
	// 	<FilterList
	// 		initialValues={{
	// 			reporting_date: "",
	// 			note: "",
	// 			value: "",
	// 			annual_year: [],
	// 			financial_year: [],
	// 		}}
	// 		setFilterList={setFilterList}
	// 		inputFields={deliverableTracklineInputFields}
	// 	/>
	// );

	return (
		<>
			{/* {countQueryLoading ? <FullScreenLoader /> : null}
			{loading ? <FullScreenLoader /> : null} */}
			{/* <Grid container>
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
			</Grid> */}
			<FITable
				tableHeading={documentsHeadings}
				rows={rows}
				// pagination={deliverableTracklineTablePagination}
				order={order}
				orderBy={orderBy}
				setOrder={setOrder}
				setOrderBy={setOrderBy}
				noRowHeading={intl.formatMessage({
					id: `noDocuments`,
					defaultMessage: `No Documents`,
					description: `This text will be shown if no documents found for table`,
				})}
			/>
		</>
	);
}
