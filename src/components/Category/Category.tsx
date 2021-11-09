import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../models/constants";
import { ICategory, ICategoryProps } from "../../models/categories";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
// import { removeEmptyKeys } from "../../utils";
import { compareObjectKeys, removeEmptyKeys } from "../../utils";

import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { addCategoryForm } from "./inputField.json";
import { useIntl } from "react-intl";
import DeleteModal from "../DeleteModal";
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from "../../graphql/Category/mutation";
import { GET_PROJECTS } from "../../graphql";
import { GET_CATEGORIES } from "../../graphql/Category/query";

const defaultFormValues: ICategory = {
	name: "",
	code: "",
	description: "",
	cat_type: "",
	is_project: false,
	project_id: {
		id: "",
		name: "",
	},
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

	useEffect(() => {
		getProjects();
	}, []);

	useEffect(() => {
		if (projectsList) {
			addCategoryForm[5].optionsArray = projectsList.orgProject;
		}
	}, [projectsList]);

	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onCreate = async (valuesSubmitted: ICategory) => {
		try {
			let values = removeEmptyKeys<ICategory>({ objectToCheck: valuesSubmitted });
			console.log("values Category", values);
			delete values.is_project;
			await createCategory({
				variables: {
					// input: { data: { ...valuesSubmitted } },
					input: { data: { ...values } },
				},
				refetchQueries: [
					{
						query: GET_CATEGORIES,
					},
					// {
					// 	query: GET_YEARTAGS_COUNT,
					// },
				],
			});
			notificationDispatch(setSuccessNotification("Year Tag Creation Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

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
			});
			notificationDispatch(setSuccessNotification("Category Updation Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

	addCategoryForm[4].getInputValue = (value: boolean) => {
		value ? (addCategoryForm[5].hidden = false) : (addCategoryForm[5].hidden = true);
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
