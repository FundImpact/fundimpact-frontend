import React, { useEffect, useState } from "react";
import { GET_DELIVERABLE_TARGET_BY_PROJECT } from "../../../graphql/queries/Deliverable/target";
import { useQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { deliverableAndImpactHeadings } from "../constants";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeliverableTrackLine from "../../Deliverable/DeliverableTrackline";
import DeliverableTarget from "../../Deliverable/DeliverableTarget";
import { IconButton, Menu, MenuItem, Grid, Box, Typography } from "@material-ui/core";
import { IDeliverableTarget } from "../../../models/deliverable/deliverableTarget";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import DeliverableTracklineTable from "./DeliverableTrackLine";
import FICollaspeTable from "../FICollapseTable";

function EditDeliverableTargetIcon({ deliverableTarget }: { deliverableTarget: any }) {
	const dashboardData = useDashBoardData();
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
						setTargetData({
							id: deliverableTarget.id,
							name: deliverableTarget.name,
							target_value: deliverableTarget.target_value,
							description: deliverableTarget.description,
							deliverable_category_unit:
								deliverableTarget.deliverable_category_unit.id,
							project: deliverableTarget.project.id,
						});
						handleMenuClose();
					}}
				>
					Edit Target
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleMenuClose();
						setTargetLineDialog(true);
					}}
				>
					Add Target Line
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

export default function DeliverablesTable() {
	const dashboardData = useDashBoardData();
	const { loading, data } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: { filter: { project: dashboardData?.project?.id } },
	});

	const [rows, setRows] = useState<any>([]);
	useEffect(() => {
		if (data && data.deliverableTargetList && data.deliverableTargetList.length) {
			let deliverableTargetList = data.deliverableTargetList;
			let array: { collaspeTable: any; column: any[] }[] = [];
			for (let i = 0; i < deliverableTargetList.length; i++) {
				let row: { collaspeTable: any; column: any[] } = {
					collaspeTable: null,
					column: [],
				};

				row.collaspeTable = (
					<Grid>
						<Box m={2}>
							<Typography variant="subtitle2">Achievements</Typography>
						</Box>
						<DeliverableTracklineTable
							deliverableTargetId={deliverableTargetList[i].id}
						/>
					</Grid>
				);

				if (deliverableTargetList[i].deliverable_category_unit) {
					let column = [
						deliverableTargetList[i].name,
						deliverableTargetList[i].deliverable_category_unit.deliverable_category_org
							.name,
						`${deliverableTargetList[i].target_value} 
						${deliverableTargetList[i].deliverable_category_unit.deliverable_units_org.name}`,
						"80%",
						`xx ${deliverableTargetList[i].deliverable_category_unit.deliverable_units_org.name}`,
					];
					column.push(
						<EditDeliverableTargetIcon deliverableTarget={deliverableTargetList[i]} />
					);
					row.column = column;
					array.push(row);
				}
			}
			setRows(array);
		} else {
			setRows([]);
		}
	}, [data]);

	return <FICollaspeTable tableHeading={deliverableAndImpactHeadings} rows={rows} />;
}
