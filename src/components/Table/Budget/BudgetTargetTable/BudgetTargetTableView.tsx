import React, { useEffect, useMemo } from "react";
import CommonTable from "../../CommonTable";
import { budgetTargetTableHeading as tableHeadings } from "../../constants";
import BudgetTarget from "../../../Budget/BudgetTarget";
import { FORM_ACTIONS } from "../../../../models/constants";
import { IBudgetTargetProjectResponse } from "../../../../models/budget/query";
import {
	IBudgetTargetForm,
	IBudgetTrackingLineitemForm,
} from "../../../../models/budget/budgetForm";
import AmountSpent from "./AmountSpent";
import BudgetLineItemTable from "../BudgetLineItemTable";
import { Grid, Box, Typography, Chip, Avatar } from "@material-ui/core";
import BudgetLineitem from "../../../Budget/BudgetLineitem";
import FilterList from "../../../FilterList";
import { BUDGET_TARGET_ACTIONS } from "../../../../utils/access/modules/budgetTarget/actions";
import { MODULE_CODES, userHasAccess } from "../../../../utils/access";
import { BUDGET_TARGET_LINE_ITEM_ACTIONS } from "../../../../utils/access/modules/budgetTargetLineItem/actions";
import { BUDGET_CATEGORY_ACTIONS } from "../../../../utils/access/modules/budgetCategory/actions";
import { removeArrayElementsAtVariousIndex as filterTableHeadingsAndRows } from "../../../../utils";
import { PROJECT_DONOR_ACTIONS } from "../../../../utils/access/modules/projectDonor/actions";

enum tableHeader {
	targetName = 2,
	budgetCategory = 3,
	donor = 4,
	totalAmout = 5,
	spent = 6,
	progress = 7,
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
}: {
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
}) {
	tableHeadings[5].label = getNewTotalAmountHeaderOfTable(currency);

	const budgetTargetEditAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.UPDATE_BUDGET_TARGET
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

	const projectDonorFindAccess = userHasAccess(
		MODULE_CODES.PROJECT_DONOR,
		PROJECT_DONOR_ACTIONS.FIND_PROJECT_DONOR
	);

	const filteredTableHeadings = useMemo(
		() =>
			filterTableHeadingsAndRows(tableHeadings, {
				[tableHeader.budgetCategory]: !budgetCategoryFindAccess,
				[tableHeader.donor]: !projectDonorFindAccess,
			}),
		[budgetCategoryFindAccess, filterTableHeadingsAndRows, projectDonorFindAccess]
	);

	const filteredRows = useMemo(
		() =>
			filterTableHeadingsAndRows(rows, {
				[tableRow.budgetCategory]: !budgetCategoryFindAccess,
				[tableRow.donor]: !projectDonorFindAccess,
			}),
		[budgetCategoryFindAccess, filterTableHeadingsAndRows, projectDonorFindAccess]
	);

	useEffect(() => {
		if (budgetTargetEditAccess) {
			budgetTargetTableEditMenu[0] = "Edit Budget Target";
		}
		if (budgetTargetLineItemCreateAccess) {
			budgetTargetTableEditMenu[1] = "Report Expenditure";
		}
	}, [budgetTargetEditAccess, budgetTargetLineItemCreateAccess]);

	return (
		<>
			<Grid container>
				<Grid item xs={11}>
					<Box my={2} display="flex" flexWrap="wrap">
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
				<Grid item xs={1}>
					<Box mt={2}>
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
					</Box>
				</Grid>
			</Grid>
			<CommonTable
				tableHeadings={filteredTableHeadings}
				valuesList={budgegtTargetList}
				rows={filteredRows}
				selectedRow={selectedBudgetTarget}
				toggleDialogs={toggleDialogs}
				editMenuName={budgetTargetTableEditMenu}
				collapsableTable={true}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
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
				</>
				{(rowData: {
					id: string;
					description: string;
					donor: { id: string; country: { id: string } };
				}) => (
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
