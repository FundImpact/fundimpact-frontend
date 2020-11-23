import React, { useEffect, useState } from "react";
import ContactTableContainer from "./ContactTableContainer";
import { GET_CONTACT_LIST, GET_CONTACT_LIST_COUNT } from "../../../graphql/Contact";
import { Enitity_Name } from "../../../models/constants";
import pagination from "../../../hooks/pagination";
import { removeFilterListObjectElements } from "../../../utils/filterList";

const getDefaultFilterList = () => ({
	email: "",
	email_other: "",
	phone: "",
	phone_other: "",
	contact_type: [],
});

function ContactTableGraphql({
	entity_id,
	entity_name,
}: {
	entity_id: string;
	entity_name: Enitity_Name;
}) {
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>(getDefaultFilterList());

	useEffect(() => {
		setQueryFilter({
			entity_id,
			entity_name,
		});
	}, [setQueryFilter, entity_id, entity_name]);

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
				}
			}
			setQueryFilter({
				entity_id,
				entity_name,
				...newFilterListObject,
			});
		}
	}, [filterList, entity_id, entity_name]);

	const removeFilterListElements = (key: string, index?: number) =>
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);

	let { changePage, count, queryData: contactList, queryLoading, countQueryLoading } = pagination(
		{
			countQuery: GET_CONTACT_LIST_COUNT,
			countFilter: queryFilter,
			query: GET_CONTACT_LIST,
			queryFilter,
			sort: `created_at:DESC`,
			retrieveContFromCountQueryResponse: "t4DContactsConnection,aggregate,count",
			limit: 8,
		}
	);

	return (
		<ContactTableContainer
			contactList={contactList?.t4DContacts || []}
			count={count}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			entity_name={entity_name}
		/>
	);
}

export default ContactTableGraphql;
