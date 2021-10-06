import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
	concat,
	FieldReadFunction,
} from "@apollo/client";
import { getToken } from "../utils";

const httpLink = new HttpLink({ uri: `${process.env.REACT_APP_BASEURL}graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
	operation.setContext(({ headers = {} }: any) => ({
		headers: {
			...headers,
			Authorization: `BEARER ${getToken()}`,
		},
	}));

	return forward(operation);
});

const removeDeletedElements: FieldReadFunction<any, any> = (
	arrayFromWhichElementsHaveToBeDeleted,
	{ readField }
) =>
	arrayFromWhichElementsHaveToBeDeleted?.filter(
		({ __ref }: { __ref: string }) => !readField("deleted", { __ref })
	);

const removeImpactCategoryUnitList: FieldReadFunction<any, any> = (
	impactCategoryUnits,
	{ readField }
) =>
	impactCategoryUnits?.filter(
		({ __ref }: { __ref: string }) =>
			readField("status", { __ref }) !== false &&
			!readField("deleted", readField("impact_category_org", { __ref })) &&
			!readField("deleted", readField("impact_units_org", { __ref }))
	);

const removeDeliverableCategoryUnitList: FieldReadFunction<any, any> = (
	deliverableCategoryUnits,
	{ readField }
) =>
	deliverableCategoryUnits?.filter(
		({ __ref }: { __ref: string }) =>
			readField("status", { __ref }) !== false &&
			!readField("deleted", readField("deliverable_category_org", { __ref })) &&
			!readField("deleted", readField("deliverable_units_org", { __ref }))
	);

// const removeDeletedProjectDonors: FieldReadFunction<any, any> = (projectDonors, { readField }) =>
// 	projectDonors?.filter(
// 		({ __ref }: { __ref: string }) => !readField("deleted", readField("donor", { __ref }))
// 	);

export const client = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					orgBudgetCategory: {
						read: removeDeletedElements,
					},
					impactCategoryOrgList: {
						read: removeDeletedElements,
					},
					impactUnitsOrgList: {
						read: removeDeletedElements,
					},
					impactCategoryUnitList: {
						read: removeImpactCategoryUnitList,
					},
					deliverableCategoryUnitList: {
						read: removeDeliverableCategoryUnitList,
					},
					deliverableCategory: {
						read: removeDeletedElements,
					},
					deliverableUnitOrg: {
						read: removeDeletedElements,
					},
					projBudgetTrackings: {
						read: removeDeletedElements,
					},
					projectBudgetTargets: {
						read: removeDeletedElements,
					},
					deliverableTargetList: {
						read: removeDeletedElements,
					},
					deliverableTrackingLineitemList: {
						read: removeDeletedElements,
					},
					impactTrackingLineitemList: {
						read: removeDeletedElements,
					},
					impactTargetProjectList: {
						read: removeDeletedElements,
					},
					fundReceiptProjectList: {
						read: removeDeletedElements,
					},
					grantPeriodsProjectList: {
						read: removeDeletedElements,
					},
					deliverable_category_org: {
						read: removeDeletedElements,
					},
					deliverable_units_org: {
						read: removeDeletedElements,
					},
					orgDonors: {
						read: removeDeletedElements,
					},
					orgProject: {
						read: removeDeletedElements,
					},
					// projectDonors: {
					// 	read: removeDeletedElements,
					// },
					t4DIndividuals: {
						read: removeDeletedElements,
					},
				},
			},
		},
	}),
	link: concat(authMiddleware, httpLink),
});
