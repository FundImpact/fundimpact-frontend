import React, { useEffect } from "react";
import CommonTable from "../../CommonTable";
import BudgetLineitem from "../../../Budget/BudgetLineitem";
import { FORM_ACTIONS } from "../../../Forms/constant";
import { IBUDGET_LINE_ITEM_RESPONSE } from "../../../../models/budget/query";
import { IBudgetTrackingLineitem } from "../../../../models/budget";
import { budgetLineItemTableHeading as tableHeadings } from "../../constants";
import { getTodaysDate } from "../../../../utils";
import { Box, Chip, Avatar, Grid } from "@material-ui/core";
import FilterList from "../../../FilterList";
import { getValueFromObject } from "../../../../utils";
import { userHasAccess, MODULE_CODES } from "../../../../utils/access";
import { BUDGET_TARGET_LINE_ITEM_ACTIONS } from "../../../../utils/access/modules/budgetTargetLineItem/actions";

//The value of the year tags is the way to retrieve value from budgetLineItem and keyName is the name
//that we want to display in the chip
const yearTags = {
	FYO: "fy_org,name",
	FYD: "fy_donor,name",
	AY: "annual_year,name",
};

const rows = [
	{
		valueAccessKey: "",
		renderComponent: (budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE) => (
			<span>{getTodaysDate(budgetLineItem.reporting_date, true)}</span>
		),
	},
	{ valueAccessKey: "note" },
	{ valueAccessKey: "amount" },
	{ valueAccessKey: "grant_periods_project,name" },
	{
		valueAccessKey: "",
		renderComponent: (budgetLineItem: IBUDGET_LINE_ITEM_RESPONSE) => (
			<Box display="flex">
				{Object.entries(yearTags).map(([objKey, objVal], arrIndex) => {
					return (
						getValueFromObject(budgetLineItem, objVal.split(",")) && (
							<Box mr={1} key={arrIndex}>
								<Chip
									avatar={
										<Avatar>
											<span>{objKey}</span>
										</Avatar>
									}
									label={getValueFromObject(budgetLineItem, objVal.split(","))}
									size="small"
								/>
							</Box>
						)
					);
				})}
			</Box>
		),
	},
];

const chipArray = ({
	arr,
	name,
	removeChip,
}: {
	arr: string[];
	removeChip: (index: number) => void;
	name: string;
}) => {
	return arr.map((element, index) => (
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

const getNewAmountHeaderOfTable = (currency: string) => `Amount (${currency})`;

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
	grantPeriodHash,
	annualYearHash,
	financialYearDonorHash,
	financialYearOrgHash,
}: {
	filterListObjectKeyValuePair: any[];
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	grantPeriodHash: { [key: string]: string };
	annualYearHash: { [key: string]: string };
	financialYearDonorHash: { [key: string]: string };
	financialYearOrgHash: { [key: string]: string };
}) => {
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "grant_periods_project") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((element) => grantPeriodHash[element]),
				name: "gp",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "annual_year") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((element) => annualYearHash[element]),
				name: "ay",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "fy_org") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map(
					(element) => financialYearOrgHash[element]
				),
				name: "fyo",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
		if (filterListObjectKeyValuePair[0] === "fy_donor") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map(
					(element) => financialYearDonorHash[element]
				),
				name: "fyd",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] === "string") {
		return chipArray({
			arr: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};

let budgetLineItemTableEditMenu: string[] = [];

function BudgetLineItemTableView({
	toggleDialogs,
	openDialogs,
	selectedBudgetLineItem,
	initialValues,
	budgetLineitemList,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	removeFilterListElements,
	filterList,
	setFilterList,
	inputFields,
	grantPeriodHash,
	annualYearHash,
	financialYearDonorHash,
	financialYearOrgHash,
	currency,
}: {
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedBudgetLineItem: React.MutableRefObject<IBUDGET_LINE_ITEM_RESPONSE | null>;
	initialValues: IBudgetTrackingLineitem;
	budgetLineitemList: IBUDGET_LINE_ITEM_RESPONSE[];
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	filterList: {
		[key: string]: string | string[];
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	inputFields: any[];
	grantPeriodHash: { [key: string]: string };
	annualYearHash: { [key: string]: string };
	financialYearDonorHash: { [key: string]: string };
	financialYearOrgHash: { [key: string]: string };
	currency: string;
}) {
	tableHeadings[3].label = getNewAmountHeaderOfTable(currency);

	const budgetLineItemEditAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET_LINE_ITEM,
		BUDGET_TARGET_LINE_ITEM_ACTIONS.UPDATE_BUDGET_TARGET_LINE_ITEM
	);

	useEffect(() => {
		if (budgetLineItemEditAccess) {
			budgetLineItemTableEditMenu = ["Edit Budget Line Item"];
		}
	}, [budgetLineItemEditAccess]);

	return (
		<>
			<Grid container>
				<Grid item xs={11}>
					<Box my={2} display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
								grantPeriodHash,
								annualYearHash,
								financialYearDonorHash,
								financialYearOrgHash,
							})
						)}
					</Box>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						<FilterList
							initialValues={{
								note: "",
								amount: "",
								grant_periods_project: [],
								annual_year: [],
								fy_org: [],
								fy_donor: [],
								reporting_date: "",
							}}
							setFilterList={setFilterList}
							inputFields={inputFields}
						/>
					</Box>
				</Grid>
			</Grid>
			<CommonTable
				tableHeadings={tableHeadings}
				valuesList={budgetLineitemList}
				rows={rows}
				selectedRow={selectedBudgetLineItem}
				toggleDialogs={toggleDialogs}
				editMenuName={budgetLineItemTableEditMenu}
				collapsableTable={false}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			>
				<BudgetLineitem
					open={openDialogs[0]}
					handleClose={() => toggleDialogs(0, false)}
					formAction={FORM_ACTIONS.UPDATE}
					initialValues={initialValues}
				/>
			</CommonTable>
		</>
	);
}

export default BudgetLineItemTableView;
