import React from "react";
import { contactFormFields } from "./inputField.json";
import { FORM_ACTIONS } from "../../constant";
import CommonForm from "../../../CommonForm";
import { IContactForm, IContact } from "../../../../models/contact/index.js";
import { validateEmail } from "../../../../utils";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import {
	ICreateContact,
	ICreateContactVariables,
	IUpdateContactVariables,
	IUpdateContact,
} from "../../../../models/contact/query.js";
import { useNotificationDispatch } from "../../../../contexts/notificationContext";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../../reducers/notificationReducer";
import { GET_CONTACT_LIST } from "../../../../graphql/Contact";

type ICreateContactContainer =
	| {
			createContact: (
				options?:
					| MutationFunctionOptions<ICreateContact, ICreateContactVariables>
					| undefined
			) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
			loading: boolean;
			entity_name: string;
			entity_id: string;
			getCreatedOrUpdatedContact?: (
				contact: ICreateContact["createT4DContact"]["t4DContact"] | null
			) => void;
			formAction: FORM_ACTIONS.CREATE;
			updateContact: (
				options?:
					| MutationFunctionOptions<IUpdateContact, IUpdateContactVariables>
					| undefined
			) => Promise<FetchResult<IUpdateContact, Record<string, any>, Record<string, any>>>;
	  }
	| {
			createContact: (
				options?:
					| MutationFunctionOptions<ICreateContact, ICreateContactVariables>
					| undefined
			) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
			loading: boolean;
			entity_name: string;
			entity_id: string;
			getCreatedOrUpdatedContact?: (
				contact: ICreateContact["createT4DContact"]["t4DContact"] | null
			) => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IContact;
			updateContact: (
				options?:
					| MutationFunctionOptions<IUpdateContact, IUpdateContactVariables>
					| undefined
			) => Promise<FetchResult<IUpdateContact, Record<string, any>, Record<string, any>>>;
	  };

interface ISubmitForm {
	createContact: (
		options?: MutationFunctionOptions<ICreateContact, ICreateContactVariables> | undefined
	) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
	valuesSubmitted: {
		entity_name: string;
		entity_id: string;
		phone: string;
		phone_other: string;
		email: string;
		email_other: string;
		contact_type: string;
	};
	notificationDispatch: React.Dispatch<any>;
	updateContact: (
		options?: MutationFunctionOptions<IUpdateContact, IUpdateContactVariables> | undefined
	) => Promise<FetchResult<IUpdateContact, Record<string, any>, Record<string, any>>>;
	contactId: string;
	formAction: FORM_ACTIONS;
}

(contactFormFields[4].optionsArray as { id: string; name: string }[]) = [
	{ id: "PERSONAL", name: "PERSONAL" },
	{ id: "OFFICE", name: "OFFICE" },
];

const getInitialFormValues = (contact?: IContact): IContactForm => {
	if (contact) {
		return {
			contact_type: contact.contact_type,
			email: contact.email,
			email_other: contact.email_other,
			phone: contact.phone,
			phone_other: contact.phone_other,
		};
	}
	return {
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
	contactId,
	formAction,
	updateContact,
}: ISubmitForm) => {
	try {
		let createdContact, updatedContact;
		if (formAction == FORM_ACTIONS.CREATE) {
			createdContact = await createContact({
				variables: {
					input: {
						data: {
							...valuesSubmitted,
						},
					},
				},
				refetchQueries: [
					{
						query: GET_CONTACT_LIST,
						variables: {
							where: {
								entity_name: valuesSubmitted.entity_name,
								entity_id: valuesSubmitted.entity_id,
							},
						},
					},
				],
			});
		} else {
			updatedContact = await updateContact({
				variables: {
					input: {
						where: {
							id: contactId,
						},
						data: {
							...valuesSubmitted,
						},
					},
				},
			});
		}
		notificationDispatch(
			setSuccessNotification(
				`Contact ${formAction == FORM_ACTIONS.CREATE ? "created" : "updated"} successfully`
			)
		);
		if (formAction == FORM_ACTIONS.CREATE && createdContact && createdContact.data) {
			return createdContact.data.createT4DContact.t4DContact;
		}
		if (formAction == FORM_ACTIONS.UPDATE && updatedContact && updatedContact.data) {
			return updatedContact.data.updateT4DContact.t4DContact;
		}
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
	return null;
};

const onCancel = () => {};

const validate = (values: IContactForm) => {
	let errors: Partial<IContactForm> = {};
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

function ContactFormContainer(props: ICreateContactContainer) {
	const {
		loading,
		createContact,
		entity_id,
		entity_name,
		getCreatedOrUpdatedContact,
		updateContact,
	} = props;
	const initialValues =
		props.formAction == FORM_ACTIONS.CREATE
			? getInitialFormValues()
			: getInitialFormValues(props.initialValues);

	const notificationDispatch = useNotificationDispatch();

	const onFormSubmit = async (valuesSubmitted: IContactForm) => {
		try {
			//remove this
			valuesSubmitted.phone = `${valuesSubmitted.phone}`;
			valuesSubmitted.phone_other = `${valuesSubmitted.phone_other}`;
			const contactCreated = await submitForm({
				valuesSubmitted: { ...valuesSubmitted, entity_id, entity_name },
				createContact,
				notificationDispatch,
				updateContact,
				formAction: props.formAction,
				contactId: props.formAction == FORM_ACTIONS.UPDATE ? props.initialValues.id : "",
			});

			getCreatedOrUpdatedContact && getCreatedOrUpdatedContact(contactCreated);
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
			formAction={props.formAction}
			onUpdate={onFormSubmit}
		/>
	);
}

export default ContactFormContainer;
