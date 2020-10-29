import React, { useEffect } from "react";
import ContactTableContainer from "./ContactTableContainer";
import { useLazyQuery } from "@apollo/client";
import { IGetContact } from "../../../models/contact/query";
import { GET_CONTACT_LIST } from "../../../graphql/Contact";
import { useDashBoardData } from "../../../contexts/dashboardContext";

function ContactTableGraphql() {
	const dashboardData = useDashBoardData();

	const [getContactList, { data: contactList }] = useLazyQuery<IGetContact>(GET_CONTACT_LIST);

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

	return <ContactTableContainer contactList={contactList?.t4DContacts || []} />;
}

export default ContactTableGraphql;
