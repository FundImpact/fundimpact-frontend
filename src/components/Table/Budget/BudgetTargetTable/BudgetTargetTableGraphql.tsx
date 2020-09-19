import React, { useState, useEffect } from "react";
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

let donorHash = {};
let budgetCategoryHash = {};

const mapIdToName = (arr: { id: string; name: string }[], obj: { [key: string]: string }) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		obj
	);
};

function BudgetTargetTableGraphql() {
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const dashboardData = useDashBoardData();
	const currentProject = dashboardData?.project;

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onCompleted: (data) => {
			donorHash = mapIdToName(data.orgDonors, donorHash);
		},
	});

	let [getBudgetCategory, { data: budgetCategory }] = useLazyQuery(
		GET_ORGANIZATION_BUDGET_CATEGORY,
		{
			onCompleted: (data) => {
				budgetCategoryHash = mapIdToName(data.orgBudgetCategory, budgetCategoryHash);
			},
		}
	);

	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		code: "",
		description: "",
		donor: [],
		budget_category_organization: [],
	});

	const removeFilterListElements = (key: string, index?: number) => {
		setFilterList((obj) => {
			if (Array.isArray(obj[key])) {
				obj[key] = (obj[key] as string[]).filter((ele, i) => index != i);
			} else {
				obj[key] = "";
			}
			return { ...obj };
		});
	};

	useEffect(() => {
		setQueryFilter({
			project: currentProject?.id,
		});
	}, [currentProject]);

	useEffect(() => {
		if (filterList) {
			let obj: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					obj[key] = filterList[key];
				}
			}
			setQueryFilter({
				project: currentProject?.id,
				...obj,
			});
		}
	}, [filterList]);

	let {
		count,
		queryData: budgetTargetList,
		changePage,
		queryLoading,
		countQueryLoading,
	} = pagination({
		query: GET_BUDGET_TARGET_PROJECT,
		countQuery: GET_PROJECT_BUDGET_TARGETS_COUNT,
		countFilter: queryFilter,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(currentProject),
	});

	useEffect(() => {
		if (dashboardData?.organization) {
			getOrganizationDonors({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);

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

	budgetTargetInputFields[2].optionsArray = donors?.orgDonors || [];
	budgetTargetInputFields[3].optionsArray = budgetCategory?.orgBudgetCategory || [];

	return (
		<BudgetTargetTableContainer
			budgetTargetList={budgetTargetList?.projectBudgetTargets || []}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			count={count}
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
		/>
	);
}

export default BudgetTargetTableGraphql;
