import React, { useEffect, useState } from "react";
import { GET_DELIVERABLE_TARGET_BY_PROJECT } from "../../graphql/queries/Deliverable/target";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { deliverableAndImpactHeadings } from "./constants";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeliverableTargetLine from "../Deliverable/DeliverableTargetLine";
import DeliverableTarget from "../Deliverable/DeliverableTarget";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import FITable from "./FITable";
import { IDeliverableTarget } from "../../models/deliverable/deliverableTarget";
import { DELIVERABLE_ACTIONS } from "../Deliverable/constants";

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
				<MoreVertIcon fontSize="small" />
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
				<DeliverableTargetLine
					open={targetLineDialog}
					handleClose={() => setTargetLineDialog(false)}
					type={DELIVERABLE_ACTIONS.CREATE}
					deliverableTarget={deliverableTarget.id}
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
	console.log("hey", deliverableTargetId);
	const dashboardData = useDashBoardData();
	const { loading, data } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: { filter: { project: dashboardData?.project?.id } },
	});

	const [rows, setRows] = useState<any>([]);
	useEffect(() => {
		if (data && data.deliverableTargetList && data.deliverableTargetList.length) {
			let deliverableTargetList = data.deliverableTargetList;
			let arr = [];
			for (let i = 0; i < deliverableTargetList.length; i++) {
				if (deliverableTargetList[i].deliverable_category_unit) {
					let row = [
						deliverableTargetList[i].name,
						deliverableTargetList[i].deliverable_category_unit.deliverable_category_org
							.name,
						deliverableTargetList[i].target_value,
						deliverableTargetList[i].deliverable_category_unit.deliverable_units_org
							.name,
						"",
					];
					row.push(
						<EditDeliverableTargetIcon deliverableTarget={deliverableTargetList[i]} />
					);
					arr.push(row);
				}
			}
			setRows(arr);
		} else {
			setRows([]);
		}
	}, [data]);

	return <FITable tableHeading={deliverableAndImpactHeadings} rows={rows} />;
}
