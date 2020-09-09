import React, { useEffect, useState } from "react";
import ImpactUnitContainer from "./ImpactUnitContainer";
import { useLazyQuery } from "@apollo/client";
import { GET_IMPACT_UNIT_BY_ORG } from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	IGetImpactUnit,
	IGetImpactUnitVariables,
	IGetImpactCategoryUnit,
	IGetImpactCategoryUnitVariables,
} from "../../../models/impact/query";
import { GET_IMPACT_CATEGORY_UNIT } from "../../../graphql/Impact/categoryUnit";
import { IImpactUnitData, IImpactCategoryData } from "../../../models/impact/impact";

function ImpactUnitGraphql({
	collapsableTable = true,
	rowId: impactCategoryId,
}: {
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const [impactUnitList, setImpactUnitList] = useState<IImpactUnitData[]>([]);

	const [getImpactUnitList] = useLazyQuery<
		IGetImpactUnit,
		IGetImpactUnitVariables
	>(GET_IMPACT_UNIT_BY_ORG, {
		onCompleted: (data) => {
			if (collapsableTable) {
				setImpactUnitList(data?.impactUnitsOrgList || []);
			}
		},
	});

	const [getImpactCategoryUnitList] = useLazyQuery<
		IGetImpactCategoryUnit,
		IGetImpactCategoryUnitVariables
	>(GET_IMPACT_CATEGORY_UNIT, {
		onCompleted: (data) => {
			if (!collapsableTable) {
				setImpactUnitList(
					data?.impactCategoryUnitList?.map(
						(element: {
							impact_category_org: IImpactCategoryData;
							impact_units_org: IImpactUnitData;
						}) => element?.impact_units_org
					) || []
				);
			}
		},
	});

	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (dashboardData?.organization && collapsableTable) {
			getImpactUnitList({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);

	useEffect(() => {
		if (impactCategoryId && !collapsableTable) {
			getImpactCategoryUnitList({
				variables: {
					filter: {
						impact_category_org: impactCategoryId
					},
				},
			});
		}
	}, [impactCategoryId]);

	return (
		<ImpactUnitContainer impactUnitList={impactUnitList} collapsableTable={collapsableTable} />
	);
}

export default ImpactUnitGraphql;
