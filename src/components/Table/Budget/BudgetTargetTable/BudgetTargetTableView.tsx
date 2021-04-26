import React, { useEffect, useMemo } from "react";
import CommonTable from "../../CommonTable";
import { budgetTargetTableHeading as tableHeadings } from "../../constants";
import BudgetTarget from "../../../Budget/BudgetTarget";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../../models/constants";
import {
	IBudgetTargetProjectResponse,
	IGET_BUDGET_TARGET_PROJECT,
} from "../../../../models/budget/query";
import {
	IBudgetTargetForm,
	IBudgetTrackingLineitemForm,
} from "../../../../models/budget/budgetForm";
import AmountSpent from "./AmountSpent";
import BudgetLineItemTable from "../BudgetLineItemTable";
import { Grid, Box, Typography, Chip, Avatar, Button, useTheme } from "@material-ui/core";
import BudgetLineitem from "../../../Budget/BudgetLineitem";
import FilterList from "../../../FilterList";
import { BUDGET_TARGET_ACTIONS } from "../../../../utils/access/modules/budgetTarget/actions";
import { MODULE_CODES, userHasAccess } from "../../../../utils/access";
import { BUDGET_TARGET_LINE_ITEM_ACTIONS } from "../../../../utils/access/modules/budgetTargetLineItem/actions";
import { BUDGET_CATEGORY_ACTIONS } from "../../../../utils/access/modules/budgetCategory/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../../utils";
import { BUDGET_TARGET_DONOR_ACTION } from "../../../../utils/access/modules/budgetTargetDonor/actions";
import { CURRENCY_ACTION } from "../../../../utils/access/modules/currency/actions";
import { ITableHeadings } from "../../../../models";
import {
	BUDGET_CATEGORY_TABLE_EXPORT,
	BUDGET_TARGET_PROJECTS_TABLE_EXPORT,
	BUDGET_TARGET_PROJECTS_TABLE_IMPORT,
	DONOR_EXPORT,
} from "../../../../utils/endpoints.util";
import ImportExportTableMenu from "../../../ImportExportTableMenu";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import { exportTable } from "../../../../utils/importExportTable.utils";
import { useAuth } from "../../../../contexts/userContext";

interface IBudgetTargetTableViewProps {
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedBudgetTarget: React.MutableRefObject<IBudgetTargetProjectResponse | null>;
	initialValues: IBudgetTargetForm;
	budgegtTargetList: IBudgetTargetProjectResponse[];
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	budgetLineItemInitialValues: IBudgetTrackingLineitemForm;
	inputFields: any[];
	filterList: {
		[key: string]: string | string[];
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	donorHash: { [key: string]: string };
	budgetCategoryHash: { [key: string]: string };
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	currency: string;
	refetchBudgetTargetTable:
		| ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>)
		| undefined;
}

enum tableHeader {
	targetName = 2,
	budgetCategory = 3,
	donor = 4,
	totalAmout = 5,
	spent = 6,
	progress = 7,
	filterList = 8,
}

enum tableRow {
	name = 0,
	budgetCategory = 1,
	donor = 2,
	totalAmount = 3,
	spent = 4,
	progress = 5,
}

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "budget_category_organization,name" },
	{ valueAccessKey: "donor,name" },
	{ valueAccessKey: "total_target_amount" },
	{
		valueAccessKey: "",
		renderComponent: (budgetTarget: IBudgetTargetProjectResponse) => (
			<AmountSpent budgetTargetId={budgetTarget.id}>
				{(amount: number) => {
					return <span>{amount}</span>;
				}}
			</AmountSpent>
		),
	},
	{
		valueAccessKey: "",
		renderComponent: (budgetTarget: IBudgetTargetProjectResponse) => (
			<AmountSpent budgetTargetId={budgetTarget.id}>
				{(amount: number) => {
					return (
						<span>
							{((amount * 100) / parseInt(budgetTarget.total_target_amount)).toFixed(
								2
							)}
						</span>
					);
				}}
			</AmountSpent>
		),
	},
];

const getTableHeadingByBudgetTrackingLineItemAccess = (
	headings: ITableHeadings[],
	collapseTableAccess: boolean
) => (collapseTableAccess ? headings : headings.slice(1));

