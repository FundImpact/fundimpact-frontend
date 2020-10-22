import React from "react";
import { contactFormFields } from "./inputField.json";
import { FORM_ACTIONS } from "../../constant";
import CommonForm from "../../../CommonForm";
import { IContactForm } from "../../../../models/contact/index.js";
import { validateEmail } from "../../../../utils";

(contactFormFields[5].optionsArray as { id: string; name: string }[]) = [
	{ id: "1", name: "PERSONAL" },
	{ id: "2", name: "OFFICE" },
];

const getInitialFormValues = (): IContactForm => {
	return {
		name: "",
		contact_type: "",
		email: "",
		email_other: "",
		phone: "",
		phone_other: "",
	};
};

const submitForm = (valuesSubmitted: IContactForm) => {};

const onCancel = () => {};

const validate = (values: IContactForm) => {
	let errors: Partial<IContactForm> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.email) {
		errors.email = "Email is required";
	} else if (!validateEmail(values.email)) {
		errors.email = "Email not correct";
	}

	if (values.email_other && !validateEmail(values.email_other)) {
		errors.email_other = "Email not correct";
	}

	if (!values.phone) {
		errors.phone = "Phone is required";
	}

	if (!values.contact_type) {
		errors.contact_type = "Contact type is required";
	}
	return errors;
};

function ContactFormContainer() {
	const initialValues = getInitialFormValues();

	return (
		<CommonForm
			initialValues={initialValues}
			validate={validate}
			onCreate={submitForm}
			onCancel={onCancel}
			inputFields={contactFormFields}
			formAction={FORM_ACTIONS.CREATE}
			onUpdate={submitForm}
		/>
	);
}

export default ContactFormContainer;
