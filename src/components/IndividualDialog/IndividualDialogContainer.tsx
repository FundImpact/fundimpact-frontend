import React, { useMemo } from "react";
import { individualFormFields } from "./inputField.json";
import { IIndividualForm } from "../../models/individual";
import { FORM_ACTIONS } from "../Forms/constant";
import CommonForm from "../CommonForm";
import FormDialog from "../FormDialog";
import { useIntl } from "react-intl";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { ICreateIndividualVariables, ICreateIndividual } from "../../models/individual/query.js";
import { IGetProject } from "../../models/project/project.js";

interface IIndividualDialogContainerProps {
	open: boolean;
	handleClose: () => void;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	loading: boolean;
	projects: IGetProject["orgProject"];
}

const getInitialFormValues = (): IIndividualForm => {
	return {
		name: "",
		project: [],
	};
};

const submitForm = (valuesSubmitted: IIndividualForm) => {};

const onCancel = () => {};

const validate = (values: IIndividualForm) => {
	let errors: Partial<IIndividualForm> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

const sortProjectsToGroupProject = (projects: IGetProject["orgProject"]) =>
	projects.sort((project1, project2) => +project1.workspace.id - +project2.workspace.id);

const getProjectGroupHeading = (project: IGetProject["orgProject"][0]) => {
	console.log("project :>> ", project);
	return project.workspace.name;
};

function IndividualDialogContainer({
	open,
	handleClose,
	loading,
	createIndividual,
	projects,
}: IIndividualDialogContainerProps) {
	const initialValues = getInitialFormValues();
	const intl = useIntl();
	console.log("projects :>> ", projects);
	(individualFormFields[1].optionsArray as IGetProject["orgProject"]) = useMemo(
		() => sortProjectsToGroupProject(projects.slice() || []),
		[projects]
	);

	(individualFormFields[1].autoCompleteGroupBy as unknown) = getProjectGroupHeading;

	const title = intl.formatMessage({
		id: "individualFormTitle",
		defaultMessage: "Add individual",
		description: `This text will be show on add individual form`,
	});

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={false}
			title={title}
			subtitle={""}
			workspace={""}
			project={""}
		>
			<CommonForm
				initialValues={initialValues}
				validate={validate}
				onCreate={submitForm}
				onCancel={handleClose}
				inputFields={individualFormFields}
				formAction={FORM_ACTIONS.CREATE}
				onUpdate={submitForm}
			/>
		</FormDialog>
	);
}

export default IndividualDialogContainer;
