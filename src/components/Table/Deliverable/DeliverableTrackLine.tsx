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
				id="deliverable-trackline-simple-menu"
				anchorEl={menuAnchor}
				keepMounted
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
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
					Edit Achievement
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

export default function DeliverablesTrackLineTable({
	deliverableTargetId,
}: {
	deliverableTargetId: string;
}) {
	const [TracklinePage, setTracklinePage] = React.useState(0);

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
		countFilter: {
			deliverable_target_project: deliverableTargetId,
		},
		queryFilter: {
			deliverable_target_project: deliverableTargetId,
		},
		sort: "created_at:DESC",
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
							key={getTodaysDate(deliverableTrackingLineitemList[i]?.reporting_date)}
						>
							{getTodaysDate(deliverableTrackingLineitemList[i]?.reporting_date)}
						</TableCell>,
						<TableCell key={deliverableTrackingLineitemList[i]?.note}>
							{deliverableTrackingLineitemList[i]?.note
								? deliverableTrackingLineitemList[i]?.note
								: "-"}
						</TableCell>,
						<TableCell
							key={deliverableTrackingLineitemList[i]?.value}
						>{`${deliverableTrackingLineitemList[i]?.value} ${deliverableTrackingLineitemList[i]?.deliverable_target_project?.deliverable_category_unit?.deliverable_units_org?.name}`}</TableCell>,
						<TableCell key={deliverableTrackingLineitemList[i]?.financial_year?.name}>
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
			<FITable
				tableHeading={deliverableAndimpactTracklineHeading}
				rows={rows}
				pagination={deliverableTracklineTablePagination}
			/>
		</>
	);
}
