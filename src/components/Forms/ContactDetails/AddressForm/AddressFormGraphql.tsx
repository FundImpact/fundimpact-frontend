import React, { useEffect } from "react";
import AddressFormContainer from "./AddressFormContainer";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_COUNTRY_LIST, GET_STATE_LIST, GET_DISTRICT_LIST } from "../../../../graphql";

function AddressFormGraphql() {
	const { data: countryList } = useQuery<{ countryList: { id: string; name: string }[] }>(
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
	return <AddressFormContainer countryList={countryList?.countryList || []} />;
}

export default AddressFormGraphql;
