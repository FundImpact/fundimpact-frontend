import React from "react";
import { IGet_Fund_Receipt_List } from "../../../models/fundReceived/query";
import CommonTable from "../CommonTable";
import { fundReceivedTableHeadings } from "../../Table/constants";
import { getTodaysDate } from "../../../utils";
import FundReceived from "../../FundReceived";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { IFundReceivedForm } from "../../../models/fundReceived";
import FilterList from "../../FilterList";
import { Grid, Box, Chip, Avatar, Button, useTheme } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { IntlShape } from "@formatjs/intl";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	DONOR_EXPORT,
	FUND_RECEIPT_TABLE_EXPORT,
	FUND_RECEIPT_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { FUND_RECEIPT_ACTIONS } from "../../../utils/access/modules/fundReceipt/actions";

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
	currency,
	fundReceivedTableRefetch,
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
	filterList: {
		[key: string]: string | string[];
	};
	initialValues: IFundReceivedForm;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	inputFields: any[];
	donorHash: { [key: string]: string };
	currency: string;
	fundReceivedTableRefetch: () => Promise<ApolloQueryResult<any> | undefined> | undefined;
}) {
	const intl = useIntl();
	const dashboardData = useDashBoardData();
	fundReceivedTableHeadings[2].label = `Amount ${currency && "(" + currency + ")"}`;

	const theme = useTheme();
	const { jwt } = useAuth();

	fundReceivedTableHeadings[fundReceivedTableHeadings.length - 1].renderComponent = () => (
		<>
			<FilterList
				initialValues={{
					amount: "",
					reporting_date: "",
					project_donor: [],
				}}
				setFilterList={setFilterList}
				inputFields={inputFields}
			/>
		</>
	);

	const editMenu = [];
	const fundReceiptEditAccess = userHasAccess(
		MODULE_CODES.FUND_RECEIPT,
		FUND_RECEIPT_ACTIONS.UPDATE_FUND_RECEIPT
	);
	const fundReceiptDeleteAccess = userHasAccess(
		MODULE_CODES.FUND_RECEIPT,
		FUND_RECEIPT_ACTIONS.DELETE_FUND_RECEIPT
	);
	const fundReceiptImportFromCsvAccess = userHasAccess(
		MODULE_CODES.FUND_RECEIPT,
		FUND_RECEIPT_ACTIONS.FUND_RECEIPT_CREATE_FROM_CSV
	);
	const fundReceiptExportAccess = userHasAccess(
		MODULE_CODES.FUND_RECEIPT,
		FUND_RECEIPT_ACTIONS.FUND_RECEIPT_EXPORT
	);

	if (fundReceiptEditAccess) {
		editMenu.push("Edit Fund Receipt");
	}

	if (fundReceiptDeleteAccess) {
		editMenu.push("Delete Fund Receipt");
	}

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
				editMenuName={editMenu}
				collapsableTable={false}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Fund Received"
						tableExportUrl={`${FUND_RECEIPT_TABLE_EXPORT}/${dashboardData?.project?.id}`}
						tableImportUrl={`${FUND_RECEIPT_TABLE_IMPORT}/${dashboardData?.project?.id}`}
						onImportTableSuccess={fundReceivedTableRefetch}
						importButtonOnly={importButtonOnly}
						hideImport={!fundReceiptImportFromCsvAccess}
						hideExport={!fundReceiptExportAccess}
					>
						<>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1) }}
								onClick={() =>
									exportTable({
										tableName: "Donors",
										jwt: jwt as string,
										tableExportUrl: `${DONOR_EXPORT}/${dashboardData?.project?.id}`,
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
										tableName: "Fund Receipt Template",
										jwt: jwt as string,
										tableExportUrl: `${FUND_RECEIPT_TABLE_EXPORT}/${dashboardData?.project?.id}?header=true`,
									})
								}
							>
								Fund Receipt Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			>
				<>
					<FundReceived
						formAction={FORM_ACTIONS.UPDATE}
						open={openDialogs[0]}
						handleClose={() => toggleDialogs(0, false)}
						initialValues={initialValues}
					/>
					<FundReceived
						formAction={FORM_ACTIONS.UPDATE}
						open={openDialogs[1]}
						handleClose={() => toggleDialogs(1, false)}
						initialValues={initialValues}
						dialogType={DIALOG_TYPE.DELETE}
					/>
				</>
			</CommonTable>
		</>
	);
}

export default FundReceivedTableView;
