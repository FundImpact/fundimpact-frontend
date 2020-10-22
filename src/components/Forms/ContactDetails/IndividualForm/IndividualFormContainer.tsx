import React from "react";
import CommonForm from "../../../CommonForm";
import { IIndividualForm } from "../../../../models/individual";
import { individualFormFields } from "./inputField.json";
import { FORM_ACTIONS } from "../../constant";

const getInitialFormValues = (): IIndividualForm => {
	return {
		first_name: "",
		last_name: "",
	};
};

const submitForm = (valuesSubmitted: IIndividualForm) => {};

const onCancel = () => {};

const validate = (values: IIndividualForm) => {
	let errors: Partial<IIndividualForm> = {};
	if (!values.first_name) {
		errors.first_name = "First name is required";
	}
	return errors;
};

function IndividualFormContainer() {
	const initialValues = getInitialFormValues();

	return (
		<CommonForm
			initialValues={initialValues}
			validate={validate}
			onCreate={submitForm}
			onCancel={onCancel}
			inputFields={individualFormFields}
			formAction={FORM_ACTIONS.CREATE}
			onUpdate={submitForm}
		/>
	);
}

export default IndividualFormContainer;
