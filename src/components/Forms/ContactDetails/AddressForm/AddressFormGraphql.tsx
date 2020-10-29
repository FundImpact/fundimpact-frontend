import React, { useEffect } from "react";
import AddressFormContainer from "./AddressFormContainer";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_COUNTRY_LIST, GET_STATE_LIST, GET_DISTRICT_LIST } from "../../../../graphql";
import { CREATE_ADDRESS } from "../../../../graphql/Address/mutation";
import { ICreateAddress, ICreateAddressVariables } from "../../../../models/address/query";

function AddressFormGraphql({
	t_4_d_contact,
	getAddressCreated
}: {
	t_4_d_contact: string;
	getAddressCreated?: (address: ICreateAddress) => void;
}) {
	const [createAddress, { loading: creatingAddress }] = useMutation<
		ICreateAddress,
		ICreateAddressVariables
	>(CREATE_ADDRESS);

	return (
		<AddressFormContainer
			t_4_d_contact={t_4_d_contact}
			createAddress={createAddress}
			loading={creatingAddress}
			getAddressCreated={getAddressCreated}
		/>
	);
}

export default AddressFormGraphql;
