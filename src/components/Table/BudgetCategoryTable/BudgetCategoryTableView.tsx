import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { budgetCategoryHeading as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { IBudgetCategory } from "../../../models/budget";
import BudgetCategory from "../../Budget/BudgetCategory";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { BUDGET_CATEGORY_ACTIONS } from "../../../utils/access/modules/budgetCategory/actions";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	BUDGET_CATEGORY_TABLE_EXPORT,
	BUDGET_CATEGORY_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import { ApolloQueryResult, OperationVariables, useApolloClient } from "@apollo/client";
import { Button, useTheme } from "@material-ui/core";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";

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
	// { valueAccessKey: "" },
];

let budgetCategoryTableEditMenu: string[] = [];

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
	budgetCategoryTableRefetch,
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
	budgetCategoryTableRefetch: () => void;
}) {
	const budgetCategoryEditAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.UPDATE_BUDGET_CATEGORY
	);

	const budgetCategoryDeleteAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.DELETE_BUDGET_CATEGORY
	);
	const budgetCategoryImportFromCsvAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_IMPORT_FROM_CSV
	);

	const budgetCategoryExportAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_EXPORT
	);

	const onImportTableSuccess = () => budgetCategoryTableRefetch && budgetCategoryTableRefetch();

	useEffect(() => {
		if (budgetCategoryEditAccess) {
			budgetCategoryTableEditMenu[0] = "Edit Budget Category";
		}
	}, [budgetCategoryEditAccess]);

	useEffect(() => {
		if (budgetCategoryDeleteAccess) {
			budgetCategoryTableEditMenu[1] = "Delete Budget Category";
		}
	}, [budgetCategoryDeleteAccess]);

	const theme = useTheme();
	const { jwt } = useAuth();

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
			tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
				<ImportExportTableMenu
					tableName="Budget Category"
					tableExportUrl={BUDGET_CATEGORY_TABLE_EXPORT}
					tableImportUrl={BUDGET_CATEGORY_TABLE_IMPORT}
					onImportTableSuccess={onImportTableSuccess}
					importButtonOnly={importButtonOnly}
					hideImport={!budgetCategoryImportFromCsvAccess}
					hideExport={!budgetCategoryExportAccess}
				>
					<Button
						variant="outlined"
						style={{ marginRight: theme.spacing(1), float: "right" }}
						onClick={() =>
							exportTable({
								tableName: "Budget Category Template",
								jwt: jwt as string,
								tableExportUrl: `${BUDGET_CATEGORY_TABLE_EXPORT}?header=true`,
							})
						}
					>
						Budget Category Template
					</Button>
				</ImportExportTableMenu>
			)}
		>
			<>
				<BudgetCategory
					formAction={FORM_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(0, false)}
					open={openDialogs[0]}
					initialValues={initialValues}
				/>
				<BudgetCategory
					formAction={FORM_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(1, false)}
					open={openDialogs[1]}
					initialValues={initialValues}
					dialogType={DIALOG_TYPE.DELETE}
				/>
			</>
		</CommonTable>
	);
}

export default BudgetCategoryTableView;
