import React, { useCallback } from "react";
import { IContactForm, IContact, IContactInputElements } from "../../models/contact";
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
} from "../../models/contact/query.js";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setSuccessNotification, setErrorNotification } from "../../reducers/notificationReducer";
import { GET_CONTACT_LIST, GET_CONTACT_LIST_COUNT } from "../../graphql/Contact";
import ContactDialogView from "./ContactDialogView";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { Entity_Name, FORM_ACTIONS } from "../../models/constants";
import { CARDS_PER_PAGE } from "../../models/contact/constant";

type ICreateContactContainer =
	| {
			createContact: (
				options?:
					| MutationFunctionOptions<ICreateContact, ICreateContactVariables>
					| undefined
			) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
			loading: boolean;
			entity_name: Entity_Name;
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
			open: boolean;
			handleClose: () => void;
	  }
	| {
			createContact: (
				options?:
					| MutationFunctionOptions<ICreateContact, ICreateContactVariables>
					| undefined
			) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
			loading: boolean;
			entity_name: Entity_Name;
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
			open: boolean;
			handleClose: () => void;
	  };

interface ISubmitForm {
	createContact: (
		options?: MutationFunctionOptions<ICreateContact, ICreateContactVariables> | undefined
	) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
	valuesSubmitted: IContactForm;
	notificationDispatch: React.Dispatch<any>;
	updateContact: (
		options?: MutationFunctionOptions<IUpdateContact, IUpdateContactVariables> | undefined
	) => Promise<FetchResult<IUpdateContact, Record<string, any>, Record<string, any>>>;
	contactId: string;
	formAction: FORM_ACTIONS;
	apolloClient: ApolloClient<object>;
	entity_id: string;
	entity_name: Entity_Name;
}

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
		console.error(err);
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
	entity_name: Entity_Name;
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
		console.error(err);
	}
};

const getInitialFormValues = (initialValues?: IContact): IContactForm => {
	if (initialValues) {
		let contactFormInitialValues = {
			...initialValues,
			label: [{ label: initialValues.label || "" }],
		};
		//if user has not entered email, phoneNumber or addresses in that case we have to send
		//empty values
		contactFormInitialValues.addresses = contactFormInitialValues.addresses.length
			? contactFormInitialValues.addresses
			: [
					{
						address_line_1: "",
						address_line_2: "",
						pincode: "",
						city: "",
					},
			  ];
		contactFormInitialValues.emails = contactFormInitialValues.emails.length
			? contactFormInitialValues.emails
			: [{ label: "", value: "" }];
		contactFormInitialValues.phone_numbers = contactFormInitialValues.phone_numbers.length
			? contactFormInitialValues.phone_numbers
			: [{ label: "", value: "" }];
		return contactFormInitialValues;
	}

	return {
		label: [{ label: "" }],
		emails: [{ label: "", value: "" }],
		phone_numbers: [{ label: "", value: "" }],
		addresses: [
			{
				address_line_1: "",
				address_line_2: "",
				pincode: "",
				city: "",
			},
		],
		contact_type: "",
	};
};

const removeEmptyFields = (fields: { label: string; value: string }[]) =>
	fields.filter((field) => field.label.length || field.value.length);

const removeEmptyAddresses = (
	addresses: { address_line_1: string; address_line_2: string; pincode: string; city: string }[]
) =>
	addresses.filter(
		(address) =>
			address.pincode.length ||
			address.address_line_1.length ||
			address.address_line_2.length ||
			address.city.length
	);

//ContactInputArray is an array of contact elements like name, emails, phone_numbers, addresses,
//a contact element consists of various input elements like in case of addresses it consists of
//address_line_1, address_line_2, pincode, city input elments. In the ui there would be a plus
//button to add input fields which will be availabe only in some contact elements, that is why
//there is showAddIcon key. inputGroup is group of all input elements present in contactElement.
const contactInputArr: IContactInputElements = [
	{
		icon: <AccountCircleIcon fontSize="large" />,
		inputsGroup: [
			{
				label: "Label",
				size: 12,
				id: "label",
				initialValue: "",
				required: true,
				testId: "createLabelInput",
			},
		],
		showAddIcon: false,
		id: "label",
	},
	{
		icon: <MailOutlineIcon fontSize="large" />,
		inputsGroup: [
			{
				label: "Email",
				size: 6,
				id: "value",
				initialValue: "",
				required: false,
				testId: "createEmailValueInput",
			},
			{
				label: "Label",
				size: 6,
				id: "label",
				initialValue: "",
				required: false,
				testId: "createEmailLabelInput",
			},
		],
		showAddIcon: true,
		id: "emails",
	},
	{
		icon: <PhoneIcon fontSize="large" />,
		inputsGroup: [
			{
				label: "Phone",
				size: 6,
				id: "value",
				initialValue: "",
				required: false,
				testId: "createPhoneValueInput",
			},
			{
				label: "Label",
				size: 6,
				id: "label",
				initialValue: "",
				required: false,
				testId: "createPhoneLabelInput",
			},
		],
		showAddIcon: true,
		id: "phone_numbers",
	},
	{
		icon: <LocationOnIcon fontSize="large" />,
		inputsGroup: [
			{
				label: "Address Line 1",
				size: 12,
				id: "address_line_1",
				initialValue: "",
				required: false,
				testId: "createAddressesAddressLine1Input",
			},
			{
				label: "Address Line 2",
				size: 12,
				id: "address_line_2",
				initialValue: "",
				required: false,
				testId: "createAddressesAddressLine2Input",
			},
			{
				label: "Pincode",
				size: 6,
				id: "pincode",
				initialValue: "",
				required: false,
				testId: "createAddressesPincodeInput",
			},
			{
				label: "City",
				size: 6,
				id: "city",
				initialValue: "",
				required: false,
				testId: "createAddressesCityInput",
			},
		],
		showAddIcon: true,
		id: "addresses",
		fullWidth: true,
	},
];

