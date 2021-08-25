import { ApolloClient, useApolloClient } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { GET_PROJECT_DOCUMENTS } from "../../graphql";
import { GET_ATTACHMENT_IN_PROJECT_DELIVERABLE_IMPACT_BUDGET_BY_PROJECT } from "../../graphql/project";
import { IDashboardDataContext } from "../../models";

const reftechProjectDocuments = (
	apolloClient: ApolloClient<object>,
	dashboardData: IDashboardDataContext | undefined
) => {
	apolloClient.query({
		query: GET_PROJECT_DOCUMENTS,
		variables: { filter: { id: dashboardData?.project?.id } },
		fetchPolicy: "network-only",
	});
};

const reftechDocumentsTableData = (
	apolloClient: ApolloClient<object>,
	dashboardData: IDashboardDataContext | undefined,
	projectId?: String
) => {
	if (dashboardData?.project?.id) {
		apolloClient.query({
			query: GET_ATTACHMENT_IN_PROJECT_DELIVERABLE_IMPACT_BUDGET_BY_PROJECT,
			variables: { project: projectId || dashboardData?.project?.id },
			fetchPolicy: "network-only",
		});
	}
};

const useDocumentTableDataRefetch = ({
	projectDocumentRefetch = false,
}: {
	projectDocumentRefetch?: boolean;
}) => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	return {
		refetchDocuments: (projectId?: String) => {
			reftechDocumentsTableData(apolloClient, dashboardData, projectId);
			projectDocumentRefetch && reftechProjectDocuments(apolloClient, dashboardData);
		},
	};
};

export { useDocumentTableDataRefetch };
