import { useLazyQuery, useMutation } from "@apollo/client";
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
	CREATE_DELIVERABLE_UNIT,
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	UPDATE_DELIVERABLE_UNIT_ORG,
} from "../../graphql/Deliverable/unit";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../utils";

const defaultFormValues: IUnits = {
	name: "",
	code: "",
	description: "",
};

const validate = (values: IUnits) => {
	let errors: Partial<IUnits> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

function Unit(props: IUnitProps) {
	const [createUnit, { loading: creatingUnit }] = useMutation(CREATE_DELIVERABLE_UNIT);
	const [updateUnit, { loading: updatingUnit }] = useMutation(UPDATE_DELIVERABLE_UNIT_ORG);
	// const [deleteUnit, { loading: deletingUnit }] = useMutation(DELETE_UNIT);

	const [getProjects, { data: projectsList }] = useLazyQuery(GET_PROJECTS);

	useEffect(() => {
		getProjects();
	}, []);

	useEffect(() => {
		if (projectsList) {
			addUnitForm[5].optionsArray = projectsList.orgProject;
		}
	}, [projectsList]);

	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onCreate = async (valuesSubmitted: IUnits) => {
		try {
			let values = valuesSubmitted;
			delete values.is_project;
			delete values.project_id;
			await createUnit({
				variables: {
					input: values,
				},
				refetchQueries: [
					{
						query: GET_DELIVERABLE_UNIT_BY_ORG,
					},
					{
						query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
					},
				],
			});
			notificationDispatch(setSuccessNotification("Unite created successfully"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
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

			delete (values as any).id;
			await updateUnit({
				variables: {
					id: initialValues?.id,
					input: values,
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
		value ? (addUnitForm[5].hidden = false) : (addUnitForm[5].hidden = true);
	};

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
			await updateUnit({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
					},
				},
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
