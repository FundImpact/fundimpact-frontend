import React, { useRef, useState } from "react";
import ContactTableView from "./ContactTableView";
import { IGetContact } from "../../../models/contact/query";
import { IContact } from "../../../models/contact";
import { contactTableHeadings } from "../constants";

interface IContactTableContainer {
	contactList: IGetContact["t4DContacts"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
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
		/>
	);
}

export default ContactTableContainer;
