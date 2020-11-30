import React, { useState } from "react";
import ContactCardListView from "./ContactCardListView";
import { IGetContact } from "../../models/contact/query";
import { Entity_Name } from "../../models/constants";

interface IContactCardListContainer {
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
	entity_name: Entity_Name;
}

function ContactCardListContainer({
	contactList,
	changePage,
	count,
	loading,
	filterList,
	removeFilterListElements,
	setFilterList,
	entity_name,
}: IContactCardListContainer) {
	const [page, setPage] = useState(1);

	return (
		<ContactCardListView
			contactList={contactList}
			changePage={changePage}
			loading={loading}
			count={count}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			entity_name={entity_name}
			page={page}
			setPage={setPage}
		/>
	);
}

export default ContactCardListContainer;
