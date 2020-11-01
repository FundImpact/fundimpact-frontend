import React, { useState, useRef } from "react";
import { IGetContact } from "../../../models/contact/query";
import CommonTable from "../CommonTable";
import { addressTableHeadings } from "../constants";
import { IContact } from "../../../models/contact";
import AddContactAddressDialog from "../../AddContactAddressDialog";
import { AddContactAddressDialogType, Enitity, FORM_ACTIONS } from "../../../models/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IGetAddress } from "../../../models/address/query";
import { IAddress } from "../../../models/address";

interface IAddressTableView {
	addressList: IGetAddress["t4DAddresses"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	selectedAddress: React.MutableRefObject<IAddress | null>;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	initialValues: IAddress;
}

const rows = [
	{ valueAccessKey: "address_line_1" },
	{ valueAccessKey: "address_line_2" },
	{ valueAccessKey: "pincode" },
	{ valueAccessKey: "city" },
	{ valueAccessKey: "address_type" },
	{ valueAccessKey: "" },
];

function AddressTableView({
	addressList,
	setOrderBy,
	setOrder,
	orderBy,
	order,
	loading,
	count,
	changePage,
	openDialogs,
	toggleDialogs,
	initialValues,
	selectedAddress,
}: IAddressTableView) {
	const dashboardData = useDashBoardData();
	const conatctEditMenu = ["Edit Address"];

	return (
		<CommonTable
			tableHeadings={addressTableHeadings}
			valuesList={addressList}
			rows={rows}
			selectedRow={selectedAddress}
			toggleDialogs={toggleDialogs}
			editMenuName={conatctEditMenu}
			collapsableTable={false}
			changePage={(prev?: boolean) => {}}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
		>
			<AddContactAddressDialog
				dialogType={AddContactAddressDialogType.address}
				entity_id={dashboardData?.organization?.id || ""}
				entity_name={Enitity.organization}
				open={openDialogs[0]}
				handleClose={() => toggleDialogs(0, false)}
				formActions={FORM_ACTIONS.UPDATE}
				addressFormInitialValues={initialValues}
			/>
		</CommonTable>
	);
}

export default AddressTableView;
