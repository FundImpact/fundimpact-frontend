import React from "react";
import ContactFormContainer from "./ContactFormContainer";
import { useMutation } from "@apollo/client";
import { CREATE_CONTACT, UPDATE_CONTACT } from "../../../../graphql/Contact/mutation";
import {
	ICreateContact,
	ICreateContactVariables,
	IUpdateContact,
	IUpdateContactVariables,
} from "../../../../models/contact/query";
import { Enitity_Name, FORM_ACTIONS } from "../../../../models/constants";
import { IContact } from "../../../../models/contact";

type IContactFormGraphqlProps =
	| {
			formAction: FORM_ACTIONS.CREATE;
			entity_name: Enitity_Name;
			entity_id: string;
			open: boolean;
			handleClose: () => void;
	  }
	| {
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IContact;
			entity_name: Enitity_Name;
			entity_id: string;
			open: boolean;
			handleClose: () => void;
	  };

function ContactFormGraphql(props: IContactFormGraphqlProps) {
	const [createContact, { loading: creatingContact }] = useMutation<
		ICreateContact,
		ICreateContactVariables
	>(CREATE_CONTACT);

	const [updateContact, { loading: updatingContact }] = useMutation<
		IUpdateContact,
		IUpdateContactVariables
	>(UPDATE_CONTACT);
	const { entity_id, entity_name } = props;

	return (
		<ContactFormContainer
			createContact={createContact}
			loading={creatingContact || updatingContact}
			entity_name={entity_name}
			entity_id={entity_id}
			{...(props.formAction == FORM_ACTIONS.UPDATE
				? {
						initialValues: props.initialValues,
						formAction: FORM_ACTIONS.UPDATE,
				  }
				: { formAction: FORM_ACTIONS.CREATE })}
			updateContact={updateContact}
			open={props.open}
			handleClose={props.handleClose}
		/>
	);
}

export default ContactFormGraphql;
