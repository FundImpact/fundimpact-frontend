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
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";

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
import { FormattedMessage } from "react-intl";

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
	return (
		<>
			<TableCell>
				<IconButton aria-label="impact_trackline-edit" onClick={handleMenuClick}>
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
			</Menu>
			{impactTargetLineData && (
				<ImpactTrackLine
					open={impactTargetLineData !== null}
					handleClose={() => setImpactTargetLineData(null)}
					type={IMPACT_ACTIONS.UPDATE}
					data={impactTargetLineData}
					impactTarget={impactTargetLine.impact_target_project.id}
				/>
			)}
		</>
	);
}

export default function ImpactTrackLineTable({ impactTargetId }: { impactTargetId: string }) {
	// const { loading, data } = useQuery(GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET, {
	// 	variables: { filter: { impact_target_project: impactTargetId } },
	// });

	const [impactTracklinePage, setImpactTracklinePage] = React.useState(0);

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
		countFilter: {
			impact_target_project: impactTargetId,
		},
		queryFilter: {
			impact_target_project: impactTargetId,
		},
		sort: "created_at:DESC",
	});
	const limit = 10;
	const [rows, setRows] = useState<React.ReactNode[]>([]);
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
						<TableCell key={impactTrackingLineitemList[i]?.reporting_date}>
							{getTodaysDate(impactTrackingLineitemList[i]?.reporting_date)}
						</TableCell>,
						<TableCell key={impactTrackingLineitemList[i]?.note}>
							{impactTrackingLineitemList[i]?.note
								? impactTrackingLineitemList[i]?.note
								: "-"}
						</TableCell>,
						<TableCell
							key={impactTrackingLineitemList[i]?.value}
						>{`${impactTrackingLineitemList[i]?.value} ${impactTrackingLineitemList[i]?.impact_target_project?.impact_category_unit?.impact_units_org?.name}`}</TableCell>,
						<TableCell key={Math.random()}>
							{" "}
							<Box display="flex">
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
	}, [impactTracklineData]);

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
	return (
		<>
			{countLoading ? <FullScreenLoader /> : null}
			{loading ? <FullScreenLoader /> : null}
			<FITable
				tableHeading={deliverableAndimpactTracklineHeading}
				rows={rows}
				pagination={tablePagination}
			/>
		</>
	);
}
