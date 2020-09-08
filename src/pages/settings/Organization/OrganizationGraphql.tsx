import React, { useEffect } from "react";
import OrganizationContainer from "./OrganizationContainer";
import {
	GET_ORGANIZATION_REGISTRATION_TYPES,
	GET_ORG_CURRENCIES_BY_ORG,
	GET_COUNTRY_LIST,
} from "../../../graphql";
import { UPDATE_ORGANIZATION, UPDATE_ORG_CURRENCY } from "../../../graphql/mutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";

function OrganizationGraphql() {
	const [getOrganizationRegistrationTypes, { data: registrationTypes }] = useLazyQuery(
		GET_ORGANIZATION_REGISTRATION_TYPES
	);

	const [getOrgCurencies, { data: orgCurrencies }] = useLazyQuery(GET_ORG_CURRENCIES_BY_ORG);
	const [getCountryList, { data: countryList }] = useLazyQuery(GET_COUNTRY_LIST);
	const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
	const [updateOrgCurrency] = useMutation(UPDATE_ORG_CURRENCY);

	const dashboardData = useDashBoardData();
	console.log("orgCurrencies", orgCurrencies);
	useEffect(() => {
		getOrganizationRegistrationTypes();
	}, [getOrganizationRegistrationTypes]);

	useEffect(() => {
		getCountryList();
	}, [getCountryList]);

	useEffect(() => {
		if (dashboardData) {
			getOrgCurencies({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [getOrgCurencies, dashboardData]);

	return (
		<OrganizationContainer
			registrationTypes={registrationTypes?.organizationRegistrationTypes || []}
			organizationCurrencies={orgCurrencies?.orgCurrencies || []}
			countryList={countryList?.countryList || []}
			updateOrganization={updateOrganization}
			updateOrgCurrency={updateOrgCurrency}
		/>
	);
}

export default OrganizationGraphql;
