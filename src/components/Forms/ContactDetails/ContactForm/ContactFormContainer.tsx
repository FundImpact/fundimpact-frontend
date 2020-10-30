import React from "react";
import { contactFormFields } from "./inputField.json";
import { FORM_ACTIONS } from "../../constant";
import CommonForm from "../../../CommonForm";
import { IContactForm } from "../../../../models/contact/index.js";
import { validateEmail } from "../../../../utils";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { ICreateContact, ICreateContactVariables } from "../../../../models/contact/query.js";
import { useNotificationDispatch } from "../../../../contexts/notificationContext";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../../reducers/notificationReducer";

interface ICreateContactContainer {
	createContact: (
		options?: MutationFunctionOptions<ICreateContact, ICreateContactVariables> | undefined
	) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
	loading: boolean;
	entity_name: string;
	entity_id: string;
	getContactCreated?: (contact: ICreateContact) => void;
}
interface ISubmitForm {
	createContact: (
		options?: MutationFunctionOptions<ICreateContact, ICreateContactVariables> | undefined
	) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
	valuesSubmitted: {
		entity_name: string;
		entity_id: string;
		// name: string;
		phone: string;
		phone_other: string;
		email: string;
		email_other: string;
		// contact_type: string;
	};
	notificationDispatch: React.Dispatch<any>;
}

(contactFormFields[5].optionsArray as { id: string; name: string }[]) = [
	{ id: "PERSONAL", name: "PERSONAL" },
	{ id: "OFFICE", name: "OFFICE" },
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

const submitForm = async ({
	valuesSubmitted,
	createContact,
	notificationDispatch,
}: ISubmitForm) => {
	try {
		console.log("valuesSubmitted :>> ", valuesSubmitted);
		let contactCreated = await createContact({
			variables: {
				input: {
					data: {
						...valuesSubmitted,
					},
				},
			},
		});
		notificationDispatch(setSuccessNotification("Contact created successfully"));
		return contactCreated;
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
};

const onCancel = () => {};

const validate = (values: IContactForm) => {
	let errors: Partial<IContactForm> = {};
	// if (!values.name) {
	// 	errors.name = "Name is required";
	// }
	if (!values.email) {
		errors.email = "Email is required";
	} else if (!validateEmail(values.email)) {
		errors.email = "Email not correct";
	}

	if (values.email_other && !validateEmail(values.email_other)) {
		errors.email_other = "Email not correct";
	}

	//add phone validation
	if (!values.phone) {
		errors.phone = "Phone is required";
	} 

	if (!values.contact_type) {
		errors.contact_type = "Contact type is required";
	}
	return errors;
};

function ContactFormContainer({
	loading,
	createContact,
	entity_id,
	entity_name,
	getContactCreated,
}: ICreateContactContainer) {
	const initialValues = getInitialFormValues();
	const notificationDispatch = useNotificationDispatch();

	const onFormSubmit = async (valuesSubmitted: IContactForm) => {
		try {
			//remove this
			// delete valuesSubmitted?.name;
			// delete valuesSubmitted?.contact_type;
			valuesSubmitted.phone = `${valuesSubmitted.phone}`;
			valuesSubmitted.phone_other = `${valuesSubmitted.phone_other}`;
			const contactCreated = await submitForm({
				valuesSubmitted: { ...valuesSubmitted, entity_id, entity_name },
				createContact,
				notificationDispatch,
			});

			contactCreated &&
				contactCreated.data &&
				getContactCreated &&
				getContactCreated(contactCreated.data);
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<CommonForm
			initialValues={initialValues}
			validate={validate}
			onCreate={onFormSubmit}
			onCancel={onCancel}
			inputFields={contactFormFields}
			formAction={FORM_ACTIONS.CREATE}
			onUpdate={onFormSubmit}
		/>
	);
}

export default ContactFormContainer;
