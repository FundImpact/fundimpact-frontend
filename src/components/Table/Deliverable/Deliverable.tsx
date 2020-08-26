import React, { useEffect, useState } from "react";
import {
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	GET_ACHIEVED_VALLUE_BY_TARGET,
} from "../../../graphql/queries/Deliverable/target";
import { useQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { deliverableAndImpactHeadings } from "../constants";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeliverableTrackLine from "../../Deliverable/DeliverableTrackline";
import DeliverableTarget from "../../Deliverable/DeliverableTarget";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { IDeliverableTarget } from "../../../models/deliverable/deliverableTarget";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import DeliverableTracklineTable from "./DeliverableTrackLine";
import FICollaspeTable from "../FICollapseTable";
import FullScreenLoader from "../../commons/GlobalLoader";
import TableCell from "@material-ui/core/TableCell";

function EditDeliverableTargetIcon({ deliverableTarget }: { deliverableTarget: any }) {
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
			<TableCell>
				<IconButton aria-label="delete" onClick={handleMenuClick}>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
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
					Report Achievement
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

function DeliverableTargetAchievementAndProgress({
	deliverableTargetId,
	deliverableTargetValue,
	deliverableTargetUnit,
}: {
	deliverableTargetId: string;
	deliverableTargetValue: number;
	deliverableTargetUnit: string;
}) {
	const { data } = useQuery(GET_ACHIEVED_VALLUE_BY_TARGET, {
		variables: { filter: { deliverableTargetProject: deliverableTargetId } },
	});
	const [DeliverableTargetAchieved, setDeliverableTargetAchieved] = useState<number>();
	const [DeliverableTargetProgess, setDeliverableTargetProgess] = useState<string>();
	useEffect(() => {
		if (data) {
			setDeliverableTargetAchieved(data.deliverableTrackingTotalValue);
			setDeliverableTargetProgess(
				((data.deliverableTrackingTotalValue / deliverableTargetValue) * 100).toFixed(2)
			);
		}
	}, [data, deliverableTargetValue]);
	return (
		<>
			<TableCell>{`${DeliverableTargetAchieved} ${deliverableTargetUnit}`}</TableCell>
			<TableCell>{DeliverableTargetProgess} %</TableCell>
		</>
	);
}

export default function DeliverablesTable() {
	const dashboardData = useDashBoardData();
	const { loading, data } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: { filter: { project: dashboardData?.project?.id } },
	});

	const [rows, setRows] = useState<
		{ collaspeTable: React.ReactNode; column: React.ReactNode[] }[]
	>([]);

	useEffect(() => {
		if (data && data.deliverableTargetList && data.deliverableTargetList.length) {
			let deliverableTargetList = data.deliverableTargetList;
			let array: { collaspeTable: React.ReactNode; column: React.ReactNode[] }[] = [];
			for (let i = 0; i < deliverableTargetList.length; i++) {
				let row: { collaspeTable: React.ReactNode; column: React.ReactNode[] } = {
					collaspeTable: null,
					column: [],
				};

				row.collaspeTable = (
					<DeliverableTracklineTable deliverableTargetId={deliverableTargetList[i].id} />
				);

				if (deliverableTargetList[i].deliverable_category_unit) {
					let column = [
						<TableCell>{deliverableTargetList[i].name}</TableCell>,
						<TableCell>
							{
								deliverableTargetList[i].deliverable_category_unit
									.deliverable_category_org.name
							}
						</TableCell>,
						<TableCell>
							{`${deliverableTargetList[i].target_value} ${deliverableTargetList[i].deliverable_category_unit.deliverable_units_org.name}
							`}
						</TableCell>,
					];
					column.push(
						<DeliverableTargetAchievementAndProgress
							deliverableTargetId={deliverableTargetList[i].id}
							deliverableTargetValue={deliverableTargetList[i].target_value}
							deliverableTargetUnit={
								deliverableTargetList[i].deliverable_category_unit
									.deliverable_units_org.name
							}
						/>
					);
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

	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			<FICollaspeTable tableHeading={deliverableAndImpactHeadings} rows={rows} />
		</>
	);
}
