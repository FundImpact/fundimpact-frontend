import React, { useEffect } from "react";
import ImpactCategoryContainer from "./ImpactCategoryContainer";
import { useLazyQuery } from "@apollo/client";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IGetImpactCategory, IGetImpactCategoryVariables } from "../../../models/impact/query";

function ImpactCategoryGraphql() {
	const [getImpactCategoryList, { data: impactCategoryList }] = useLazyQuery<
		IGetImpactCategory,
		IGetImpactCategoryVariables
	>(GET_IMPACT_CATEGORY_BY_ORG);
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (dashboardData?.organization) {
			getImpactCategoryList({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);

	return <ImpactCategoryContainer impactCategoryList={impactCategoryList} />;
}

export default ImpactCategoryGraphql;
