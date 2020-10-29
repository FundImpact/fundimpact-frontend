import React from "react";
import { contactFormFields } from "./inputField.json";
import { FORM_ACTIONS } from "../../constant";
import CommonForm from "../../../CommonForm";
import { IContactForm, IContact } from "../../../../models/contact/index.js";
import { validateEmail } from "../../../../utils";
import {
	MutationFunctionOptions,
	FetchResult,
	ApolloClient,
	useApolloClient,
} from "@apollo/client";
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
import { GET_CONTACT_LIST, GET_CONTACT_LIST_COUNT } from "../../../../graphql/Contact";

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
	apolloClient: ApolloClient<object>;
}

(contactFormFields[4].optionsArray as { id: string; name: string }[]) = [
	{ id: "PERSONAL", name: "PERSONAL" },
	{ id: "OFFICE", name: "OFFICE" },
];

const getContactCountCachedValue = (
	apolloClient: ApolloClient<object>,
	entity_id: string,
	entity_name: string
) => {
	let count = 0;
	try {
		let cachedCount = apolloClient.readQuery({
			query: GET_CONTACT_LIST_COUNT,
			variables: {
				filter: {
					entity_id,
					entity_name,
				},
			},
		});
		count = cachedCount?.t4DContactsConnection?.aggregate?.count;
	} catch (err) {
		console.log("err :>> ", err);
	}
	return count;
};

const increaseContactListCount = ({
	apolloClient,
	entity_id,
	entity_name,
}: {
	apolloClient: ApolloClient<object>;
	entity_id: string;
	entity_name: string;
}) => {
	try {
		const count = getContactCountCachedValue(apolloClient, entity_id, entity_name);
		apolloClient.writeQuery({
			query: GET_CONTACT_LIST_COUNT,
			variables: {
				filter: {
					entity_id,
					entity_name,
				},
			},
			data: {
				t4DContactsConnection: {
					aggregate: {
						count: count + 1,
					},
				},
			},
		});
	} catch (err) {
		console.log("err.message :>> ", err.message);
	}
};

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

// const getCachedContactList = ({
// 	apolloClient,
// 	entity_id,
// 	entity_name,
// }: {
// 	apolloClient: ApolloClient<object>;
// 	entity_id: string;
// 	entity_name: string;
// }) => {
// 	let contactList = [];
// 	try {
// 		const count = getContactCountCachedValue(apolloClient, entity_id, entity_name);

// 		let cachedCount = apolloClient.readQuery({
// 			query: GET_CONTACT_LIST,
// 			variables: {
// 				filter: {
// 					entity_name,
// 					entity_id,
// 				},
// 				limit: count > 10 ? 10 : count,
// 				start: 0,
// 				sort: "created_at:DESC",
// 			},
// 		});
// 		contactList = cachedCount?.t4DContacts || [];
// 	} catch (err) {
// 		console.log("err.message :>> ", err.message);
// 	}
// 	console.log("contactList :>> ", contactList);
// 	return contactList;
// };

const fetchContactListCount = async ({
	apolloClient,
	entity_id,
	entity_name,
}: {
	apolloClient: ApolloClient<object>;
	entity_id: string;
	entity_name: string;
}) => {
	let count = 0;
	try {
		let cachedCount = await apolloClient.query({
			query: GET_CONTACT_LIST_COUNT,
			variables: {
				filter: {
					entity_id,
					entity_name,
				},
			},
			fetchPolicy: "network-only",
		});
		count = cachedCount?.data?.t4DContactsConnection?.aggregate?.count;
	} catch (err) {
		console.log("err :>> ", err);
	}
	return count;
};

const refetchContactList = async ({
	apolloClient,
	entity_id,
	entity_name,
}: {
	apolloClient: ApolloClient<object>;
	entity_id: string;
	entity_name: string;
}) => {
	try {
		let count = getContactCountCachedValue(apolloClient, entity_id, entity_name);
		if (count == 0) {
			count = await fetchContactListCount({ apolloClient, entity_id, entity_name });
		}
		await apolloClient.query({
			query: GET_CONTACT_LIST,
			variables: {
				filter: {
					entity_name,
					entity_id,
				},
				limit: count > 10 ? 10 : count,
				start: 0,
				sort: "created_at:DESC",
			},
			fetchPolicy: "network-only",
		});
	} catch (err) {
		console.log("err :>> ", err);
	}
};

const submitForm = async ({
	valuesSubmitted,
	createContact,
	notificationDispatch,
	contactId,
	formAction,
	updateContact,
	apolloClient,
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
			});
			await refetchContactList({
				apolloClient,
				entity_id: valuesSubmitted.entity_id,
				entity_name: valuesSubmitted.entity_name,
			});
			increaseContactListCount({
				apolloClient,
				entity_id: valuesSubmitted.entity_id,
				entity_name: valuesSubmitted.entity_name,
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
	const apolloClient = useApolloClient();

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
				apolloClient,
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
