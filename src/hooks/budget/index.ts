import { useLazyQuery, useMutation, ApolloClient, useApolloClient } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
} from "../../graphql/Budget";
import { GET_PROJECT_AMOUNT_SPEND, GET_PROJECT_BUDGET_AMOUNT } from "../../graphql/project";

const useRefetchOnBudgetTargetImport = () => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchOnBudgetTargetImport = () => {
		apolloClient.query({
			query: GET_PROJECT_BUDGET_AMOUNT,
			variables: {
				filter: {
					project: dashboardData?.project?.id,
				},
			},
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project_with_budget_targets: {
						project: dashboardData?.project?.id,
					},
				},
			},
			fetchPolicy: "network-only",
		});
	};
	return { refetchOnBudgetTargetImport };
};

const useRefetchOnBudgetLineItemImport = (budgetTargetsProject: string) => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchOnBudgetLineItemImport = () => {
		apolloClient.query({
			query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
			variables: { filter: { budgetTargetsProject } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_PROJECT_AMOUNT_SPEND,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
	};
	return { refetchOnBudgetLineItemImport };
};

const useRefetchBudgetCategoryOnBudgetCategoryImport = () => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchBudgetCategoryOnBudgetCategoryImport = () => {
		apolloClient.query({
			query: GET_ORGANIZATION_BUDGET_CATEGORY,
			variables: {
				filter: {
					organization: dashboardData?.organization?.id,
				},
			},
			fetchPolicy: "network-only",
		});
	};
	return { refetchBudgetCategoryOnBudgetCategoryImport };
};

export {
	useRefetchOnBudgetTargetImport,
	useRefetchOnBudgetLineItemImport,
	useRefetchBudgetCategoryOnBudgetCategoryImport,
};
