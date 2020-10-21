import React from "react";
import { contactFormFields } from "./inputField.json";
import { FORM_ACTIONS } from "../../constant.js";

(contactFormFields[5].optionsArray as { id: string; name: string }[]) = [
	{ id: "1", name: "PERSONAL" },
	{ id: "2", name: "OFFICE" },
];

function ContactContainer() {
	return <div></div>;
}

export default ContactContainer;
