import React, { useEffect } from "react";
import AddressFormContainer from "./AddressFormContainer";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_COUNTRY_LIST, GET_STATE_LIST, GET_DISTRICT_LIST } from "../../../../graphql";
import { CREATE_ADDRESS, UPDATE_ADDRESS } from "../../../../graphql/Address/mutation";
import {
	ICreateAddress,
	ICreateAddressVariables,
	IUpdateAddressVariables,
	IUpdateAddress,
} from "../../../../models/address/query";
import { FORM_ACTIONS } from "../../../../models/constants";
import { IAddress } from "../../../../models/address";

type IAddressFormGraphqlProps =
	| {
			t_4_d_contact: string;
			formAction: FORM_ACTIONS.CREATE;
			getCreatedOrUpdatedAddress?: (
				address: ICreateAddress["createT4DAddress"]["t4DAddress"] | null
			) => void;
	  }
	| {
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IAddress;
			t_4_d_contact: string;
			getCreatedOrUpdatedAddress?: (
				address: ICreateAddress["createT4DAddress"]["t4DAddress"] | null
			) => void;
	  };

function AddressFormGraphql(props: IAddressFormGraphqlProps) {
	const { t_4_d_contact, getCreatedOrUpdatedAddress } = props;
	const [createAddress, { loading: creatingAddress }] = useMutation<
		ICreateAddress,
		ICreateAddressVariables
	>(CREATE_ADDRESS);

	const [updateAddress, { loading: updatingAddress }] = useMutation<
		IUpdateAddress,
		IUpdateAddressVariables
	>(UPDATE_ADDRESS);

	return (
		<AddressFormContainer
			t_4_d_contact={t_4_d_contact}
			createAddress={createAddress}
			loading={creatingAddress || updatingAddress}
			{...(props.formAction == FORM_ACTIONS.UPDATE
				? {
						initialValues: props.initialValues,
						formAction: FORM_ACTIONS.UPDATE,
				  }
				: { formAction: FORM_ACTIONS.CREATE })}
			getCreatedOrUpdatedAddress={getCreatedOrUpdatedAddress}
			updateAddress={updateAddress}
		/>
	);
}

export default AddressFormGraphql;
