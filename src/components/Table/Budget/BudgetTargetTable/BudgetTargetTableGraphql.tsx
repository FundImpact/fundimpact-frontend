import React, { useState, useEffect, useCallback } from "react";
import BudgetTargetTableContainer from "./BudgetTargetTableContainer";
import pagination from "../../../../hooks/pagination";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_PROJECT_BUDGET_TARGETS_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
} from "../../../../graphql/Budget";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { budgetTargetInputFields } from "./inputFields.json";
import { GET_ORG_DONOR } from "../../../../graphql/donor";
import { useLazyQuery } from "@apollo/client";
import { GET_CURRENCY_LIST } from "../../../../graphql";
import { removeFilterListObjectElements } from "../../../../utils/filterList";
import { IGetProjectDonor } from "../../../../models/project/project";
import { GET_PROJ_DONORS } from "../../../../graphql/project";
import { useRefetchOnBudgetTargetImport } from "../../../../hooks/budget";

let donorHash = {};
let budgetCategoryHash = {};

const mapIdToName = (
	arr: { id: string; name: string }[],
	initialObject: { [key: string]: string }
) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		initialObject
	);
};

const getDonors = (projectDonors: IGetProjectDonor | undefined) =>
	projectDonors?.projectDonors?.map((projectDonor) => projectDonor?.donor);

const getDefaultFilterList = () => ({
	name: "",
	code: "",
	description: "",
	donor: [],
	budget_category_organization: [],
});

function BudgetTargetTableGraphql() {
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const dashboardData = useDashBoardData();
	const currentProject = dashboardData?.project;
	const { refetchOnBudgetTargetImport } = useRefetchOnBudgetTargetImport();
	let [getProjectDonors, { data: projectDonors }] = useLazyQuery<IGetProjectDonor>(
		GET_PROJ_DONORS,
		{
			onCompleted: (projectDonors) =>
				(donorHash = mapIdToName(
					getDonors(projectDonors) as { name: string; id: string }[],
					donorHash
				)),
		}
	);

	let [getBudgetCategory, { data: budgetCategory }] = useLazyQuery(
		GET_ORGANIZATION_BUDGET_CATEGORY,
		{
			onCompleted: (data) => {
				budgetCategoryHash = mapIdToName(data.orgBudgetCategory, budgetCategoryHash);
			},
		}
	);

	let [getCurrency, { data: currency }] = useLazyQuery(GET_CURRENCY_LIST);

	useEffect(() => {
		if (dashboardData?.project) {
			getProjectDonors({
				variables: {
					filter: {
						project: dashboardData?.project?.id,
					},
				},
			});
		}
	}, [getProjectDonors, dashboardData]);

	useEffect(() => {
		if (dashboardData) {
			getCurrency({
				variables: {
					filter: {
						country: dashboardData?.organization?.country?.id,
					},
				},
			});
		}
	}, [getCurrency, dashboardData]);

	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>(getDefaultFilterList());

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		setQueryFilter({
			project: currentProject?.id,
		});
		setFilterList(getDefaultFilterList());
	}, [currentProject, setFilterList, setQueryFilter]);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				project: currentProject?.id,
				...newFilterListObject,
			});
		}
	}, [filterList, currentProject]);

	const [limit, setLimit] = useState(10);
	let {
		count,
		queryData: budgetTargetList,
		changePage,
		queryLoading,
		countQueryLoading,
		queryRefetch: refetchBudgetTargetList,
		countRefetch: refetchBudgetTargetTableCount,
	} = pagination({
		query: GET_BUDGET_TARGET_PROJECT,
		countQuery: GET_PROJECT_BUDGET_TARGETS_COUNT,
		countFilter: queryFilter,
		limit: limit,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(currentProject),
	});

	const refetchBudgetTargetTable = useCallback(() => {
		refetchBudgetTargetTableCount?.().then(() => refetchBudgetTargetList?.());
		refetchOnBudgetTargetImport();
	}, [refetchBudgetTargetTableCount, refetchBudgetTargetList]);

	useEffect(() => {
		if (dashboardData?.organization) {
			getBudgetCategory({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [getBudgetCategory, dashboardData]);

	(budgetTargetInputFields[2].optionsArray as { id: string; name: string }[]) =
		getDonors(projectDonors) || [];
	budgetTargetInputFields[3].optionsArray = budgetCategory?.orgBudgetCategory || [];

	return (
		<BudgetTargetTableContainer
			budgetTargetList={budgetTargetList?.projectBudgetTargets || []}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			count={count}
			limit={limit}
			setLimit={setLimit}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			inputFields={budgetTargetInputFields}
			donorHash={donorHash}
			budgetCategoryHash={budgetCategoryHash}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			currency={currency?.currencyList[0]?.code || ""}
			refetchBudgetTargetTable={refetchBudgetTargetTable}
		/>
	);
}

export default BudgetTargetTableGraphql;