const chipArray = ({
	elementList,
	name,
	removeChip,
}: {
	removeChip: (index: number) => void;
	elementList: string[];
	name: string;
}) => {
	return elementList.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

const getNewTotalAmountHeaderOfTable = (currency: string) => `Total Amount (${currency})`;

const createChipArray = ({
	filterListObjectKeyValuePair,
	donorHash,
	budgetCategoryHash,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	donorHash: { [key: string]: string };
	budgetCategoryHash: { [key: string]: string };
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArray({
			elementList: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "donor") {
			return chipArray({
				elementList: filterListObjectKeyValuePair[1].map((ele) => donorHash[ele]),
				name: "do",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "budget_category_organization") {
			return chipArray({
				elementList: filterListObjectKeyValuePair[1].map((ele) => budgetCategoryHash[ele]),
				name: "bc",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

const budgetTargetTableEditMenu = ["", ""];

function BudgetTargetView({
	toggleDialogs,
	openDialogs,
	selectedBudgetTarget,
	initialValues,
	budgegtTargetList,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	budgetLineItemInitialValues,
	inputFields,
	filterList,
	setFilterList,
	donorHash,
	budgetCategoryHash,
	removeFilterListElements,
	currency,
	refetchBudgetTargetTable,
}: IBudgetTargetTableViewProps) {
	const currencyFindAccess = userHasAccess(MODULE_CODES.CURRENCY, CURRENCY_ACTION.FIND_CURRENCY);
	const dashboardData = useDashBoardData();
	currencyFindAccess &&
		(tableHeadings[5].label = getNewTotalAmountHeaderOfTable(
			currencyFindAccess ? currency : ""
		));

	const budgetTargetEditAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.UPDATE_BUDGET_TARGET
	);
	const budgetTargetDeleteAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.DELETE_BUDGET_TARGET
	);

	const budgetTargetCreateFromCsvAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.CREATE_BUDGET_TARGET_FROM_CSV
	);

	const budgetTargetExportTable = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.BUDGET_TARGET_EXPORT
	);

	const budgetTargetLineItemCreateAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET_LINE_ITEM,
		BUDGET_TARGET_LINE_ITEM_ACTIONS.CREATE_BUDGET_TARGET_LINE_ITEM
	);

	const budgetTargetLineItemFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET_LINE_ITEM,
		BUDGET_TARGET_LINE_ITEM_ACTIONS.FIND_BUDGET_TARGET_LINE_ITEM
	);

	const budgetCategoryFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.FIND_BUDGET_CATEGORY
	);

	const budgetTargetDonorFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET_DONOR,
		BUDGET_TARGET_DONOR_ACTION.FIND_BUDGET_TARGET_DONOR
	);

	const budgetTargetProjectExpenditureValue = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.PROJECT_EXPENDITURE_VALUE
	);

	const budgetTargetProjectAllocationValue = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.PROJECT_ALLOCATION_VALUE
	);

	const filteredTableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(tableHeadings, {
				[tableHeader.budgetCategory]: !budgetCategoryFindAccess,
				[tableHeader.donor]: !budgetTargetDonorFindAccess,
				[tableHeader.spent]: !budgetTargetProjectExpenditureValue,
				[tableHeader.totalAmout]: !budgetTargetProjectAllocationValue,
			}),
		[
			budgetCategoryFindAccess,
			filterTableHeadingsAndRows,
			budgetTargetDonorFindAccess,
			budgetTargetProjectExpenditureValue,
			budgetTargetProjectAllocationValue,
		]
	);
	const filteredRows = useMemo(
		() =>
			filterTableHeadingsAndRows(rows, {
				[tableRow.budgetCategory]: !budgetCategoryFindAccess,
				[tableRow.donor]: !budgetTargetDonorFindAccess,
				[tableRow.spent]: !budgetTargetProjectExpenditureValue,
				[tableRow.totalAmount]: !budgetTargetProjectAllocationValue,
			}),
		[
			budgetCategoryFindAccess,
			filterTableHeadingsAndRows,
			budgetTargetDonorFindAccess,
			budgetTargetProjectExpenditureValue,
			budgetTargetProjectAllocationValue,
		]
	);

	useEffect(() => {
		if (budgetTargetEditAccess) {
			budgetTargetTableEditMenu[0] = "Edit Budget Target";
		}
		if (budgetTargetLineItemCreateAccess) {
			budgetTargetTableEditMenu[1] = "Report Expenditure";
		}
		if (budgetTargetDeleteAccess) {
			budgetTargetTableEditMenu[2] = "Delete Budget Target";
		}
	}, [budgetTargetEditAccess, budgetTargetLineItemCreateAccess, budgetTargetDeleteAccess]);

	filteredTableHeadings[filteredTableHeadings.length - 1].renderComponent = () => (
		<>
			<FilterList
				initialValues={{
					name: "",
					total_target_amount: "",
					donor: [],
					budget_category_organization: [],
				}}
				setFilterList={setFilterList}
				inputFields={inputFields}
			/>
		</>
	);

	const onImportBudgetTargetTableSuccess = () => refetchBudgetTargetTable?.();

	const theme = useTheme();
	const { jwt } = useAuth();

	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								donorHash,
								budgetCategoryHash,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			<CommonTable
				tableHeadings={getTableHeadingByBudgetTrackingLineItemAccess(
					filteredTableHeadings,
					budgetTargetLineItemFindAccess
				)}
				valuesList={budgegtTargetList}
				rows={filteredRows}
				selectedRow={selectedBudgetTarget}
				toggleDialogs={toggleDialogs}
				editMenuName={budgetTargetTableEditMenu}
				collapsableTable={budgetTargetLineItemFindAccess}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Budget"
						tableExportUrl={`${BUDGET_TARGET_PROJECTS_TABLE_EXPORT}/${dashboardData?.project?.id}`}
						tableImportUrl={`${BUDGET_TARGET_PROJECTS_TABLE_IMPORT}/${dashboardData?.project?.id}`}
						onImportTableSuccess={onImportBudgetTargetTableSuccess}
						importButtonOnly={importButtonOnly}
						hideImport={!budgetTargetCreateFromCsvAccess}
						hideExport={!budgetTargetExportTable}
					>
						<>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1) }}
								onClick={() =>
									exportTable({
										tableName: "Budget category",
										jwt: jwt as string,
										tableExportUrl: `${BUDGET_CATEGORY_TABLE_EXPORT}`,
									})
								}
							>
								Budget Category Export
							</Button>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1) }}
								onClick={() =>
									exportTable({
										tableName: "Donor",
										jwt: jwt as string,
										tableExportUrl: `${DONOR_EXPORT}`,
									})
								}
							>
								Donor Export
							</Button>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1), float: "right" }}
								onClick={() =>
									exportTable({
										tableName: "Budget Target Template",
										jwt: jwt as string,
										tableExportUrl: `${BUDGET_TARGET_PROJECTS_TABLE_EXPORT}/${dashboardData?.project?.id}?header=true`,
									})
								}
							>
								Budget Target Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			>
				<>
					<BudgetTarget
						open={openDialogs[0]}
						handleClose={() => toggleDialogs(0, false)}
						formAction={FORM_ACTIONS.UPDATE}
						initialValues={initialValues}
					/>
					<BudgetLineitem
						open={openDialogs[1]}
						handleClose={() => toggleDialogs(1, false)}
						formAction={FORM_ACTIONS.CREATE}
						initialValues={budgetLineItemInitialValues}
					/>
					<BudgetTarget
						open={openDialogs[2]}
						handleClose={() => toggleDialogs(2, false)}
						formAction={FORM_ACTIONS.UPDATE}
						initialValues={initialValues}
						dialogType={DIALOG_TYPE.DELETE}
					/>
				</>
				{(rowData: IGET_BUDGET_TARGET_PROJECT["projectBudgetTargets"][0]) => (
					<>
						<Grid container>
							<Grid item xs={12}>
								<Box m={1}>
									<Typography
										align="left"
										variant="subtitle1"
										style={{
											fontSize: "0.8rem",
										}}
										variantMapping={{
											subtitle1: "h1",
										}}
									>
										{rowData?.description || ""}
									</Typography>
								</Box>
							</Grid>
						</Grid>
						{budgetTargetLineItemFindAccess && (
							<BudgetLineItemTable
								budgetTargetId={rowData.id}
								donor={rowData.donor}
							/>
						)}
					</>
				)}
			</CommonTable>
		</>
	);
}

export default BudgetTargetView;
