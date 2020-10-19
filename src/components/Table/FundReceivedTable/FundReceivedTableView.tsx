import React from "react";
import { IGet_Fund_Receipt_List } from "../../../models/fundReceived/query";
import CommonTable from "../CommonTable";
import { fundReceivedTableHeadings } from "../../Table/constants";
import { getTodaysDate } from "../../../utils";
import FundReceived from "../../FundReceived";
import { FORM_ACTIONS } from "../../../models/constants";
import { IFundReceivedForm } from "../../../models/fundReceived";
import FilterList from "../../FilterList";
import { Grid, Box, Chip, Avatar } from "@material-ui/core";
import { useIntl } from "react-intl";

//add access
const rows = [
	{
		valueAccessKey: "",
		renderComponent: (
			fundReceiptListItem: IGet_Fund_Receipt_List["fundReceiptProjectList"][0]
		) => <span>{getTodaysDate(fundReceiptListItem.reporting_date, true)}</span>,
	},
	{ valueAccessKey: "amount" },
	{ valueAccessKey: "project_donor,donor,name" },
];

const chipArray = ({
	arr,
	name,
	removeChip,
	intl,
}: {
	arr: string[];
	removeChip: (index: number) => void;
	name: string;
	intl: any;
}) => {
	return arr.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={intl.formatMessage({
					id: `chipArrayElement${element}`,
					defaultMessage: `${element}`,
					description: `This text will be show on chip as ${element}`,
				})}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>
							{intl.formatMessage({
								id: `chipArrayElement${name}`,
								defaultMessage: `${name}`,
								description: `This text will be show on chip avatar as ${name}`,
							})}
						</span>
					</Avatar>
				}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
	donorHash,
	intl,
}: {
	filterListObjectKeyValuePair: any[];
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	donorHash: { [key: string]: string };
	intl: any;
}) => {
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "project_donor") {
			return chipArray({
				arr: filterListObjectKeyValuePair[1].map((element) => donorHash[element]),
				name: "donor",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
				intl,
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
			intl,
		});
	}
	return null;
};

function FundReceivedTableView({
	fundReceiptList,
	loading,
	changePage,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	openDialogs,
	selectedFundReceipt,
	toggleDialogs,
	initialValues,
	filterList,
	setFilterList,
	inputFields,
	removeFilterListElements,
	donorHash,
}: {
	fundReceiptList: IGet_Fund_Receipt_List["fundReceiptProjectList"];
	loading: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	openDialogs: boolean[];
	selectedFundReceipt: React.MutableRefObject<
		IGet_Fund_Receipt_List["fundReceiptProjectList"][0] | null
	>;
	toggleDialogs: (index: number, dialogNewOpenStatus: boolean) => void;
	initialValues: IFundReceivedForm;
	filterList: {
		[key: string]: string | string[];
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	inputFields: any[];
	donorHash: { [key: string]: string };
}) {
	const intl = useIntl();

	fundReceivedTableHeadings[fundReceivedTableHeadings.length - 1].renderComponent = () => (
		<FilterList
			initialValues={{
				amount: "",
				reporting_date: "",
				project_donor: [],
			}}
			setFilterList={setFilterList}
			inputFields={inputFields}
		/>
	);
	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
								donorHash,
								intl,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			<CommonTable
				tableHeadings={fundReceivedTableHeadings}
				valuesList={fundReceiptList}
				rows={rows}
				selectedRow={selectedFundReceipt}
				toggleDialogs={toggleDialogs}
				editMenuName={["Edit Fund Receipt"]}
				collapsableTable={false}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			>
				<FundReceived
					formAction={FORM_ACTIONS.UPDATE}
					open={openDialogs[0]}
					handleClose={() => toggleDialogs(0, false)}
					initialValues={initialValues}
				/>
			</CommonTable>
		</>
	);
}

export default FundReceivedTableView;
