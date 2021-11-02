import React from "react";
import Tallyforms from "../../../components/Forms/Tally";
import { ITallyForm } from "../../../components/Forms/Tally/models";

const TallyFormContainer = ({
	initialValues,
	inputFields,
	validate,
	onSubmit,
	onCancel,
	formAction,
	onUpdate,
	children,
}: ITallyForm) => {
	return (
		<Tallyforms
			{...{
				initialValues,
				inputFields,
				validate,
				onSubmit,
				onCancel,
				formAction,
				onUpdate,
			}}
		>
			{children}
		</Tallyforms>
	);
};

export default TallyFormContainer;
