import React, { useState, useRef } from "react";
import BudgetLineItemTableView from "./BudgetLineItemTableView";
import { IBUDGET_LINE_ITEM_RESPONSE } from "../../../../models/budget/query";
import { IBudgetTrackingLineitem } from "../../../../models/budget";
import { getTodaysDate } from "../../../../utils";
import { ApolloQueryResult } from "@apollo/client";

const getInitialValues = (
	budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE | null
): IBudgetTrackingLineitem => {
	return {
		amount: budgetLineItem?.amount || 0,
		note: budgetLineItem?.note || "",
		budget_targets_project: budgetLineItem?.budget_targets_project?.id || "",
		annual_year: budgetLineItem?.annual_year?.id || "",
		reporting_date: getTodaysDate(budgetLineItem?.reporting_date || undefined),
		id: budgetLineItem?.id || "",
		grant_periods_project: budgetLineItem?.grant_periods_project?.id || "",
		fy_org: budgetLineItem?.fy_org?.id || "",
		fy_donor: budgetLineItem?.fy_donor?.id || "",
		attachments: budgetLineItem?.attachments || [],
	};
};

function BudgetLineItemTableContainer({
	budgetLineitemList,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	inputFields,
	grantPeriodHash,
	annualYearHash,
	financialYearDonorHash,
	financialYearOrgHash,
	filterList,
	setFilterList,
	removeFilterListElements,
	currency,
	refetchOnSuccess,
	budgetTargetId,
}: {
	budgetLineitemList: IBUDGET_LINE_ITEM_RESPONSE[];
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	inputFields: any[];
	grantPeriodHash: { [key: string]: string };
	annualYearHash: { [key: string]: string };
	financialYearDonorHash: { [key: string]: string };
	financialYearOrgHash: { [key: string]: string };
	filterList: {
		[key: string]: string | string[];
	};
	budgetTargetId: string;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	currency: string;
	refetchOnSuccess:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| undefined;
}) {
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);
	const selectedBudgetLineItem = useRef<IBUDGET_LINE_ITEM_RESPONSE | null>(null);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	return (
		<BudgetLineItemTableView
			toggleDialogs={toggleDialogs}
			openDialogs={openDialogs}
			selectedBudgetLineItem={selectedBudgetLineItem}
			initialValues={getInitialValues(selectedBudgetLineItem.current)}
			budgetLineitemList={budgetLineitemList}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			inputFields={inputFields}
			removeFilterListElements={removeFilterListElements}
			filterList={filterList}
			setFilterList={setFilterList}
			grantPeriodHash={grantPeriodHash}
			annualYearHash={annualYearHash}
			financialYearDonorHash={financialYearDonorHash}
			financialYearOrgHash={financialYearOrgHash}
			currency={currency}
			refetchOnSuccess={refetchOnSuccess}
			budgetTargetId={budgetTargetId}
		/>
	);
}

export default BudgetLineItemTableContainer;
