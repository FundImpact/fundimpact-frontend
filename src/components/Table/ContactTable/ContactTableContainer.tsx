import React, { useRef, useState } from "react";
import ContactTableView from "./ContactTableView";
import { IGetContact } from "../../../models/contact/query";
import { IContact } from "../../../models/contact";
import { contactTableHeadings } from "../constants";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { ADDRESS_ACTIONS } from "../../../utils/access/modules/address/actions";
import { CONTACT_ACTION } from "../../../utils/access/modules/contact/actions";

interface IContactTableContainer {
	contactList: IGetContact["t4DContacts"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	filterList: {
		[key: string]: string | string[];
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	count: number;
}

const getInitialValues = (contact: IContact | null): IContact => {
	return {
		contact_type: contact?.contact_type || "",
		email: contact?.email || "",
		email_other: contact?.email_other || "",
		id: contact?.id || "",
		phone: contact?.phone || "",
		phone_other: contact?.phone_other || "",
	};
};

function ContactTableContainer({
	contactList,
	changePage,
	count,
	loading,
	order,
	orderBy,
	setOrder,
	setOrderBy,
	filterList,
	removeFilterListElements,
	setFilterList,
}: IContactTableContainer) {
	const selectedContact = useRef<IContact | null>(null);
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};

	const addressFindAccess = userHasAccess(MODULE_CODES.ADDRESS, ADDRESS_ACTIONS.FIND_ADDRESS);
	const contactEditAccess = userHasAccess(MODULE_CODES.CONTACT, CONTACT_ACTION.UPDATE_CONTACT);

	return (
		<ContactTableView
			contactList={contactList}
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedContact={selectedContact}
			initialValues={getInitialValues(selectedContact.current)}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			addressFindAccess={addressFindAccess}
			contactEditAccess={contactEditAccess}
		/>
	);
}

export default ContactTableContainer;
