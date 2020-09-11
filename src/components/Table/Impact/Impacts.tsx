import { useQuery } from "@apollo/client";
import { IconButton, Menu, MenuItem, TableCell, TablePagination, Avatar } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
	GET_IMPACT_TARGETS_COUNT,
} from "../../../graphql/Impact/target";
import { IImpactTarget } from "../../../models/impact/impactTarget";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import ImpactTarget from "../../Impact/impactTarget";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import { ImpactHeadings } from "../constants";
import FICollaspeTable from "../FICollapseTable";
import ImpactTrackLineTable from "./impactTrackline";
import pagination from "../../../hooks/pagination/pagination";
import TableSkeleton from "../../Skeletons/TableSkeleton";

function EditImpactTargetIcon({ impactTarget }: { impactTarget: any }) {
	const [impactTargetMenuAnchor, setImpactTargetMenuAnchor] = useState<null | HTMLElement>(null);
	const [impactTargetLineDialog, setImpactTargetLineDialog] = useState<boolean>();
	const [impactTargetData, setImpactTargetData] = useState<IImpactTarget | null>();
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setImpactTargetMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setImpactTargetMenuAnchor(null);
	};
	return (
		<>
			<TableCell>
				<IconButton aria-label="impact-target-edit" onClick={handleMenuClick}>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
			<Menu
				id="impact-target-simple-menu"
				anchorEl={impactTargetMenuAnchor}
				keepMounted
				open={Boolean(impactTargetMenuAnchor)}
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
					Report Achievement
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

function ImpactTargetAchievementAndProgress({
	impactTargetId,
	impactTargetValue,
	impactTargetUnit,
}: {
	impactTargetId: string;
	impactTargetValue: number;
	impactTargetUnit: string;
}) {
	const { data } = useQuery(GET_ACHIEVED_VALLUE_BY_TARGET, {
		variables: { filter: { impactTargetProject: impactTargetId } },
	});
	const [impactTargetAchieved, setImpactTargetAchieved] = useState<number>();
	const [impactTargetProgess, setImpactTargetProgess] = useState<string>();
	useEffect(() => {
		if (data) {
			setImpactTargetAchieved(data.impactTrackingSpendValue);
			setImpactTargetProgess(
				((data.impactTrackingSpendValue / impactTargetValue) * 100).toFixed(2)
			);
		}
	}, [data, impactTargetValue]);
	return (
		<>
			<TableCell>{`${impactTargetAchieved} ${impactTargetUnit}`}</TableCell>
			<TableCell>{impactTargetProgess} %</TableCell>
		</>
	);
}

export default function ImpactsTable() {
	const dashboardData = useDashBoardData();
	const [rows, setRows] = useState<
		{ collaspeTable: React.ReactNode; column: React.ReactNode[] }[]
	>([]);

	const [impactPage, setImpactPage] = React.useState(0);

	let {
		count,
		queryData: impactTargets,
		changePage,
		countQueryLoading,
		queryLoading,
	} = pagination({
		query: GET_IMPACT_TARGET_BY_PROJECT,
		countQuery: GET_IMPACT_TARGETS_COUNT,
		countFilter: {
			project: dashboardData?.project?.id,
		},
		queryFilter: {
			project: dashboardData?.project?.id,
		},
		sort: "created_at:DESC",
	});

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > impactPage) {
			changePage();
		} else {
			changePage(true);
		}
		setImpactPage(newPage);
	};

	useEffect(() => {
		if (impactTargets) {
			let impactTargetProjectList = impactTargets.impactTargetProjectList;
			let array: { collaspeTable: React.ReactNode; column: React.ReactNode[] }[] = [];
			for (let i = 0; i < impactTargetProjectList.length; i++) {
				let row: { collaspeTable: React.ReactNode; column: React.ReactNode[] } = {
					collaspeTable: null,
					column: [],
				};

				row.collaspeTable = (
					<ImpactTrackLineTable impactTargetId={impactTargetProjectList[i].id} />
				); // row collaspeTable for impact

				if (impactTargetProjectList[i].impact_category_unit) {
					let column = [
						<TableCell component="td" scope="row" key={impactTargetProjectList[i]?.id}>
							{impactPage * 10 + i + 1}
						</TableCell>,
						<TableCell key={impactTargetProjectList[i]?.name}>
							{impactTargetProjectList[i].name}
						</TableCell>,
						<TableCell
							key={
								impactTargetProjectList[i]?.impact_category_unit.impact_category_org
									.name
							}
						>
							{
								impactTargetProjectList[i].impact_category_unit.impact_category_org
									.name
							}
						</TableCell>,
						<TableCell
							key={impactTargetProjectList[i]?.target_value}
						>{`${impactTargetProjectList[i].target_value} ${impactTargetProjectList[i].impact_category_unit.impact_units_org.name}`}</TableCell>,
					];
					column.push(
						<ImpactTargetAchievementAndProgress
							key={Math.random()}
							impactTargetId={impactTargetProjectList[i].id}
							impactTargetValue={impactTargetProjectList[i].target_value}
							impactTargetUnit={
								impactTargetProjectList[i].impact_category_unit.impact_units_org
									.name
							}
						/>
					);

					column.push(
						<TableCell
							key={impactTargetProjectList[i]?.sustainable_development_goal?.id}
						>
							{impactTargetProjectList[i]?.sustainable_development_goal?.name ? (
								<Avatar
									alt="SD"
									src={
										impactTargetProjectList[i]?.sustainable_development_goal
											?.icon
									}
								/>
							) : (
								"-"
							)}
							{}
						</TableCell>
					);

					column.push(
						<EditImpactTargetIcon
							key={Math.random()}
							impactTarget={impactTargetProjectList[i]}
						/>
					);

					row.column = column;
					array.push(row);
				}
			}
			setRows(array);
		} else {
			setRows([]);
		}
	}, [impactTargets]);

	let impactTablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			colSpan={9}
			count={count}
			rowsPerPage={count > 10 ? 10 : count}
			page={impactPage}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);
	return (
		<>
			{queryLoading || countQueryLoading ? (
				<TableSkeleton />
			) : (
				<>
					<FICollaspeTable
						tableHeading={ImpactHeadings}
						rows={rows}
						pagination={impactTablePagination}
					/>
				</>
			)}
		</>
	);
}
