import React, { useEffect } from "react";
import UnitsAndCategoriesProjectCount from "./UnitsAndCategoriesProjectCount";
import { useLazyQuery } from "@apollo/client";
import { GET_BUDGET_CATEGORY_PROJECT_COUNT } from "../../graphql/Budget";
import { GET_IMPACT_CATEGORY_PROJECT_COUNT } from "../../graphql/Impact/category";
import { GET_IMPACT_UNIT_PROJECT_COUNT } from "../../graphql/Impact/query";
import { GET_DELIVERABLE_CATEGORY_PROJECT_COUNT } from "../../graphql/Deliverable/category";
import { GET_DELIVERABLE_UNIT_PROJECT_COUNT } from "../../graphql/Deliverable/unit";

function UnitsAndCategoriesProjectCountGraphql({
	budgetCategoryId,
	impactCategoryId,
	impactUnitId,
	deliverableCategoryId,
	deliverableUnitId,
}: {
	budgetCategoryId?: string;
	impactCategoryId?: string;
	impactUnitId?: string;
	deliverableCategoryId?: string;
	deliverableUnitId?: string;
}) {
	console.log("deliverableCategoryId", deliverableCategoryId);
	const [getBudgetCategoryProjectCount, { data: budgetCategoryProjectCount }] = useLazyQuery<{
		projectCountBudgetCatByOrg: { project_count: number }[];
	}>(GET_BUDGET_CATEGORY_PROJECT_COUNT);

	const [getImpactCategoryProjectCount, { data: impactCategoryProjectCount }] = useLazyQuery<{
		projectCountImpCatByOrg: { count: number }[];
	}>(GET_IMPACT_CATEGORY_PROJECT_COUNT);

	const [getImpactUnitProjectCount, { data: impactUnitProjectCount }] = useLazyQuery<{
		projectCountImpUnit: { count: number }[];
	}>(GET_IMPACT_UNIT_PROJECT_COUNT);

	const [
		getDeliverableCategoryProjectCount,
		{ data: deliverableCategoryProjectCount },
	] = useLazyQuery<{
		projectCountDelCatByOrg: { count: number }[];
	}>(GET_DELIVERABLE_CATEGORY_PROJECT_COUNT);

	const [getDeliverableUnitProjectCount, { data: deliverableUnitProjectCount }] = useLazyQuery<{
		projectCountDelUnit: { count: number }[];
	}>(GET_DELIVERABLE_UNIT_PROJECT_COUNT);

	useEffect(() => {
		if (budgetCategoryId) {
			getBudgetCategoryProjectCount({
				variables: {
					filter: {
						budget_category_organization: budgetCategoryId,
					},
				},
			});
		}
	}, [budgetCategoryId, getBudgetCategoryProjectCount]);
	useEffect(() => {
		if (impactCategoryId) {
			getImpactCategoryProjectCount({
				variables: {
					filter: {
						impact_category_org: impactCategoryId,
					},
				},
			});
		}
	}, [impactCategoryId, getImpactCategoryProjectCount]);

	useEffect(() => {
		if (impactUnitId) {
			getImpactUnitProjectCount({
				variables: {
					filter: {
						impact_unit_org: impactUnitId,
					},
				},
			});
		}
	}, [impactUnitId, getImpactUnitProjectCount]);

	useEffect(() => {
		if (deliverableCategoryId) {
			getDeliverableCategoryProjectCount({
				variables: {
					filter: {
						deliverable_category_org: deliverableCategoryId,
					},
				},
			});
		}
	}, [deliverableCategoryId, getDeliverableCategoryProjectCount]);

	useEffect(() => {
		if (deliverableUnitId) {
			getDeliverableUnitProjectCount({
				variables: {
					filter: {
						deliverable_unit_org: deliverableUnitId,
					},
				},
			});
		}
	}, [deliverableUnitId, getDeliverableUnitProjectCount]);

	const data =
		budgetCategoryProjectCount?.projectCountBudgetCatByOrg[0]?.project_count ||
		impactCategoryProjectCount?.projectCountImpCatByOrg[0]?.count ||
		impactUnitProjectCount?.projectCountImpUnit[0]?.count ||
		deliverableCategoryProjectCount?.projectCountDelCatByOrg[0]?.count ||
		deliverableUnitProjectCount?.projectCountDelUnit[0]?.count;

	return <UnitsAndCategoriesProjectCount data={data} />;
}

export default UnitsAndCategoriesProjectCountGraphql;
