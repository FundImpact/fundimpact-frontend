import React, { useEffect, useState } from "react";
import { GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET } from "../../../graphql/Deliverable/trackline";
import { useQuery } from "@apollo/client";
import { deliverableAndimpactTracklineHeading } from "../constants";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeliverableTrackline from "../../Deliverable/DeliverableTrackline";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import FITable from "../FITable";
import { IDeliverableTargetLine } from "../../../models/deliverable/deliverableTrackline";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import FullScreenLoader from "../../commons/GlobalLoader";

function EditImpactTrackLineIcon({ deliverableTrackline }: { deliverableTrackline: any }) {
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
			<IconButton aria-label="delete" onClick={handleMenuClick}>
				<MoreVertIcon />
			</IconButton>
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
							id: deliverableTrackline.id,
							deliverable_target_project:
								deliverableTrackline.deliverable_target_project.id,
							annual_year: deliverableTrackline.annual_year.id,
							reporting_date: deliverableTrackline.reporting_date,
							value: deliverableTrackline.value,
							note: deliverableTrackline.note,
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
	console.log("hey", deliverableTargetId);
	const { loading, data } = useQuery(GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET, {
		variables: { filter: { deliverable_target_project: deliverableTargetId } },
	});

	const [rows, setRows] = useState<any>([]);
	useEffect(() => {
		if (
			data &&
			data.deliverableTrackingLineitemList &&
			data.deliverableTrackingLineitemList.length
		) {
			let deliverableTrackingLineitemList = data.deliverableTrackingLineitemList;
			let arr = [];
			for (let i = 0; i < deliverableTrackingLineitemList.length; i++) {
				if (deliverableTrackingLineitemList[i]) {
					let row = [
						deliverableTrackingLineitemList[i].reporting_date,
						deliverableTrackingLineitemList[i].note,
						deliverableTrackingLineitemList[i].value,
					];
					row.push(
						<EditImpactTrackLineIcon
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
	}, [data]);

	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			<FITable tableHeading={deliverableAndimpactTracklineHeading} rows={rows} />{" "}
		</>
	);
}
