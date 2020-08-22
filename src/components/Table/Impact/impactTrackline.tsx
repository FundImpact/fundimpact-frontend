import React, { useEffect, useState } from "react";
import { GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET } from "../../../graphql/queries/Impact/trackline";
import { useQuery } from "@apollo/client";
import { deliverableAndimpactTracklineHeading } from "../constants";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import FITable from "../FITable";
import { IImpactTargetLine } from "../../../models/impact/impactTargetline";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import FullScreenLoader from "../../commons/GlobalLoader";

function EditImpactTargetLineIcon({ impactTargetLine }: { impactTargetLine: any }) {
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [impactTargetLineData, setImpactTargetLineData] = useState<IImpactTargetLine | null>();
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setMenuAnchor(null);
	};
	return (
		<>
			<IconButton aria-label="delete" onClick={handleMenuClick}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="deliverable-target-simple-menu"
				anchorEl={menuAnchor}
				keepMounted
				open={Boolean(menuAnchor)}
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

	const [rows, setRows] = useState<any>([]);
	useEffect(() => {
		if (data && data.impactTrackingLineitemList && data.impactTrackingLineitemList.length) {
			let impactTrackingLineitemList = data.impactTrackingLineitemList;
			let arr = [];
			for (let i = 0; i < impactTrackingLineitemList.length; i++) {
				if (impactTrackingLineitemList[i]) {
					let row = [
						impactTrackingLineitemList[i].reporting_date,
						impactTrackingLineitemList[i].note,
						impactTrackingLineitemList[i].value,
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
