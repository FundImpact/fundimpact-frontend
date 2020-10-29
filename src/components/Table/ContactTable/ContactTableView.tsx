import React, { useState, useRef } from "react";
import { IGetContact } from "../../../models/contact/query";
import CommonTable from "../CommonTable";
import { contactTableHeadings } from "../constants";
import { IContact } from "../../../models/contact";
import AddContactAddressDialog from "../../AddContactAddressDialog";
import { AddContactAddressDialogType, Enitity, FORM_ACTIONS } from "../../../models/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";

interface IContactTableView {
	contactList: IGetContact["t4DContacts"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	selectedContact: React.MutableRefObject<IContact | null>;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	initialValues: IContact;
}

const rows = [
	{ valueAccessKey: "email" },
	{ valueAccessKey: "email_other" },
	{ valueAccessKey: "phone" },
	{ valueAccessKey: "phone_other" },
	{ valueAccessKey: "contact_type" },
	{ valueAccessKey: "" },
];

function ContactTableView({
	contactList,
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
	selectedContact,
}: IContactTableView) {
	const dashboardData = useDashBoardData();
	const conatctEditMenu = ["Edit Contact"];

	return (
		<CommonTable
			tableHeadings={contactTableHeadings}
			valuesList={contactList}
			rows={rows}
			selectedRow={selectedContact}
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
				dialogType={AddContactAddressDialogType.contact}
				entity_id={dashboardData?.organization?.id || ""}
				entity_name={Enitity.organization}
				open={openDialogs[0]}
				handleClose={() => toggleDialogs(0, false)}
				formActions={FORM_ACTIONS.UPDATE}
				contactFormInitialValues={initialValues}
			/>
		</CommonTable>
	);
}

export default ContactTableView;
