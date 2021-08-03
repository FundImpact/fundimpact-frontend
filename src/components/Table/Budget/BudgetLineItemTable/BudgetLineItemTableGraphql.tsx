import React, { useState, useEffect } from "react";
import BudgetLineItemTableContainer from "./BudgetLineItemTableContainer";
import {
	GET_PROJECT_BUDGET_TARCKING,
	GET_PROJ_BUDGET_TRACINGS_COUNT,
	GET_GRANT_PERIODS_PROJECT_LIST,
} from "../../../../graphql/Budget";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import pagination from "../../../../hooks/pagination";
import { budgetLineItemInputFields } from "./inputFields.json";
import { GET_ANNUAL_YEAR_LIST, GET_FINANCIAL_YEARS, GET_CURRENCY_LIST } from "../../../../graphql";
import { useLazyQuery } from "@apollo/client";
import { removeFilterListObjectElements } from "../../../../utils/filterList";
import { useRefetchOnBudgetLineItemImport } from "../../../../hooks/budget";

//make input field hidden
let grantPeriodHash = {};
let annualYearHash = {};
let financialYearDonorHash = {};
let financialYearOrgHash = {};

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

function BudgetLineItemTableGraphql({
	budgetTargetId,
	donor,
}: {
	budgetTargetId: string;
	donor: { id: string; country: { id: string } };
}) {
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const dashboardData = useDashBoardData();
	const currentProject = dashboardData?.project;
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		note: "",
		amount: "",
		grant_periods_project: [],
		annual_year: [],
		fy_org: [],
		fy_donor: [],
		reporting_date: "",
	});

	const { refetchOnBudgetLineItemImport } = useRefetchOnBudgetLineItemImport(budgetTargetId);

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	useEffect(() => {
		setQueryFilter({
			budget_targets_project: budgetTargetId,
		});
	}, [budgetTargetId]);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				budget_targets_project: budgetTargetId,
				...newFilterListObject,
			});
		}
	}, [filterList, budgetTargetId]);

	let [getCurrency, { data: currency }] = useLazyQuery(GET_CURRENCY_LIST);

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

	const [limit, setLimit] = useState(10);
	let {
		count,
		queryData: budgetLineitemList,
		changePage,
		countQueryLoading,
		queryLoading,
		queryRefetch,
		countRefetch,
	} = pagination({
		query: GET_PROJECT_BUDGET_TARCKING,
		countQuery: GET_PROJ_BUDGET_TRACINGS_COUNT,
		countFilter: queryFilter,
		queryFilter: queryFilter,
		limit: limit,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});

	let [getGrantPeriodProject, { data: grantPeriodProject }] = useLazyQuery(
		GET_GRANT_PERIODS_PROJECT_LIST,
		{
			onCompleted: (data) => {
				grantPeriodHash = mapIdToName(data.grantPeriodsProjectList, grantPeriodHash);
			},
		}
	);

	let [getAnnualYears, { data: annualYears }] = useLazyQuery(GET_ANNUAL_YEAR_LIST, {
		onCompleted: (data) => {
			annualYearHash = mapIdToName(data.annualYearList, annualYearHash);
		},
		onError: (err) => {
			console.error(err);
		},
	});
	if (annualYears && Object.keys(annualYearHash).length === 0) {
		annualYearHash = mapIdToName(annualYears.annualYearList, annualYearHash);
	}

	let [getFinancialYearOrg, { data: financialYearOrg }] = useLazyQuery(GET_FINANCIAL_YEARS, {
		onCompleted: (data) => {
			financialYearOrgHash = mapIdToName(data.financialYearList, financialYearOrgHash);
		},
	});

	let [getFinancialYearDonor, { data: financialYearDonor }] = useLazyQuery(GET_FINANCIAL_YEARS, {
		onCompleted: (data) => {
			financialYearDonorHash = mapIdToName(data.financialYearList, financialYearDonorHash);
		},
	});

	useEffect(() => {
		if (donor) {
			getGrantPeriodProject({
				variables: {
					filter: {
						donor: donor.id,
						project: currentProject?.id,
					},
				},
			});
		}
	}, [donor, getGrantPeriodProject, currentProject]);

	useEffect(() => {
		if (dashboardData?.organization) {
			getFinancialYearOrg({
				variables: {
					filter: {
						country: dashboardData?.organization?.country?.id,
					},
				},
			});
		}
	}, [dashboardData, getFinancialYearOrg]);

	useEffect(() => {
		if (donor) {
			getFinancialYearDonor({
				variables: {
					filter: {
						country: donor?.country?.id,
					},
				},
			});
		}
	}, [donor, getFinancialYearDonor]);

	useEffect(() => {
		getAnnualYears();
	}, [getAnnualYears]);

	if (grantPeriodProject) {
		budgetLineItemInputFields[2].optionsArray =
			grantPeriodProject?.grantPeriodsProjectList || [];
	}

	if (financialYearOrg) {
		budgetLineItemInputFields[4].optionsArray = financialYearOrg?.financialYearList || [];
	}

	if (annualYears) {
		budgetLineItemInputFields[3].optionsArray = annualYears?.annualYearList || [];
	}

	if (financialYearDonor) {
		budgetLineItemInputFields[5].optionsArray = financialYearDonor?.financialYearList || [];
	}

	return (
		<BudgetLineItemTableContainer
			budgetLineitemList={budgetLineitemList?.projBudgetTrackings || []}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			count={count}
			order={order}
			limit={limit}
			setLimit={setLimit}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			inputFields={budgetLineItemInputFields}
			grantPeriodHash={grantPeriodHash}
			annualYearHash={annualYearHash}
			financialYearDonorHash={financialYearDonorHash}
			financialYearOrgHash={financialYearOrgHash}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			currency={currency?.currencyList[0]?.code || ""}
			refetchOnSuccess={queryRefetch}
			budgetTargetId={budgetTargetId}
			donorCountryId={donor?.country?.id}
			countRefetch={countRefetch}
			refetchOnBudgetLineItemImport={refetchOnBudgetLineItemImport}
		/>
	);
}

export default BudgetLineItemTableGraphql;
