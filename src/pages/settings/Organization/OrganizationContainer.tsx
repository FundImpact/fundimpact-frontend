import React, { useCallback } from "react";
import OrganizationView from "./OrganizationView";
import { IOrganisationForm } from "../../../models/organisation/types";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { organizationFormInputFields } from "./inputFields.json";
import { ICountry } from "../../../models";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	IUpdateOrganization,
	IUpdateOrganizationVariables,
} from "../../../models/organisation/query";
import { FetchResult, MutationFunctionOptions } from "@apollo/client";

//change icon on api update
//check everywhere if organization cache is updating properly
function OrganizationContainer({
	registrationTypes,
	countryList,
	updateOrganization,
	loading,
}: {
	loading: boolean;
	registrationTypes: { id: string; reg_type: string }[];
	countryList: ICountry[];
	updateOrganization: (
		options?:
			| MutationFunctionOptions<IUpdateOrganization, IUpdateOrganizationVariables>
			| undefined
	) => Promise<FetchResult<IUpdateOrganization, Record<string, any>, Record<string, any>>>;
}) {
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
			return errors;
		},
		[initialValues]
	);

	const onSubmit = useCallback(
		async (valuesSubmitted: IOrganisationForm) => {
			try {
				const values = Object.assign({}, valuesSubmitted);
				delete values.id;
				//change this
				delete values.icon;
				// delete values.country;
				// delete values.reg_type;
				//make new org and check everything
				if (!values.organization_registration_type) {
					delete values.organization_registration_type;
				}
				await updateOrganization({
					variables: {
						id: initialValues.id,
						input: values,
					},
				});
				notificationDispatch(setSuccessNotification("Organization Updation Success"));
			} catch (err) {
				notificationDispatch(setErrorNotification("Organization Updation Failure"));
			}
		},
		[updateOrganization, initialValues]
	);

	return (
		<OrganizationView
			loading={loading}
			validate={validate}
			inputFields={organizationFormInputFields}
			registrationTypes={registrationTypes}
			initialValues={initialValues}
			onSubmit={onSubmit}
		/>
	);
}

export default OrganizationContainer;
