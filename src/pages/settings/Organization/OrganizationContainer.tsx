import React, { useCallback, useEffect } from "react";
import OrganizationView from "./OrganizationView";
import { IOrganisationForm, IOrganisation } from "../../../models/organisation/types";
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
import { FetchResult, MutationFunctionOptions, ApolloCache } from "@apollo/client";
import useFileUpload from "../../../hooks/fileUpload";
import { SimplePaletteColorOptions } from "@material-ui/core";
import { primaryColor, secondaryColor } from "../../../models/constants";
import { GET_ORGANISATIONS } from "../../../graphql";

//change this
let inputFields: any[] = organizationFormInputFields;

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
	(organizationFormInputFields[4].optionsArray as ICountry[]) = countryList;
	let { uploadFile, loading: fileUploading } = useFileUpload();

	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();

	const initialValues: IOrganisationForm = {
		organization_registration_type:
			dashboardData?.organization?.organization_registration_type?.id || "",
		country: (countryList.length && dashboardData?.organization?.country?.id) || "",
		logo: dashboardData?.organization?.logo?.url || "",
		name: dashboardData?.organization?.name || "",
		legal_name: dashboardData?.organization?.legal_name || "",
		short_name: dashboardData?.organization?.short_name || "",
		theme: {
			palette: {
				primary: {
					main:
						(dashboardData?.organization?.theme?.palette
							?.primary as SimplePaletteColorOptions)?.main || primaryColor,
				},
				secondary: {
					main:
						(dashboardData?.organization?.theme?.palette
							?.secondary as SimplePaletteColorOptions)?.main || secondaryColor,
				},
			},
		},
	};

	const updateOrganizationCache = (
		store: ApolloCache<IUpdateOrganization>,
		response: FetchResult<IUpdateOrganization, Record<string, any>, Record<string, any>>
	) => {
		try {
			if (!response.data) {
				return;
			}
			let { organizationUpdate } = response.data;

			store.writeQuery<{
				organizationList: IOrganisation[];
			}>({
				query: GET_ORGANISATIONS,
				data: {
					organizationList: [organizationUpdate],
				},
			});
		} catch (err) {
			console.log("err ", err);
		}
	};

	const validate = useCallback(
		(values: IOrganisationForm) => {
			let errors: Partial<IOrganisationForm> = {};
			if (!values.name && initialValues.name) {
				errors.name = "Name is required";
			}
			if (!values.country) {
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

				if (values.logo instanceof File) {
					let formData = new FormData();
					formData.append("files", values.logo);
					const response = await uploadFile(formData);
					values.logo = response[0].id;
				} else {
					//deleting because if we send same value in backend we would get error
					delete values.logo;
				}

				//deleting because if we send empty value in backend we would get error
				if (!values.organization_registration_type) {
					delete values.organization_registration_type;
				}

				await updateOrganization({
					variables: {
						id: dashboardData?.organization?.id || "",
						input: values,
					},
					update: updateOrganizationCache,
				});
				notificationDispatch(setSuccessNotification("Organization Updation Success"));
			} catch (err) {
				notificationDispatch(setErrorNotification(err.message));
			}
		},
		[updateOrganization, initialValues, uploadFile, notificationDispatch]
	);

	return (
		<OrganizationView
			loading={loading || fileUploading}
			validate={validate}
			inputFields={inputFields}
			registrationTypes={registrationTypes}
			initialValues={initialValues}
			onSubmit={onSubmit}
			logo={dashboardData?.organization?.logo?.url || ""}
		/>
	);
}

export default OrganizationContainer;
