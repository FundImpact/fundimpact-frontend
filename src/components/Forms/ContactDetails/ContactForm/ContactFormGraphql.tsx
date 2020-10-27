import React from "react";
import ContactFormContainer from "./ContactFormContainer";
import { useMutation } from "@apollo/client";
import { CREATE_CONTACT } from "../../../../graphql/Contact/mutation";
import { ICreateContact, ICreateContactVariables } from "../../../../models/contact/query";

function ContactFormGraphql({ entity_name, entity_id }: { entity_name: string; entity_id: string }) {
	const [createContact, { loading: creatingContact }] = useMutation<
		ICreateContact,
		ICreateContactVariables
	>(CREATE_CONTACT);

	return (
		<ContactFormContainer
			createContact={createContact}
			loading={creatingContact}
			entity_name={entity_name}
			entity_id={entity_id}
		/>
	);
}

export default ContactFormGraphql;
