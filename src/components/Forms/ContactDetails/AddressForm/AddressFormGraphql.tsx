import React, { useEffect } from "react";
import AddressFormContainer from "./AddressFormContainer";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_COUNTRY_LIST, GET_STATE_LIST, GET_DISTRICT_LIST } from "../../../../graphql";
import { CREATE_ADDRESS } from "../../../../graphql/Address/mutation";
import { ICreateAddress, ICreateAddressVariables } from "../../../../models/address/query";

function AddressFormGraphql({
	contact_id,
	entity_id,
	entity_name,
}: {
	contact_id: string;
	entity_id: string;
	entity_name: string;
}) {
	const [createAddress, { loading: creatingAddress }] = useMutation<
		ICreateAddress,
		ICreateAddressVariables
	>(CREATE_ADDRESS);

	const { data: countryList } = useQuery<{ countries: { id: string; name: string }[] }>(
		GET_COUNTRY_LIST
	);

	const [getStates, { data: stateList, error: statesError }] = useLazyQuery(GET_STATE_LIST);

	const [getDistricts, { data: districtList, error: districtError }] = useLazyQuery(
		GET_DISTRICT_LIST
	);
	console.log("districtList :>> ", districtList);
	console.log("error :>> ", districtError);
	useEffect(() => {
		getStates();
		getDistricts({
			variables: {
				filter: {},
			},
		});
	}, []);
	return (
		<AddressFormContainer
			countryList={countryList?.countries || []}
			contact_id={contact_id}
			entity_id={entity_id}
			entity_name={entity_name}
			createAddress={createAddress}
			loading={creatingAddress}
		/>
	);
}

export default AddressFormGraphql;
