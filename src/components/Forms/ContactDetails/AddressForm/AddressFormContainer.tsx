import React from "react";
import { IAddressForm } from "../../../../models/address";
import CommonForm from "../../../CommonForm";
import { addressFormFields } from "./inputFields.json";
import { FORM_ACTIONS } from "../../../../models/constants";
import { validatePincode } from "../../../../utils";

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

const submitForm = (valuesSubmitted: IAddressForm) => {};

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

function AddressFormContainer({ countryList }: { countryList: { id: string; name: string }[] }) {
	const initialValues = getInitialFormValues();
	(addressFormFields[4].optionsArray as { id: string; name: string }[]) = countryList;

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
