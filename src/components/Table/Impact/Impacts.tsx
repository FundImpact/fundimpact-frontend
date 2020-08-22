import React, { useEffect, useState } from "react";
import { GET_IMPACT_TARGET_BY_PROJECT } from "../../../graphql/queries/Impact/target";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { deliverableAndImpactHeadings } from "../constants";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FICollaspeTable from "../FICollapseTable";
import { IImpactTarget } from "../../../models/impact/impactTarget";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import ImpactTarget from "../../Impact/impactTarget";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import ImpactTrackLineTable from "./impactTrackline";
import FullScreenLoader from "../../commons/GlobalLoader";

function EditImpactTargetIcon({ impactTarget }: { impactTarget: any }) {
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [impactTargetLineDialog, setImpactTargetLineDialog] = useState<boolean>();
	const [impactTargetData, setImpactTargetData] = useState<IImpactTarget | null>();
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
				id="impact-target-simple-menu"
				anchorEl={menuAnchor}
				keepMounted
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
			>
				<MenuItem
					onClick={() => {
						setImpactTargetData({
							id: impactTarget.id,
							name: impactTarget.name,
							target_value: impactTarget.target_value,
							description: impactTarget.description,
							impact_category_unit: impactTarget.impact_category_unit.id,
							project: impactTarget.project.id,
						});
						handleMenuClose();
					}}
				>
					Edit Target
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleMenuClose();
						setImpactTargetLineDialog(true);
					}}
				>
					Add Target Line
				</MenuItem>
			</Menu>
			{impactTargetData && (
				<ImpactTarget
					open={impactTargetData !== null}
					handleClose={() => setImpactTargetData(null)}
					type={IMPACT_ACTIONS.UPDATE}
					data={impactTargetData}
					project={impactTarget.project.id}
				/>
			)}
			{impactTargetLineDialog && (
				<ImpactTrackLine
					open={impactTargetLineDialog}
					handleClose={() => setImpactTargetLineDialog(false)}
					type={IMPACT_ACTIONS.CREATE}
					impactTarget={impactTarget.id}
				/>
			)}
		</>
	);
}
export default function ImpactsTable() {
	const [getImpactTargetByProject, { loading, data }] = useLazyQuery(
		GET_IMPACT_TARGET_BY_PROJECT
	);
	const dashboardData = useDashBoardData();
	const [rows, setRows] = useState<any>([]);

	useEffect(() => {
		if (dashboardData?.project) {
			console.log("project", dashboardData?.project);
			getImpactTargetByProject({
				variables: { filter: { project: dashboardData?.project.id } },
			});
		}
	}, [dashboardData, dashboardData?.project]);

	useEffect(() => {
		if (data) {
			let impactTargetProjectList = data.impactTargetProjectList;
			let array: { collaspeTable: any; column: any[] }[] = [];
			for (let i = 0; i < impactTargetProjectList.length; i++) {
				let row: { collaspeTable: any; column: any[] } = {
					collaspeTable: null,
					column: [],
				};

				row.collaspeTable = (
					<ImpactTrackLineTable impactTargetId={impactTargetProjectList[i].id} />
				); // row collaspeTable for impact

				if (impactTargetProjectList[i].impact_category_unit) {
					let column = [
						impactTargetProjectList[i].name,
						impactTargetProjectList[i].impact_category_unit.impact_category_org.name,
						`${impactTargetProjectList[i].target_value}
						${impactTargetProjectList[i].impact_category_unit.impact_units_org.name}`,
						`xx ${impactTargetProjectList[i].impact_category_unit.impact_units_org.name}`,
						"50%",
					];
					column.push(<EditImpactTargetIcon impactTarget={impactTargetProjectList[i]} />);

					row.column = column;
					array.push(row);
				}
			}
			setRows(array);
		} else {
			setRows([]);
		}
	}, [data]);

	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			<FICollaspeTable tableHeading={deliverableAndImpactHeadings} rows={rows} />
		</>
	);
}
