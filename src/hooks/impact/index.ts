import { useApolloClient } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { GET_ACHIEVED_VALLUE_BY_TARGET } from "../../graphql/Impact/target";
import {
	GET_ALL_IMPACT_AMOUNT_SPEND,
	GET_ALL_IMPACT_TARGET_AMOUNT,
} from "../../graphql/Impact/query";
import { GET_IMPACT_TARGET_BY_PROJECT } from "../../graphql/Impact/target";
import { GET_IMPACT_TARGET_SDG_COUNT } from "../../graphql/project";

const useRefetchOnImpactTargetImport = () => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchOnImpactTargetImport = () => {
		apolloClient.query({
			query: GET_IMPACT_TARGET_BY_PROJECT,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_IMPACT_TARGET_SDG_COUNT,
			variables: { filter: { organization: dashboardData?.organization?.id } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_ALL_IMPACT_TARGET_AMOUNT,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_ALL_IMPACT_AMOUNT_SPEND,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
	};
	return { refetchOnImpactTargetImport };
};

const useRefetchOnImpactLineItemImport = (impactTargetProject: string) => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchOnImpactLineItemImport = () => {
		apolloClient.query({
			query: GET_ACHIEVED_VALLUE_BY_TARGET,
			variables: { filter: { impactTargetProject } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_ALL_IMPACT_AMOUNT_SPEND,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
	};
	return { refetchOnImpactLineItemImport };
};

export { useRefetchOnImpactTargetImport, useRefetchOnImpactLineItemImport };
