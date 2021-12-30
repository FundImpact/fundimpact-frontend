import React, { useEffect } from "react";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import {
	GET_BUDGET_SUB_TARGETS_COUNT,
	GET_PROJ_BUDGET_TRACINGS_COUNT,
} from "../../../../graphql/Budget";
import { useDashBoardData } from "../../../../contexts/dashboardContext";

const AmountSpent = ({
	budgetTargetId,
	children,
}: {
	budgetTargetId: string;
	children: (props: number, spent: number) => React.ReactNode;
}) => {
	const apolloClient = useApolloClient();
	let [getSpentAmount, { data: spentAmountResponse }] = useLazyQuery(
		GET_PROJ_BUDGET_TRACINGS_COUNT
	);
	const dashboardData = useDashBoardData();

	console.log("spentAmountResponse", spentAmountResponse);

	let oldCachedBudgetTargetProjectData: {
		budgetTrackingLineitemsConnection: {
			aggregate: {
				sum: {
					amount: number;
				};
			};
		};
	} | null = null;
	try {
		oldCachedBudgetTargetProjectData = apolloClient.readQuery<{
			budgetTrackingLineitemsConnection: {
				aggregate: {
					sum: {
						amount: number;
					};
				};
			};
		}>({
			query: GET_PROJ_BUDGET_TRACINGS_COUNT,
			variables: {
				filter: {
					budget_sub_target: {
						budget_targets_project: budgetTargetId,
						project: dashboardData?.project?.id,
					},
					deleted: false,
					// budget_sub_target: budgetTargetId,
				},
			},
		});
	} catch (error) {}

	let [getTotalAmount] = useLazyQuery(GET_BUDGET_SUB_TARGETS_COUNT);

	let oldCachedBudgetSubTargetTotal: {
		budgetSubTargetsConnection: {
			aggregate: {
				sum: {
					target_value: number;
				};
			};
		};
	} | null = null;
	try {
		oldCachedBudgetSubTargetTotal = apolloClient.readQuery<{
			budgetSubTargetsConnection: {
				aggregate: {
					sum: {
						target_value: number;
					};
				};
			};
		}>({
			query: GET_BUDGET_SUB_TARGETS_COUNT,
			variables: {
				filter: {
					budget_targets_project: budgetTargetId,
					project: dashboardData?.project?.id,
				},
			},
		});
	} catch (error) {}

	// useEffect(() => {}, [oldCachedBudgetSubTargetTotal, budgetTargetId, getTotalAmount]);
	useEffect(() => {
		if (!oldCachedBudgetTargetProjectData) {
			getSpentAmount({
				variables: {
					filter: {
						budget_sub_target: {
							budget_targets_project: budgetTargetId,
							project: dashboardData?.project?.id,
						},
						deleted: false,
					},
				},
			});
		}
		if (!oldCachedBudgetSubTargetTotal) {
			getTotalAmount({
				variables: {
					filter: {
						budget_targets_project: budgetTargetId,
						project: dashboardData?.project?.id,
					},
				},
			});
		}
	}, [
		oldCachedBudgetTargetProjectData,
		oldCachedBudgetSubTargetTotal,
		budgetTargetId,
		getSpentAmount,
		dashboardData,
	]);

	console.log("oldCachedBudgetTargetProjectData", oldCachedBudgetTargetProjectData);

	return (
		<span>
			{children(
				oldCachedBudgetSubTargetTotal?.budgetSubTargetsConnection.aggregate.sum
					.target_value || 0,
				oldCachedBudgetTargetProjectData?.budgetTrackingLineitemsConnection.aggregate?.sum
					?.amount || 0
			)}
		</span>
	);
};

export default AmountSpent;
