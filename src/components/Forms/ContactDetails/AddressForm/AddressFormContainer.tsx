import React from "react";
import { IAddressForm, IAddress } from "../../../../models/address";
import CommonForm from "../../../CommonForm";
import { addressFormFields } from "./inputFields.json";
import { FORM_ACTIONS } from "../../../../models/constants";
import { validatePincode } from "../../../../utils";
import {
	ICreateAddress,
	ICreateAddressVariables,
	IUpdateAddressVariables,
	IUpdateAddress,
} from "../../../../models/address/query";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { useNotificationDispatch } from "../../../../contexts/notificationContext";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../../reducers/notificationReducer";

type IAddressFormContainer =
	| {
			t_4_d_contact: string;
			loading: boolean;
			formAction: FORM_ACTIONS.CREATE;
			createAddress: (
				options?:
					| MutationFunctionOptions<ICreateAddress, ICreateAddressVariables>
					| undefined
			) => Promise<FetchResult<ICreateAddress, Record<string, any>, Record<string, any>>>;
			getCreatedOrUpdatedAddress?: (
				address: IUpdateAddress["updateT4DAddress"]["t4DAddress"] | null
			) => void;
			updateAddress: (
				options?:
					| MutationFunctionOptions<IUpdateAddress, IUpdateAddressVariables>
					| undefined
			) => Promise<FetchResult<IUpdateAddress, Record<string, any>, Record<string, any>>>;
	  }
	| {
			t_4_d_contact: string;
			loading: boolean;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IAddress;
			createAddress: (
				options?:
					| MutationFunctionOptions<ICreateAddress, ICreateAddressVariables>
					| undefined
			) => Promise<FetchResult<ICreateAddress, Record<string, any>, Record<string, any>>>;
			updateAddress: (
				options?:
					| MutationFunctionOptions<IUpdateAddress, IUpdateAddressVariables>
					| undefined
			) => Promise<FetchResult<IUpdateAddress, Record<string, any>, Record<string, any>>>;
			getCreatedOrUpdatedAddress?: (
				address: IUpdateAddress["updateT4DAddress"]["t4DAddress"] | null
			) => void;
	  };

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
	updateAddress: (
		options?: MutationFunctionOptions<IUpdateAddress, IUpdateAddressVariables> | undefined
	) => Promise<FetchResult<IUpdateAddress, Record<string, any>, Record<string, any>>>;
	notificationDispatch: React.Dispatch<any>;
	addressId: string;
	formAction: FORM_ACTIONS;
}

(addressFormFields[4].optionsArray as { id: string; name: string }[]) = [
	{ id: "PERMANENT", name: "PERMANENT" },
	{ id: "TEMPORARY", name: "TEMPORARY" },
	{ id: "BILLING", name: "BILLING" },
];

const getInitialFormValues = (address?: IAddress): IAddressForm => {
	if (address) {
		return {
			address_line_1: address.address_line_1,
			address_line_2: address.address_line_2,
			address_type: address.address_type,
			city: address.city,
			pincode: address.pincode,
		};
	}
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
	addressId,
	formAction,
	updateAddress,
}: ISubmitForm) => {
	try {
		let createdAddress, updatedAddress;
		if (formAction == FORM_ACTIONS.CREATE) {
			createdAddress = await createAddress({
				variables: { input: { data: { ...valuesSubmitted } } },
			});
		} else {
			updatedAddress = await updateAddress({
				variables: { input: { data: { ...valuesSubmitted }, where: { id: addressId } } },
			});
		}
		notificationDispatch(
			setSuccessNotification(
				`Address ${formAction == FORM_ACTIONS.UPDATE ? "Updated" : "Created"}`
			)
		);
		if (formAction == FORM_ACTIONS.CREATE && createdAddress && createdAddress.data) {
			return createdAddress.data.createT4DAddress.t4DAddress;
		}
		if (formAction == FORM_ACTIONS.UPDATE && updatedAddress && updatedAddress.data) {
			return updatedAddress.data.updateT4DAddress.t4DAddress;
		}
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
	return null;
};

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

function AddressFormContainer(props: IAddressFormContainer) {
	let {
		t_4_d_contact,
		createAddress,
		loading,
		getCreatedOrUpdatedAddress,
		updateAddress,
	} = props;

	const initialValues =
		props.formAction == FORM_ACTIONS.CREATE
			? getInitialFormValues()
			: getInitialFormValues(props.initialValues);

	const onCancel = () => {
		getCreatedOrUpdatedAddress && getCreatedOrUpdatedAddress(null);
	};

	const notificationDispatch = useNotificationDispatch();

	const onFormSubmit = async (valuesSubmitted: IAddressForm) => {
		try {
			props.formAction == FORM_ACTIONS.UPDATE &&
				(t_4_d_contact = props.initialValues.t_4_d_contact.id);
			const address = await submitForm({
				valuesSubmitted: { ...valuesSubmitted, t_4_d_contact },
				createAddress,
				notificationDispatch,
				updateAddress,
				formAction: props.formAction,
				addressId: props.formAction == FORM_ACTIONS.UPDATE ? props.initialValues.id : "",
			});
			getCreatedOrUpdatedAddress && address && getCreatedOrUpdatedAddress(address);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<CommonForm
			initialValues={initialValues}
			validate={validate}
			onCreate={onFormSubmit}
			onCancel={onCancel}
			inputFields={addressFormFields}
			formAction={props.formAction}
			onUpdate={onFormSubmit}
		/>
	);
}

export default AddressFormContainer;
