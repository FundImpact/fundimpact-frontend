import React, { useMemo, useCallback } from "react";
import OrganizationView from "./OrganizationView";
import { IOrganisationForm } from "../../../models/organisation/types";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { organizationFormInputFields } from "./inputFields.json";
import { IOrganizationCurrency } from "../../../models/organisation/types";
import { ICountry } from "../../../models";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";

//change icon on api update
//move initial values to views component
//change any type
//check everywhere if organization cache is updating properly
function OrganizationContainer({
	registrationTypes,
	organizationCurrencies,
	countryList,
	updateOrganization,
	updateOrgCurrency,
}: {
	registrationTypes: { id: string; reg_type: string }[];
	organizationCurrencies: IOrganizationCurrency[];
	countryList: ICountry[];
	updateOrgCurrency: any;
	updateOrganization: any;
}) {
	organizationFormInputFields[6].optionsArray = useMemo(
		() =>
			organizationCurrencies.map((element) => ({
				id: element.id + "," + element.currency.id,
				name: element?.currency?.name,
			})),
		[organizationCurrencies]
	) as any;

	const homeCurrency = useMemo(
		() => organizationCurrencies.filter((element) => element.isHomeCurrency),
		[organizationCurrencies]
	)[0];

	console.log("organizationCurrencies :>> ", organizationCurrencies);

	organizationFormInputFields[5].optionsArray = countryList as any;

	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();

	const initialValues = {
		id: dashboardData?.organization?.id || "",
		organization_registration_type:
			dashboardData?.organization?.organization_registration_type?.id || "",
		country: dashboardData?.organization?.country?.id || "",
		icon: "",
		name: dashboardData?.organization?.name || "",
		legal_name: dashboardData?.organization?.legal_name || "",
		short_name: dashboardData?.organization?.short_name || "",
		currency: (homeCurrency && homeCurrency.id + "," + homeCurrency.currency.id) || "",
	};

	const validate = useCallback(
		(values: IOrganisationForm) => {
			let errors: Partial<IOrganisationForm> = {};
			if (!values.name && initialValues.name) {
				errors.name = "Name is required";
			}
			if (!values.country && initialValues.country) {
				errors.country = "Country is required";
			}
			if (
				!values.organization_registration_type &&
				initialValues.organization_registration_type
			) {
				errors.organization_registration_type = "Registration type is required";
			}
			if (!values.legal_name && initialValues.legal_name) {
				errors.legal_name = "Legal name is required";
			}
			if (!values.short_name && initialValues.short_name) {
				errors.short_name = "Short name is required";
			}
			if (!values.currency && initialValues.currency) {
				errors.currency = "Currency is required";
			}
			return errors;
		},
		[initialValues]
	);

	console.log("homeCurrency :>> ", homeCurrency);

	const onSubmit = useCallback(
		async (valuesSubmitted: IOrganisationForm) => {
			try {
				console.log("object");
				const values = Object.assign({}, valuesSubmitted);
				delete values.id;
				console.log("values :>> ", values);
				console.log("initialValues :>> ", initialValues);
				if (values.currency != initialValues.currency) {
					await updateOrgCurrency({
						variables: {
							id: values.currency.split(",")[0],
							input: {
								organization: initialValues.id,
								currency: values.currency.split(",")[1],
								isHomeCurrency: true,
							},
						},
					});
				}
				//change this
				delete values.currency;
				delete values.icon;
				delete values.country;
				// delete values.reg_type;
				//make new org and check everything
				if (!values.organization_registration_type) {
					delete values.organization_registration_type;
				}
				console.log("values :>> ", values);
				console.log("initialValues :>> ", initialValues);
				await updateOrganization({
					variables: {
						id: initialValues.id,
						input: values,
					},
				});
				notificationDispatch(setSuccessNotification("Organization Updation Success"));
			} catch (err) {
				console.log("err :>> ", err);
				notificationDispatch(setErrorNotification("Organization Updation Failure"));
			}
		},
		[updateOrganization, updateOrgCurrency, initialValues]
	);

	return (
		<OrganizationView
			validate={validate}
			inputFields={organizationFormInputFields}
			registrationTypes={registrationTypes}
			initialValues={initialValues}
			onSubmit={onSubmit}
		/>
	);
}

export default OrganizationContainer;
