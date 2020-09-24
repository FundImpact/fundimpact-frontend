import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { budgetCategoryHeading as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { IBudgetCategory } from "../../../models/budget";
import BudgetCategory from "../../Budget/BudgetCategory";
import { FORM_ACTIONS } from "../../../models/constants";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { BUDGET_CATEGORY_ACTIONS } from "../../../utils/access/modules/budgetCategory/actions";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (budgetCategory: IBudgetCategory) => (
			<UnitsAndCategoriesProjectCount budgetCategoryId={budgetCategory.id} />
		),
	},
	{ valueAccessKey: "" },
];

function BudgetCategoryTableView({
	toggleDialogs,
	openDialogs,
	selectedBudgetCategory,
	initialValues,
	budgetCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
}: {
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedBudgetCategory: React.MutableRefObject<Required<IBudgetCategory> | null>;
	initialValues: Required<IBudgetCategory>;
	budgetCategoryList: Required<IBudgetCategory>[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}) {
	let budgetCategoryTableEditMenu: string[] = [];
	const budgetCategoryEditAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.CREATE_BUDGET_CATEGORY
	);

	useEffect(() => {
		if (budgetCategoryEditAccess) {
			budgetCategoryTableEditMenu = ["Edit Budget Category"];
		}
	}, [budgetCategoryEditAccess]);

	return (
		<CommonTable
			tableHeadings={tableHeadings}
			valuesList={budgetCategoryList}
			rows={rows}
			selectedRow={selectedBudgetCategory}
			toggleDialogs={toggleDialogs}
			editMenuName={budgetCategoryTableEditMenu}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
		>
			<BudgetCategory
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => toggleDialogs(0, false)}
				open={openDialogs[0]}
				initialValues={initialValues}
			/>
		</CommonTable>
	);
}

export default BudgetCategoryTableView;
