import React from "react";
import { IAddressForm } from "../../../../models/address";
import CommonForm from "../../../CommonForm";
import { addressFormFields } from "./inputFields.json";
import { FORM_ACTIONS } from "../../../../models/constants";
import { validatePincode } from "../../../../utils";
import { ICreateAddress, ICreateAddressVariables } from "../../../../models/address/query";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { useNotificationDispatch } from "../../../../contexts/notificationContext";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../../reducers/notificationReducer";

interface IAddressFormContainer {
	countryList: { id: string; name: string }[];
	contact_id: string;
	entity_id: string;
	entity_name: string;
	loading: boolean;
	createAddress: (
		options?: MutationFunctionOptions<ICreateAddress, ICreateAddressVariables> | undefined
	) => Promise<FetchResult<ICreateAddress, Record<string, any>, Record<string, any>>>;
}

interface ISubmitForm {
	createAddress: (
		options?: MutationFunctionOptions<ICreateAddress, ICreateAddressVariables> | undefined
	) => Promise<FetchResult<ICreateAddress, Record<string, any>, Record<string, any>>>;
	valuesSubmitted: {
		entity_name: string;
		entity_id: string;
		contact_id: string;
		address_line_1: string;
		address_line_2?: string;
		pincode: string;
		city: string;
		country: string;
		state: string;
		district: string;
		village: string;
		address_type: string;
	};
	notificationDispatch: React.Dispatch<any>;
}

const getInitialFormValues = (): IAddressForm => {
	return {
		address_line_1: "",
		address_line_2: "",
		address_type: "",
		city: "",
		country: "",
		district: "",
		pincode: "",
		state: "",
		village: "",
	};
};

const submitForm = async ({
	createAddress,
	notificationDispatch,
	valuesSubmitted,
}: ISubmitForm) => {
	try {
		await createAddress({ variables: { input: { data: { ...valuesSubmitted } } } });
		notificationDispatch(setSuccessNotification("Fund Received Reported"));
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
};

const onCancel = () => {};

const validate = (values: IAddressForm) => {
	let errors: Partial<IAddressForm> = {};
	if (!values.address_line_1) {
		errors.address_line_1 = "Address Line 1 is required";
	}
	if (!values.address_type) {
		errors.address_type = "Address type is required";
	}
	if (!values.city) {
		errors.city = "City is required";
	}
	if (!values.country) {
		errors.country = "Country type is required";
	}
	if (!values.state) {
		errors.state = "State is required";
	}
	if (!values.pincode) {
		errors.pincode = "Pincode is required";
	} else if (!validatePincode(values.pincode)) {
		errors.pincode = "Pincode not valid";
	}
	if (!values.village) {
		errors.village = "Village is required";
	}
	if (!values.district) {
		errors.district = "District is required";
	}
	return errors;
};

function AddressFormContainer({
	countryList,
	contact_id,
	entity_id,
	entity_name,
	createAddress,
	loading,
}: IAddressFormContainer) {
	const initialValues = getInitialFormValues();
	(addressFormFields[4].optionsArray as { id: string; name: string }[]) = countryList;
	const notificationDispatch = useNotificationDispatch();

	const onFormSubmit = async (valuesSubmitted: IAddressForm) => {
		try {
			await submitForm({
				valuesSubmitted: { ...valuesSubmitted, entity_id, entity_name, contact_id },
				createAddress,
				notificationDispatch,
			});
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<CommonForm
			initialValues={initialValues}
			validate={validate}
			onCreate={submitForm}
			onCancel={onCancel}
			inputFields={addressFormFields}
			formAction={FORM_ACTIONS.CREATE}
			onUpdate={submitForm}
		/>
	);
}

export default AddressFormContainer;
