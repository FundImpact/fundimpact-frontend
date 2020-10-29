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
	t_4_d_contact: string;
	loading: boolean;
	createAddress: (
		options?: MutationFunctionOptions<ICreateAddress, ICreateAddressVariables> | undefined
	) => Promise<FetchResult<ICreateAddress, Record<string, any>, Record<string, any>>>;
	getAddressCreated?: (address: ICreateAddress) => void;
}

interface ISubmitForm {
	createAddress: (
		options?: MutationFunctionOptions<ICreateAddress, ICreateAddressVariables> | undefined
	) => Promise<FetchResult<ICreateAddress, Record<string, any>, Record<string, any>>>;
	valuesSubmitted: {
		t_4_d_contact: string;
		address_line_1: string;
		address_line_2?: string;
		pincode: string;
		city: string;
		address_type: string;
	};
	notificationDispatch: React.Dispatch<any>;
}

(addressFormFields[4].optionsArray as { id: string; name: string }[]) = [
	{ id: "PERMANENT", name: "PERMANENT" },
	{ id: "TEMPORARY", name: "TEMPORARY" },
	{ id: "BILLING", name: "BILLING" },
];

const getInitialFormValues = (): IAddressForm => {
	return {
		address_line_1: "",
		address_line_2: "",
		address_type: "",
		city: "",
		pincode: "",
	};
};

const submitForm = async ({
	createAddress,
	notificationDispatch,
	valuesSubmitted,
}: ISubmitForm) => {
	try {
		const addressCreated = await createAddress({
			variables: { input: { data: { ...valuesSubmitted } } },
		});
		notificationDispatch(setSuccessNotification("Address Created"));
		return addressCreated;
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
	if (!values.pincode) {
		errors.pincode = "Pincode is required";
	} else if (!validatePincode(values.pincode)) {
		errors.pincode = "Pincode not valid";
	}
	return errors;
};

function AddressFormContainer({
	t_4_d_contact,
	createAddress,
	loading,
	getAddressCreated,
}: IAddressFormContainer) {
	const initialValues = getInitialFormValues();
	const notificationDispatch = useNotificationDispatch();

	const onFormSubmit = async (valuesSubmitted: IAddressForm) => {
		try {
			const addressCreated = await submitForm({
				valuesSubmitted: { ...valuesSubmitted, t_4_d_contact },
				createAddress,
				notificationDispatch,
			});
			getAddressCreated &&
				addressCreated &&
				addressCreated.data &&
				getAddressCreated(addressCreated.data);
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<CommonForm
			initialValues={initialValues}
			validate={validate}
			onCreate={onFormSubmit}
			onCancel={onCancel}
			inputFields={addressFormFields}
			formAction={FORM_ACTIONS.CREATE}
			onUpdate={submitForm}
		/>
	);
}

export default AddressFormContainer;
