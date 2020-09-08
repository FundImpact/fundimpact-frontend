import React, { useEffect } from "react";
import OrganizationContainer from "./OrganizationContainer";
import { GET_ORGANIZATION_REGISTRATION_TYPES, GET_COUNTRY_LIST } from "../../../graphql";
import { UPDATE_ORGANIZATION } from "../../../graphql/mutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
	IGetOrganizationRegistrationType,
	IUpdateOrganization,
	IUpdateOrganizationVariables,
} from "../../../models/organisation/query";
import { IGetCountryList } from "../../../models/query";

function OrganizationGraphql() {
	const [getOrganizationRegistrationTypes, { data: registrationTypes }] = useLazyQuery<
		IGetOrganizationRegistrationType
	>(GET_ORGANIZATION_REGISTRATION_TYPES);

	const [getCountryList, { data: countryList }] = useLazyQuery<IGetCountryList>(GET_COUNTRY_LIST);
	const [updateOrganization] = useMutation<IUpdateOrganization, IUpdateOrganizationVariables>(
		UPDATE_ORGANIZATION
	);

	useEffect(() => {
		getOrganizationRegistrationTypes();
	}, [getOrganizationRegistrationTypes]);

	useEffect(() => {
		getCountryList();
	}, [getCountryList]);

	return (
		<OrganizationContainer
			registrationTypes={registrationTypes?.organizationRegistrationTypes || []}
			countryList={countryList?.countryList || []}
			updateOrganization={updateOrganization}
		/>
	);
}

export default OrganizationGraphql;
