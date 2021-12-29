import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../models/constants";
import { IUnits, IUnitProps } from "../../models/units";
import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { addUnitForm } from "./inputField.json";
import { useIntl } from "react-intl";
import DeleteModal from "../DeleteModal";
import { GET_PROJECTS } from "../../graphql";
import {
	CREATE_UNIT,
	DELETE_UNIT,
	GET_UNIT,
	GET_UNIT_COUNT,
	UPDATE_UNIT,
} from "../../graphql/Deliverable/unit";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../utils";
import { GET_CATEGORY_TYPES } from "../../graphql/Category/query";

const defaultFormValues: IUnits = {
	name: "",
	code: "",
	description: "",
	type: "",
	project_id: "",
};

const validate = (values: IUnits) => {
	let errors: Partial<IUnits> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

function Unit(props: IUnitProps) {
	const [isCurrentProject, setIsCurrentProject] = useState(false);
	const [createUnit, { loading: creatingUnit }] = useMutation(CREATE_UNIT);
	// const [createUnit, { loading: creatingUnit }] = useMutation(CREATE_DELIVERABLE_UNIT);
	const [updateUnit, { loading: updatingUnit }] = useMutation(UPDATE_UNIT);
	// const [updateUnit, { loading: updatingUnit }] = useMutation(UPDATE_DELIVERABLE_UNIT_ORG);
	const [deleteUnit, { loading: deletingUnit }] = useMutation(DELETE_UNIT);

	const [getProjects, { data: projectsList }] = useLazyQuery(GET_PROJECTS);

	const { data: deliverableTypesList } = useQuery(GET_CATEGORY_TYPES);

	useEffect(() => {
		getProjects();
	}, []);

	useEffect(() => {
		if (projectsList) {
			addUnitForm[5].optionsArray = projectsList.orgProject;
		}
		if (deliverableTypesList) {
			addUnitForm[3].optionsArray = deliverableTypesList?.deliverableTypes;
		}
	}, [projectsList, deliverableTypesList]);
	// }, [projectsList]);

	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const formAction = props.formAction;

	const formValues = props.initialValues;

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	let organization_id = dashboardData?.organization?.id;

	const onCreate = async (valuesSubmitted: IUnits) => {
		try {
			let values = { ...valuesSubmitted, organization_id };
			// let values = valuesSubmitted;

			console.log("vvvv", values);
			delete values.is_project;
			if (!values.project_id) delete values.project_id;
			// delete values.project_id;
			await createUnit({
				variables: {
					input: {
						data: values,
					},
				},
				refetchQueries: [
					{
						query: GET_UNIT,
						variables: {
							filter: {
								organization_id: dashboardData?.organization?.id,
							},
						},
					},
					{
						query: GET_UNIT_COUNT,
					},
				],
			});
			notificationDispatch(setSuccessNotification("Unit created successfully"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
			setIsCurrentProject(false);
		}
	};

	const onUpdate = async (valuesSubmitted: IUnits) => {
		try {
			let values = removeEmptyKeys<IUnits>({
				objectToCheck: valuesSubmitted,
			});
			if (compareObjectKeys(values, initialValues)) {
				props.handleClose();
				return;
			}

			delete values.id;
			delete values.is_project;
			delete values.project_id;
			await updateUnit({
				variables: {
					id: initialValues?.id,
					input: {
						where: {
							id: initialValues?.id,
						},
						data: values,
					},
					refetchQueries: [
						{
							query: GET_UNIT,
						},
						{
							query: GET_UNIT_COUNT,
						},
					],
				},
			});
			notificationDispatch(setSuccessNotification("Unit updated successfully"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

	addUnitForm[4].getInputValue = (value: boolean) => {
		setIsCurrentProject(value);
	};

	isCurrentProject ? (addUnitForm[5].hidden = false) : (addUnitForm[5].hidden = true);

	const intl = useIntl();

	const getTitle = () => {
		if (props.formAction === FORM_ACTIONS.CREATE) {
			return intl.formatMessage({
				id: `unitCreateFormTitle`,
				defaultMessage: "Add Unit",
				description: `This text will be show as title of unit form`,
			});
		} else {
			return intl.formatMessage({
				id: `unitUpdateFormTitle`,
				defaultMessage: "Update Unit",
				description: `This text will be show as title of unit form`,
			});
		}
	};

	const updateUnitSubtitle = intl.formatMessage({
		id: "unitUpdateFormSubtitle",
		defaultMessage: "Update Unit",
		description: `This text will be show on update unit form`,
	});

	const createUnitSubtitle = intl.formatMessage({
		id: "unitCreateFormSubtitle",
		defaultMessage: "Create New Unit ",
		description: `This text will be show on create unit form`,
	});

	const onDelete = async () => {
		try {
			await deleteUnit({
				variables: {
					id: initialValues?.id,
					input: {
						where: {
							id: initialValues?.id,
						},
					},
				},
				refetchQueries: [
					{
						query: GET_UNIT,
					},
					{
						query: GET_UNIT_COUNT,
					},
				],
			});
			notificationDispatch(setSuccessNotification("Unit deleted successfully"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

	if (props.deleteUnit) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={props.handleClose}
				onDeleteConformation={onDelete}
				title="Delete Unit"
			/>
		);
	}

	if (!formValues?.project_id && formAction === "UPDATE") {
		addUnitForm[4].hidden = true;
		addUnitForm[5].hidden = true;
	}

	if (formValues?.project_id && formAction === "UPDATE") {
		formValues.is_project = true;
		addUnitForm[5].disabled = true;
		addUnitForm[5].hidden = false;
		addUnitForm[4].hidden = false;
	}
	if (formAction === "CREATE") {
		addUnitForm[4].hidden = false;
		addUnitForm[5].disabled = false;
	}

	return (
		<>
			<FormDialog
				handleClose={props.handleClose}
				open={props.open}
				loading={creatingUnit || updatingUnit}
				title={getTitle()}
				subtitle={
					props.formAction === FORM_ACTIONS.CREATE
						? createUnitSubtitle
						: updateUnitSubtitle
				}
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onCreate}
					onCancel={props.handleClose}
					inputFields={addUnitForm}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default Unit;
