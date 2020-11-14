import React, { useState, useRef } from "react";
import FundReceivedTableView from "./FundReceivedTableView";
import { IGet_Fund_Receipt_List } from "../../../models/fundReceived/query";
import { getTodaysDate } from "../../../utils";
import { IFundReceivedForm } from "../../../models/fundReceived";

const getInitialValues = (
	fundReceipt: IGet_Fund_Receipt_List["fundReceiptProjectList"][0] | null
): IFundReceivedForm => {
	return {
		amount: `${fundReceipt?.amount}` || "",
		reporting_date: getTodaysDate(fundReceipt?.reporting_date || undefined),
		id: fundReceipt?.id || "",
		project_donor: fundReceipt?.project_donor?.id || "",
	};
};

function FundReceivedTableContainer({
	fundReceiptList,
	loading,
	changePage,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	filterList,
	setFilterList,
	inputFields,
	removeFilterListElements,
	donorHash,
	currency
}: {
	fundReceiptList: IGet_Fund_Receipt_List["fundReceiptProjectList"];
	loading: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
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
	currency: string;
}) {
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);
	const selectedFundReceipt = useRef<IGet_Fund_Receipt_List["fundReceiptProjectList"][0] | null>(
		null
	);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	return (
		<FundReceivedTableView
			openDialogs={openDialogs}
			selectedFundReceipt={selectedFundReceipt}
			toggleDialogs={toggleDialogs}
			fundReceiptList={fundReceiptList}
			loading={loading}
			changePage={changePage}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			initialValues={getInitialValues(selectedFundReceipt.current)}
			removeFilterListElements={removeFilterListElements}
			filterList={filterList}
			setFilterList={setFilterList}
			inputFields={inputFields}
			donorHash={donorHash}
			currency={currency || ""}
		/>
	);
}

export default FundReceivedTableContainer;
