import React from "react";
import { contactFormFields } from "./inputField.json";

(contactFormFields[5].optionsArray as { id: string; name: string }[]) = [
	{ id: "1", name: "PERSONAL" },
	{ id: "2", name: "OFFICE" },
];

function ContactFormContainer() {
	return <div></div>;
}

export default ContactFormContainer;
