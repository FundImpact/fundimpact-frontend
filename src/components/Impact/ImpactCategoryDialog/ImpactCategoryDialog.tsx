import React from "react";
import { IImpactCategory, IImpactCategoryProps } from "../../../models/impact/impact";
import { useMutation } from "@apollo/client";
import {
	CREATE_IMPACT_CATEGORY_ORG_INPUT,
	UPDATE_IMPACT_CATEGORY_ORG,
} from "../../../graphql/Impact/mutation";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import dataInputFields from "../inputField.json";
import { IInputField } from "../../../models";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { FORM_ACTIONS } from "../../../models/constants";

let inputFields: IInputField[] = dataInputFields.impactCategoryForm;

const defauleValues: IImpactCategory = {
	name: "",
	description: "",
	code: "",
	shortname: "",
};

const validate = (values: IImpactCategory) => {
	let errors: Partial<IImpactCategory> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Impact Code is required";
	}
	if (!values.shortname) {
		errors.shortname = "Shortname is required";
	}
	return errors;
};

function ImpactCategoryDialog({
	open,
	handleClose,
	formAction,
	initialValues: formValues,
}: IImpactCategoryProps) {
	const [createImpactCategoryOrgInput, { loading: creatingImpactCategory }] = useMutation(
		CREATE_IMPACT_CATEGORY_ORG_INPUT
	);

	const [updateImpactCategory, { loading: updatingImpactCategory }] = useMutation(
		UPDATE_IMPACT_CATEGORY_ORG
	);
	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();

	const initialValues = formAction == FORM_ACTIONS.CREATE ? defauleValues : formValues;

	const onSubmit = async (values: IImpactCategory) => {
		try {
			await createImpactCategoryOrgInput({
				variables: {
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
				refetchQueries: [
					{
						query: GET_IMPACT_CATEGORY_BY_ORG,
						variables: { filter: { organization: dashboardData?.organization?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Impact Category Creation Success"));
			handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification("Impact Category Creation Failure"));
			handleClose();
		}
	};

	const onUpdate = async (values: IImpactCategory) => {
		try {
			delete values.id;
			await updateImpactCategory({
				variables: {
					id: initialValues?.id,
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Impact Category Creation Success"));
			handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification("Impact Category Creation Failure"));
			handleClose();
		}
	};

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={creatingImpactCategory || updatingImpactCategory}
			title="New Impact Category"
			subtitle="Physical addresses of your organizatin like headquater, branch etc."
			workspace={dashboardData?.workspace?.name}
			project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
		>
			<CommonForm
				inputFields={inputFields}
				onCancel={handleClose}
				onSubmit={onSubmit}
				validate={validate}
				initialValues={initialValues}
				formAction={formAction}
				onUpdate={onUpdate}
			/>
		</FormDialog>
	);
}

export default ImpactCategoryDialog;
