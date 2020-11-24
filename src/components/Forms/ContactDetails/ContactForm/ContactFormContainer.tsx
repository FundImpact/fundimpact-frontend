import React, { useCallback } from "react";
import { FORM_ACTIONS } from "../../constant";
import { IContactForm, IContact, IContactInputElements } from "../../../../models/contact/index.js";
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
import ContactFormView from "./ContactFormView";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { Enitity_Name } from "../../../../models/constants";

type ICreateContactContainer =
	| {
			createContact: (
				options?:
					| MutationFunctionOptions<ICreateContact, ICreateContactVariables>
					| undefined
			) => Promise<FetchResult<ICreateContact, Record<string, any>, Record<string, any>>>;
			loading: boolean;
			entity_name: Enitity_Name;
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
			entity_name: Enitity_Name;
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
	entity_name: Enitity_Name;
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
	entity_name: Enitity_Name;
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

//change the form of name
const getInitialFormValues = (initialValues?: IContact): IContactForm => {
	if (initialValues) {
		return { name: [{ firstName: "", surname: "" }], ...initialValues };
	}

	return {
		name: [{ firstName: "", surname: "" }],
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
	fields.filter((field) => field.label.length);

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
				label: "First name",
				size: 6,
				id: "firstName",
				initialValue: "",
				required: true,
				testId: "createFirstNameInput",
			},
			{
				label: "Surname",
				size: 6,
				id: "surname",
				initialValue: "",
				required: false,
				testId: "createSurnameNameInput",
			},
		],
		showAddIcon: false,
		id: "name",
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
	entity_name: Enitity_Name;
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
	entity_name: Enitity_Name;
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
				limit: count > 8 ? 8 : count,
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

function ContactFormContainer(props: ICreateContactContainer) {
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
			if (!values.name[0].firstName) {
				if (!errors.name) {
					errors.name = [{ firstName: "", surname: "" }];
				}
				errors.name[0].firstName = `${
					entity_name === Enitity_Name.organization ? "Group Name" : "First Name"
				} is required`;
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

	if (entity_name === Enitity_Name.organization) {
		contactInputArr[0].inputsGroup = [
			{
				id: "firstName",
				initialValue: "",
				label: "Group Name",
				size: 12,
				required: true,
				testId: "createFirstNameInput",
			},
		];
	} else {
		contactInputArr[0].inputsGroup = [
			{
				label: "First name",
				size: 6,
				id: "firstName",
				initialValue: "",
				required: true,
				testId: "createFirstNameInput",
			},
			{
				label: "Surname",
				size: 6,
				id: "surname",
				initialValue: "",
				required: false,
				testId: "createSurnameNameInput",
			},
		];
	}

	const onFormSubmit = async (valuesSubmitted: IContactForm) => {
		console.log("valuesSubmitted", valuesSubmitted);
		const clonedValueSubmitted = JSON.parse(JSON.stringify(valuesSubmitted));
		console.log("clonedValueSubmitted", clonedValueSubmitted);
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
		<ContactFormView
			contactInputElements={contactInputArr}
			onSubmit={onFormSubmit}
			initialValues={initialValues}
			validate={validate}
			open={props.open}
			formAction={props.formAction}
			handleClose={props.handleClose}
		/>
	);
}

export default ContactFormContainer;
