import React, { useEffect, useState } from "react";
import ContactTableContainer from "./ContactTableContainer";
import { useLazyQuery } from "@apollo/client";
import { IGetContact } from "../../../models/contact/query";
import { GET_CONTACT_LIST, GET_CONTACT_LIST_COUNT } from "../../../graphql/Contact";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { Enitity } from "../../../models/constants";
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
	entity_name: Enitity;
}) {
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
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
			sort: `${orderBy}:${order.toUpperCase()}`,
			retrieveContFromCountQueryResponse: "t4DContactsConnection,aggregate,count",
		}
	);

	return (
		<ContactTableContainer
			contactList={contactList?.t4DContacts || []}
			count={count}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			order={order}
			orderBy={orderBy}
			setOrder={setOrder}
			setOrderBy={setOrderBy}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
		/>
	);
}

export default ContactTableGraphql;
