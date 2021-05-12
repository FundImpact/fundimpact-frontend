import { useApolloClient } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { GET_PROJECT_AMOUNT_RECEIVED } from "../../graphql/project";

const useRefetchOnFundReceivedImport = () => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchOnFundReceivedImport = () => {
		apolloClient.query({
			query: GET_PROJECT_AMOUNT_RECEIVED,
			variables: { filter: { project: dashboardData?.project?.id } },
			fetchPolicy: "network-only",
		});
	};
	return { refetchOnFundReceivedImport };
};

export { useRefetchOnFundReceivedImport };
