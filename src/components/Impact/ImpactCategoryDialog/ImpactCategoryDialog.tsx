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
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { IGetImpactCategory } from "../../../models/impact/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../../utils/commonFormattedMessage";
// import { useLocation } from "react-router";
import DeleteModal from "../../DeleteModal";

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
	organization,
	dialogType,
}: IImpactCategoryProps) {
	const [createImpactCategoryOrgInput, { loading: creatingImpactCategory }] = useMutation(
		CREATE_IMPACT_CATEGORY_ORG_INPUT
	);

	const [updateImpactCategory, { loading: updatingImpactCategory }] = useMutation(
		UPDATE_IMPACT_CATEGORY_ORG
	);
	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	const initialValues = formAction === FORM_ACTIONS.CREATE ? defauleValues : formValues;

	const onSubmit = async (values: IImpactCategory) => {
		try {
			await createImpactCategoryOrgInput({
				variables: {
					input: {
						...values,
						organization: organization,
					},
				},
				refetchQueries: [
					{
						query: GET_IMPACT_CATEGORY_BY_ORG,
						variables: { filter: { organization: organization } },
					},
				],
				update: async (store, { data: createImpactCategoryOrgInputData }) => {
					try {
						const count = await store.readQuery<{ impactCategoryOrgCount: number }>({
							query: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: organization,
								},
							},
						});

						store.writeQuery<{ impactCategoryOrgCount: number }>({
							query: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: organization,
								},
							},
							data: {
								impactCategoryOrgCount:
									(count && count.impactCategoryOrgCount + 1) || 0,
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
									organization: organization,
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
									organization: organization,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								impactCategoryOrgList: [
									createImpactCategoryOrgInputData,
									...impactCategories,
								],
							},
						});
					} catch (err) {
						// console.error(err);
					}
				},
			});
			notificationDispatch(setSuccessNotification("Impact Category Creation Success"));
			handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
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
						organization: organization,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Impact Category Updation Success"));
			handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
			handleClose();
		}
	};

	const onDelete = async () => {
		try {
			const impactCategoryValues: any = { ...initialValues };
			delete impactCategoryValues["id"];
			await updateImpactCategory({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...impactCategoryValues,
					},
				},
				refetchQueries: [
					{
						query: GET_IMPACT_CATEGORY_COUNT_BY_ORG,
						variables: {
							filter: {
								organization: dashboardData?.organization?.id,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Impact Category Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	const intl = useIntl();

	if (dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				handleClose={handleClose}
				open={open}
				onDeleteConformation={onDelete}
				title="Delete Impact Category"
			/>
		);
	}

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={creatingImpactCategory || updatingImpactCategory}
			title={
				newOrEdit +
				" " +
				intl.formatMessage({
					id: "impactCategoryFormTitle",
					defaultMessage: "Impact Category",
					description: `This text will be show on impact Category form for title`,
				})
			}
			subtitle={intl.formatMessage({
				id: "impactCategoryFormSubtitle",
				defaultMessage:
					"Physical addresses of your organization like headquater, branch etc.",
				description: `This text will be show on impact Category form for subtitle`,
			})}
			workspace={""}
			project={""}
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
