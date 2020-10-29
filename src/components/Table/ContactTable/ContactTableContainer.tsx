import React from "react";
import ContactTableView from "./ContactTableView";
import { IGetContact } from "../../../models/contact/query";

function ContactTableContainer({ contactList }: { contactList: IGetContact["t4DContacts"] }) {
	return <ContactTableView contactList={contactList} />;
}

export default ContactTableContainer;
