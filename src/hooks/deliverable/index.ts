import { DocumentNode, useApolloClient } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
} from "../../graphql/Deliverable/target";
import { GET_DELIVERABLE_UNIT_BY_ORG } from "../../graphql/Deliverable/unit";
import {
	GET_ALL_DELIVERABLES_SPEND_AMOUNT,
	GET_ALL_DELIVERABLES_TARGET_AMOUNT,
} from "../../graphql/project";
import { DELIVERABLE_TYPE } from "../../models/constants";

const useRefetchOnDeliverableTargetImport = () => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	// const refetchOnDeliverableTargetImport = (typeVal: any) => {
	const refetchOnDeliverableTargetImport = (formType: DELIVERABLE_TYPE) => {
		let typeVal: any;

		if (formType === "deliverable") {
			typeVal = 6;
		} else if (formType === "outcome") {
			typeVal = 5;
		} else if (formType === "output") {
			typeVal = 4;
		} else if (formType === "impact") {
			typeVal = 3;
		}

		apolloClient.query({
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: { filter: { project: dashboardData?.project?.id, type: typeVal } },
			// variables: { filter: { project: dashboardData?.project?.id, type: formType } },
			fetchPolicy: "network-only",
		});
		apolloClient.query({
			query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
			variables: {
				filter: {
					project: dashboardData?.project?.id,
					deliverable_target_project: {
						type: typeVal,
						// type: formType,
					},
				},
			},
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

const useRefetchDeliverableMastersOnDeliverableMasterImport = () => {
	const apolloClient = useApolloClient();
	const dashboardData = useDashBoardData();
	const refetchMaster = (query: DocumentNode) => {
		apolloClient.query({
			query,
			variables: {
				filter: {
					organization: dashboardData?.organization?.id,
				},
			},
			fetchPolicy: "network-only",
		});
	};
	const refetchDeliverableCategoryOnDeliverableCategoryImport = () => {
		refetchMaster(GET_DELIVERABLE_ORG_CATEGORY);
	};
	const refetchDeliverableUnitOnDeliverableUnitImport = () => {
		refetchMaster(GET_DELIVERABLE_UNIT_BY_ORG);
	};
	return {
		refetchDeliverableCategoryOnDeliverableCategoryImport,
		refetchDeliverableUnitOnDeliverableUnitImport,
	};
};

export {
	useRefetchOnDeliverableTargetImport,
	useRefetchOnDeliverableLineItemImport,
	useRefetchDeliverableMastersOnDeliverableMasterImport,
};
