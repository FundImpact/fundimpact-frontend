import React, { useEffect, useState } from "react";
import { GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET } from "../../../graphql/Impact/trackline";
import { useQuery } from "@apollo/client";
import { deliverableAndimpactTracklineHeading } from "../constants";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import { IconButton, Menu, MenuItem, TableCell } from "@material-ui/core";
import FITable from "../FITable";
import { IImpactTargetLine } from "../../../models/impact/impactTargetline";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import FullScreenLoader from "../../commons/GlobalLoader";
import { getTodaysDate } from "../../../utils";

function EditImpactTargetLineIcon({ impactTargetLine }: { impactTargetLine: any }) {
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
							impact_target_project: impactTargetLine.impact_target_project.id,
							annual_year: impactTargetLine.annual_year.id,
							reporting_date: impactTargetLine.reporting_date,
							value: impactTargetLine.value,
							note: impactTargetLine.note,
						});
						handleMenuClose();
					}}
				>
					Edit Target Line
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
	const { loading, data } = useQuery(GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET, {
		variables: { filter: { impact_target_project: impactTargetId } },
	});

	const [rows, setRows] = useState<React.ReactNode[]>([]);
	useEffect(() => {
		if (data && data.impactTrackingLineitemList && data.impactTrackingLineitemList.length) {
			let impactTrackingLineitemList = data.impactTrackingLineitemList;
			let arr = [];
			for (let i = 0; i < impactTrackingLineitemList.length; i++) {
				if (impactTrackingLineitemList[i]) {
					let row = [
						<TableCell>
							{getTodaysDate(impactTrackingLineitemList[i].reporting_date)}
						</TableCell>,
						<TableCell>{impactTrackingLineitemList[i].note}</TableCell>,
						<TableCell>{impactTrackingLineitemList[i].value}</TableCell>,
					];
					row.push(
						<EditImpactTargetLineIcon
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
	}, [data]);

	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			<FITable tableHeading={deliverableAndimpactTracklineHeading} rows={rows} />{" "}
		</>
	);
}
