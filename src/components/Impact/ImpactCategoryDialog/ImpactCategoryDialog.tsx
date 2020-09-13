import React from "react";
import {
	IImpactCategory,
	IImpactCategoryProps,
	IImpactCategoryData,
} from "../../../models/impact/impact";
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
import {
	GET_IMPACT_CATEGORY_BY_ORG,
	GET_IMPACT_CATEGORY_COUNT_BY_ORG,
} from "../../../graphql/Impact/query";
import { FORM_ACTIONS } from "../../../models/constants";
import { IGetImpactCategory } from "../../../models/impact/query";

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
				update: async (store, { data: createImpactCategoryOrgInput }) => {
					try {
						const count = await store.readQuery<{ impactCategoryOrgCount: number }>({
							query: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ impactCategoryOrgCount: number }>({
							query: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								impactCategoryOrgCount: count!.impactCategoryOrgCount + 1,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.impactCategoryOrgCount;
						}
						const dataRead = await store.readQuery<IGetImpactCategory>({
							query: GET_IMPACT_CATEGORY_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let impactCategories: IImpactCategoryData[] = dataRead?.impactCategoryOrgList
							? dataRead?.impactCategoryOrgList
							: [];

						store.writeQuery<IGetImpactCategory>({
							query: GET_IMPACT_CATEGORY_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								impactCategoryOrgList: [
									createImpactCategoryOrgInput,
									...impactCategories,
								],
							},
						});
					} catch (err) {
						console.error(err);
					}
				},
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
			notificationDispatch(setSuccessNotification("Impact Category Updation Success"));
			handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification("Impact Category Updation Failure"));
			handleClose();
		}
	};

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={creatingImpactCategory || updatingImpactCategory}
			title="Impact Category"
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
