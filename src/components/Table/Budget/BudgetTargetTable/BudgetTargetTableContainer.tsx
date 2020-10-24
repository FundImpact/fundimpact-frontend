import React, { useState, useRef } from "react";
import BudgetTargetTableView from "./BudgetTargetTableView";
import { IBudgetTargetProjectResponse } from "../../../../models/budget/query";
import {
	IBudgetTargetForm,
	IBudgetTrackingLineitemForm,
} from "../../../../models/budget/budgetForm";
import { getTodaysDate } from "../../../../utils";

function getBudgetTargetInitialValues(
	budgetTarget: IBudgetTargetProjectResponse | null
): IBudgetTargetForm {
	return {
		name: budgetTarget?.name || "",
		description: budgetTarget?.description || "",
		total_target_amount: budgetTarget?.total_target_amount || "",
		id: budgetTarget?.id || "",
		budget_category_organization: budgetTarget?.budget_category_organization?.id || "",
		donor: budgetTarget?.donor?.id || "",
	};
}

const getBudgetLineItemInitialValues = (
	budget_targets_project: string
): IBudgetTrackingLineitemForm => {
	return {
		amount: "",
		note: "",
		budget_targets_project,
		annual_year: "",
		reporting_date: getTodaysDate(),
		grant_periods_project: "",
		fy_org: "",
		fy_donor: "",
	};
};

function BudgetTargetTableContainer({
	budgetTargetList,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	inputFields,
	donorHash,
	budgetCategoryHash,
	filterList,
	setFilterList,
	removeFilterListElements,
	currency,
}: {
	budgetTargetList: IBudgetTargetProjectResponse[];
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	inputFields: any[];
	donorHash: { [key: string]: string };
	budgetCategoryHash: { [key: string]: string };
	filterList: {
		[key: string]: string | string[];
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	currency: string;
}) {
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false, false]);
	const selectedBudgetTarget = useRef<IBudgetTargetProjectResponse | null>(null);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};

	return (
		<BudgetTargetTableView
			toggleDialogs={toggleDialogs}
			openDialogs={openDialogs}
			selectedBudgetTarget={selectedBudgetTarget}
			initialValues={getBudgetTargetInitialValues(selectedBudgetTarget.current)}
			budgegtTargetList={budgetTargetList}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			budgetLineItemInitialValues={getBudgetLineItemInitialValues(
				(selectedBudgetTarget.current && selectedBudgetTarget.current.id) || ""
			)}
			inputFields={inputFields}
			filterList={filterList}
			setFilterList={setFilterList}
			donorHash={donorHash}
			budgetCategoryHash={budgetCategoryHash}
			removeFilterListElements={removeFilterListElements}
			currency={currency}
		/>
	);
}

export default BudgetTargetTableContainer;
