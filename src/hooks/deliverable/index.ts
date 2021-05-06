import { useApolloClient } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
} from "../../graphql/Deliverable/target";
import {
	GET_ALL_DELIVERABLES_SPEND_AMOUNT,
	GET_ALL_DELIVERABLES_TARGET_AMOUNT,
} from "../../graphql/project";

const useRefetchOnDeliverableTargetImport = () => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchOnDeliverableTargetImport = () => {
		apolloClient.query({
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
	};
	return { refetchOnDeliverableTargetImport };
};

const useRefetchOnDeliverableLineItemImport = (deliverableTargetProject: string) => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchOnDeliverableLineItemImport = () => {
		apolloClient.query({
			query: GET_ACHIEVED_VALLUE_BY_TARGET,
			variables: { filter: { deliverableTargetProject } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
	};
	return { refetchOnDeliverableLineItemImport };
};

export { useRefetchOnDeliverableTargetImport, useRefetchOnDeliverableLineItemImport };
