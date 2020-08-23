import React, { useEffect } from "react";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM } from "../../../graphql/queries/budget/query";

const AmountSpent = ({ budgetTargetId, children }: { budgetTargetId: string; children: any }) => {
	const apolloClient = useApolloClient();
	let [getSpentAmount] = useLazyQuery(GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM);

	let oldCachedBudgetTargetProjectData: { projBudgetTrackingsTotalAmount: number } | null = null;
	try {
		oldCachedBudgetTargetProjectData = apolloClient.readQuery<{
			projBudgetTrackingsTotalAmount: number;
		}>({
			query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
			variables: {
				filter: {
					budgetTargetsProject: budgetTargetId,
				},
			},
		});
	} catch (error) {}

	useEffect(() => {
		if (!oldCachedBudgetTargetProjectData) {
			getSpentAmount({
				variables: {
					filter: {
						budgetTargetsProject: budgetTargetId,
					},
				},
			});
		}
	}, [oldCachedBudgetTargetProjectData, budgetTargetId]);

	if (!oldCachedBudgetTargetProjectData) {
		return <span>{children(0)}</span>;
	}

	return <span>{children(oldCachedBudgetTargetProjectData.projBudgetTrackingsTotalAmount)}</span>;
};

export default AmountSpent;
