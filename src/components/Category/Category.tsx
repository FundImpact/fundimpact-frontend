import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../models/constants";
import { ICategory, ICategoryProps } from "../../models/categories";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../utils";

import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { addCategoryForm } from "./inputField.json";
import { useIntl } from "react-intl";
import DeleteModal from "../DeleteModal";
import {
	CREATE_CATEGORY,
	UPDATE_CATEGORY,
	DELETE_CATEGORY,
	GET_CATEGORY_COUNT,
} from "../../graphql/Category/mutation";
import { GET_PROJECTS } from "../../graphql";
import { GET_CATEGORIES, GET_CATEGORY_TYPES } from "../../graphql/Category/query";

const defaultFormValues: ICategory = {
	name: "",
	code: "",
	description: "",
	type: "",
	is_project: false,
	project_id: "",
	// {
	// 	id: "",
	// 	name: "",
	// } || 0,
};

const validate = (values: ICategory) => {
	let errors: Partial<ICategory> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

function Category(props: ICategoryProps) {
	const [createCategory, { loading: creatingCategory }] = useMutation(CREATE_CATEGORY);
	const [updateCategory, { loading: updatingCategory }] = useMutation(UPDATE_CATEGORY);
	const [deleteCategory, { loading: deletingCategory }] = useMutation(DELETE_CATEGORY);

	const [currentIsProject, setCurrentIsProject] = useState<boolean>(false);
	const [getProjects, { data: projectsList }] = useLazyQuery(GET_PROJECTS);

	const { data: deliverableTypesList } = useQuery(GET_CATEGORY_TYPES);

	useEffect(() => {
		getProjects();
	}, []);

	useEffect(() => {
		if (projectsList) {
			addCategoryForm[5].optionsArray = projectsList?.orgProject;
		}
		if (deliverableTypesList) {
			addCategoryForm[3].optionsArray = deliverableTypesList?.deliverableTypes;
		}
	}, [projectsList, deliverableTypesList]);

	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const formAction = props.formAction;

	const formValues = props.initialValues;

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	let organization_id = dashboardData?.organization?.id;

	const onCreate = async (valuesSubmitted: ICategory) => {
		try {
			let value = removeEmptyKeys<ICategory>({ objectToCheck: valuesSubmitted });

			let values = { ...value, organization_id };

			delete values.is_project;
			if (!values.project_id) delete values.project_id;
			await createCategory({
				variables: {
					input: { data: { ...values } },
				},
				refetchQueries: [
					{
						query: GET_CATEGORIES,
						variables: {
							filter: {
								organization_id: dashboardData?.organization?.id,
							},
						},
					},
				],
			});

			notificationDispatch(setSuccessNotification("Category Creation Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
			setCurrentIsProject(false);
		}
	};

	addCategoryForm[4].getInputValue = (value: boolean) => {
		setCurrentIsProject(value);
		// value ? (addCategoryForm[5].hidden = false) : (addCategoryForm[5].hidden = true);
	};

	currentIsProject ? (addCategoryForm[5].hidden = false) : (addCategoryForm[5].hidden = true);

	if (!formValues?.project_id && formAction === "UPDATE") {
		addCategoryForm[4].hidden = true;
		addCategoryForm[5].hidden = true;
	}

	if (formValues?.project_id && formAction === "UPDATE") {
		formValues.is_project = true;
		// addCategoryForm[5].disabled = true;
		// addCategoryForm[5].hidden = false;
		addCategoryForm[4].hidden = false;
		if (currentIsProject) {
			addCategoryForm[5].hidden = true;
		} else {
			addCategoryForm[5].disabled = true;
			addCategoryForm[5].hidden = false;
		}
	}
	if (formAction === "CREATE") {
		addCategoryForm[4].hidden = false;
		addCategoryForm[5].disabled = false;
	}

	const onUpdate = async (valuesSubmitted: ICategory) => {
		try {
			let values = removeEmptyKeys<ICategory>({
				objectToCheck: valuesSubmitted,
			});
			if (compareObjectKeys(values, initialValues)) {
				props.handleClose();
				return;
			}

			delete (values as any).id;
			delete values.is_project;
			await updateCategory({
				variables: {
					input: {
						where: {
							id: initialValues?.id,
						},
						data: values,
					},
				},
				refetchQueries: [
					{
						query: GET_CATEGORIES,
						variables: {
							filter: {
								organization_id: dashboardData?.organization?.id,
							},
						},
					},
					{
						query: GET_CATEGORIES,
						variables: {
							filter: {
								type: initialValues?.type,
								organization_id: dashboardData?.organization?.id,
								project_id: dashboardData?.project?.id,
							},
						},
					},
					{
						query: GET_CATEGORY_COUNT,
					},
				],
			});
			notificationDispatch(setSuccessNotification("Category Updation Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

	const intl = useIntl();

	const getTitle = () => {
		if (props.formAction === FORM_ACTIONS.CREATE) {
			return intl.formatMessage({
				id: `categoryCreateFormTitle`,
				defaultMessage: "Add Category",
				description: `This text will be show as title of category form`,
			});
		} else {
			return intl.formatMessage({
				id: `categoryUpdateFormTitle`,
				defaultMessage: "Update Category",
				description: `This text will be show as title of category form`,
			});
		}
	};

	const updateCategorySubtitle = intl.formatMessage({
		id: "categoryUpdateFormSubtitle",
		defaultMessage: "Update Category",
		description: `This text will be show on update category form`,
	});

	const createCategorySubtitle = intl.formatMessage({
		id: "categoryCreateFormSubtitle",
		defaultMessage: "Create New Category ",
		description: `This text will be show on create category form`,
	});

	const onDelete = async () => {
		try {
			await deleteCategory({
				variables: {
					input: {
						where: {
							id: initialValues?.id,
						},
					},
				},
				refetchQueries: [
					{
						query: GET_CATEGORIES,
						variables: {
							filter: {
								organization_id: dashboardData?.organization?.id,
								project_id: dashboardData?.project?.id,
							},
						},
					},
					{
						query: GET_CATEGORIES,
						variables: {
							filter: {
								type: initialValues?.type,
								organization_id: dashboardData?.organization?.id,
								project_id: dashboardData?.project?.id,
							},
						},
					},
					{
						query: GET_CATEGORY_COUNT,
					},
				],
			});
			notificationDispatch(setSuccessNotification("categories Delete Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			props.handleClose();
		}
	};

	if (props.deleteCategory) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={props.handleClose}
				onDeleteConformation={onDelete}
				title="Delete Category"
			/>
		);
	}
	// if (formValues?.project_id && formAction === "UPDATE") {
	// 	budgetCategoryFormInputFields[4].disabled = true;
	// 	budgetCategoryFormInputFields[3].hidden = false;
	// }

	// if (!formValues?.project_id && formAction === "UPDATE") {
	// 	budgetCategoryFormInputFields[3].hidden = true;
	// 	budgetCategoryFormInputFields[4].hidden = true;
	// }
	// if (formAction === "CREATE") {
	// 	budgetCategoryFormInputFields[3].hidden = false;
	// 	budgetCategoryFormInputFields[4].disabled = false;
	// }

	return (
		<>
			<FormDialog
				handleClose={props.handleClose}
				open={props.open}
				loading={creatingCategory || updatingCategory || deletingCategory}
				title={getTitle()}
				subtitle={
					props.formAction === FORM_ACTIONS.CREATE
						? createCategorySubtitle
						: updateCategorySubtitle
				}
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onCreate}
					onCancel={props.handleClose}
					inputFields={addCategoryForm}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default Category;
