import React, { useEffect, useState } from "react";
import ContactTableContainer from "./ContactTableContainer";
import { useLazyQuery } from "@apollo/client";
import { IGetContact } from "../../../models/contact/query";
import { GET_CONTACT_LIST } from "../../../graphql/Contact";
import { useDashBoardData } from "../../../contexts/dashboardContext";

function ContactTableGraphql() {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [getContactList, { data: contactList, loading: fetchingContactList }] = useLazyQuery<
		IGetContact
	>(GET_CONTACT_LIST);

	useEffect(() => {
		if (dashboardData) {
			getContactList({
				variables: {
					entity_name: "organization",
					emtity_id: dashboardData?.organization?.id,
				},
			});
		}
	}, [getContactList, dashboardData]);

	return (
		<ContactTableContainer
			contactList={contactList?.t4DContacts || []}
			count={10}
			changePage={(prev: boolean | undefined) => {}}
			loading={fetchingContactList}
			order={order}
			orderBy={orderBy}
			setOrder={setOrder}
			setOrderBy={setOrderBy}
		/>
	);
}

export default ContactTableGraphql;
