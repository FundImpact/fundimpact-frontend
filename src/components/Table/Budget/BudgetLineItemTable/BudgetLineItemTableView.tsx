import React from "react";
import CommonTable from "../../CommonTable";
import BudgetLineitem from "../../../Budget/BudgetLineitem";
import { FORM_ACTIONS } from "../../../Forms/constant";
import { IBUDGET_LINE_ITEM_RESPONSE } from "../../../../models/budget/query";
import { IBudgetTrackingLineitem } from "../../../../models/budget";
import { budgetLineItemTableHeading as tableHeadings } from "../../constants";
import { getTodaysDate } from "../../../../utils";
import { Box, Chip, Avatar, Grid } from "@material-ui/core";
import FilterList from "../../../FilterList";

function getValue(obj: any, key: string[]): any {
	if (!obj?.hasOwnProperty(key[0])) {
		return "";
	}
	if (key.length == 1) {
		return obj[key[0]];
	}
	return getValue(obj[key[0]], key.slice(1));
}

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
						getValue(budgetLineItem, objVal.split(",")) && (
							<Box mr={1} key={arrIndex}>
								<Chip
									avatar={
										<Avatar>
											<span>{objKey}</span>
										</Avatar>
									}
									label={getValue(budgetLineItem, objVal.split(","))}
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
	name: string;
	removeChip: (index: number) => void;
}) => {
	return arr.map((element, index) => (
		<Box key={index} mx={1}>
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
}) {
	return (
		<>
			<Grid container>
				<Grid item xs={11}>
					<Box my={2} display="flex">
						{Object.entries(filterList).map((element) => {
							if (element[1] && typeof element[1] == "string") {
								return chipArray({
									arr: [element[1]],
									name: element[0].slice(0, 4),
									removeChip: (index: number) => {
										removeFilterListElements(element[0]);
									},
								});
							}
							if (element[1] && Array.isArray(element[1])) {
								if (element[0] == "grant_periods_project") {
									return chipArray({
										arr: element[1].map((ele) => grantPeriodHash[ele]),
										name: "gp",
										removeChip: (index: number) => {
											removeFilterListElements(element[0], index);
										},
									});
								}
								if (element[0] == "annual_year") {
									return chipArray({
										arr: element[1].map((ele) => annualYearHash[ele]),
										name: "ay",
										removeChip: (index: number) => {
											removeFilterListElements(element[0], index);
										},
									});
								}
								if (element[0] == "fy_org") {
									return chipArray({
										arr: element[1].map((ele) => financialYearOrgHash[ele]),
										name: "fyo",
										removeChip: (index: number) => {
											removeFilterListElements(element[0], index);
										},
									});
								}
								if (element[0] == "fy_donor") {
									return chipArray({
										arr: element[1].map((ele) => financialYearDonorHash[ele]),
										name: "fyd",
										removeChip: (index: number) => {
											removeFilterListElements(element[0], index);
										},
									});
								}
							}
						})}
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
				editMenuName={["Edit Budget Line Item"]}
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
