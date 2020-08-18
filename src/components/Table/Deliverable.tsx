import React, { useEffect, useState } from "react";
import { GET_DELIVERABLE_TARGET_BY_PROJECT } from "../../graphql/queries/Deliverable/target";
import { useLazyQuery } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { deliverableAndImpactHeadings } from "./constants";
import FITable from "./FITable";

export default function DeliverablesTable() {
	const dashboardData = useDashBoardData();
	const [getDeliverableTargetByProject, { loading, data }] = useLazyQuery(
		GET_DELIVERABLE_TARGET_BY_PROJECT
	);
	useEffect(() => {
		if (dashboardData?.project) {
			getDeliverableTargetByProject({
				variables: { filter: { project: dashboardData?.project.id } },
			});
		}
	}, [dashboardData, dashboardData?.project]);

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
					];
					arr.push(row);
				}
			}
			setRows(arr);
		}
	}, [data]);

	return <FITable tableHeading={deliverableAndImpactHeadings} rows={rows} />;
}