const fetchContactListCount = async ({
	apolloClient,
	entity_id,
	entity_name,
}: {
	apolloClient: ApolloClient<object>;
	entity_id: string;
	entity_name: Entity_Name;
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
		console.error(err);
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
	entity_name: Entity_Name;
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
				limit: count > CARDS_PER_PAGE ? CARDS_PER_PAGE : count,
				start: 0,
				sort: "created_at:DESC",
			},
			fetchPolicy: "network-only",
		});
	} catch (err) {
		console.error(err);
	}
};

const submitForm = async ({
	entity_id,
	apolloClient,
	updateContact,
	entity_name,
	createContact,
	formAction,
	notificationDispatch,
	valuesSubmitted,
	contactId,
}: ISubmitForm) => {
	try {
		if (formAction == FORM_ACTIONS.CREATE) {
			await createContact({
				variables: {
					input: {
						data: {
							entity_id,
							addresses: valuesSubmitted.addresses,
							emails: valuesSubmitted.emails,
							entity_name,
							phone_numbers: valuesSubmitted.phone_numbers,
							contact_type: valuesSubmitted.contact_type,
							label: valuesSubmitted?.label[0]?.label,
						},
					},
				},
			});
			await refetchContactList({
				apolloClient,
				entity_id: entity_id,
				entity_name: entity_name,
			});
			increaseContactListCount({
				apolloClient,
				entity_id: entity_id,
				entity_name: entity_name,
			});
		} else {
			await updateContact({
				variables: {
					input: {
						where: {
							id: contactId,
						},
						data: {
							entity_id,
							addresses: valuesSubmitted.addresses,
							emails: valuesSubmitted.emails,
							entity_name,
							phone_numbers: valuesSubmitted.phone_numbers,
							contact_type: valuesSubmitted.contact_type,
							label: valuesSubmitted?.label[0]?.label,
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
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
	return null;
};

function ContactDialogContainer(props: ICreateContactContainer) {
	const { loading, createContact, entity_id, entity_name, updateContact } = props;
	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE
			? getInitialFormValues()
			: getInitialFormValues(props.initialValues);

	const notificationDispatch = useNotificationDispatch();
	const apolloClient = useApolloClient();

	const validate = useCallback(
		(values: IContactForm) => {
			let errors: Partial<IContactForm> = {};
			if (!values.label[0].label) {
				if (!errors.label) {
					errors.label = [{ label: "" }];
				}
				errors.label[0].label = "Label is required";
			}
			if (!values.contact_type) {
				errors.contact_type = "Contact Type is required";
			}
			errors.emails = values.emails.map((email) => ({
				label: "",
				value: email.label && !email.value ? "Email is required" : "",
			}));
			errors.phone_numbers = values.phone_numbers.map((phone_number) => ({
				label: "",
				value: phone_number.label && !phone_number.value ? "Phone Number is required" : "",
			}));
			return errors;
		},
		[entity_name]
	);

	const onFormSubmit = async (valuesSubmitted: IContactForm) => {
		const clonedValueSubmitted = JSON.parse(JSON.stringify(valuesSubmitted));
		clonedValueSubmitted.emails = removeEmptyFields(valuesSubmitted.emails);
		clonedValueSubmitted.addresses = removeEmptyAddresses(valuesSubmitted.addresses);
		clonedValueSubmitted.phone_numbers = removeEmptyFields(valuesSubmitted.phone_numbers);

		try {
			await submitForm({
				valuesSubmitted: { ...clonedValueSubmitted },
				createContact,
				notificationDispatch,
				updateContact,
				formAction: props.formAction,
				contactId: props.formAction == FORM_ACTIONS.UPDATE ? props.initialValues.id : "",
				apolloClient,
				entity_name,
				entity_id,
			});
			props.handleClose();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<ContactDialogView
			contactInputElements={contactInputArr}
			onSubmit={onFormSubmit}
			initialValues={initialValues}
			validate={validate}
			open={props.open}
			formAction={props.formAction}
			handleClose={props.handleClose}
			loading={props.loading}
		/>
	);
}

export default ContactDialogContainer;
