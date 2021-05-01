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

const removeDeletedBudgetCategoryOrganizations: FieldReadFunction<any, any> = (
	budgetCategoryOrganizations,
	{ readField }
) =>
	budgetCategoryOrganizations?.filter(
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

const removeDeletedProjectDonors: FieldReadFunction<any, any> = (projectDonors, { readField }) =>
	projectDonors?.filter(
		({ __ref }: { __ref: string }) => !readField("deleted", readField("donor", { __ref }))
	);

export const client = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					orgBudgetCategory: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					impactCategoryOrgList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					impactUnitsOrgList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					impactCategoryUnitList: {
						read: removeImpactCategoryUnitList,
					},
					deliverableCategoryUnitList: {
						read: removeDeliverableCategoryUnitList,
					},
					deliverableCategory: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					deliverableUnitOrg: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					projBudgetTrackings: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					projectBudgetTargets: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					deliverableTargetList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					deliverableTrackingLineitemList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					impactTrackingLineitemList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					impactTargetProjectList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					fundReceiptProjectList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					grantPeriodsProjectList: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					deliverable_category_org: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					deliverable_units_org: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					orgDonors: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
					projectDonors: {
						read: removeDeletedProjectDonors,
					},
					t4DIndividuals: {
						read: removeDeletedBudgetCategoryOrganizations,
					},
				},
			},
		},
	}),
	link: concat(authMiddleware, httpLink),
});
