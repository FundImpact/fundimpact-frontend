import React, { useEffect, useState } from "react";
import { GET_IMPACT_TARGET_BY_PROJECT } from "../../graphql/queries/Impact/target";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { deliverableAndImpactHeadings } from "./constants";
import { IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FITable from "./FITable";

function EditImpactTargetIcon() {
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
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
			let arr = [];
			for (let i = 0; i < impactTargetProjectList.length; i++) {
				if (impactTargetProjectList[i].impact_category_unit) {
					let row = [
						impactTargetProjectList[i].name,
						impactTargetProjectList[i].impact_category_unit.impact_category_org.name,
						impactTargetProjectList[i].target_value,
						impactTargetProjectList[i].impact_category_unit.impact_units_org.name,
						"",
					];
					row.push(<EditImpactTargetIcon />);
					arr.push(row);
				}
			}
			setRows(arr);
		}
	}, [data]);

	return <FITable tableHeading={deliverableAndImpactHeadings} rows={rows} />;
}
