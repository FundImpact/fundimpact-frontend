import React, { useState } from "react";
import ContactTableView from "./ContactTableView";
import { IGetContact } from "../../../models/contact/query";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { CONTACT_ACTION } from "../../../utils/access/modules/contact/actions";
import { Enitity_Name } from "../../../models/constants";

interface IContactTableContainer {
	contactList: IGetContact["t4DContacts"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
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
	entity_name: Enitity_Name;
}

function ContactTableContainer({
	contactList,
	changePage,
	count,
	loading,
	filterList,
	removeFilterListElements,
	setFilterList,
	entity_name,
}: IContactTableContainer) {
	const [page, setPage] = useState(1);
	const contactEditAccess = userHasAccess(MODULE_CODES.CONTACT, CONTACT_ACTION.UPDATE_CONTACT);

	return (
		<ContactTableView
			contactList={contactList}
			changePage={changePage}
			loading={loading}
			count={count}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			contactEditAccess={contactEditAccess}
			entity_name={entity_name}
			page={page}
			setPage={setPage}
		/>
	);
}

export default ContactTableContainer;
