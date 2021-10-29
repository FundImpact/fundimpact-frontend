import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../models/constants";
import { IUnits, IUnitProps } from "../../models/units";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys } from "../../utils";
import { removeEmptyKeys } from "../../utils";
import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { addUnitForm } from "./inputField.json";
import { useIntl } from "react-intl";
import DeleteModal from "../DeleteModal";
import { CREATE_UNIT, UPDATE_UNIT, DELETE_UNIT } from "../../graphql/Unit/mutation";
import { GET_PROJECTS } from "../../graphql";

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
	const [createUnit, { loading: creatingUnit }] = useMutation(CREATE_UNIT);
	const [updateUnit, { loading: updatingUnit }] = useMutation(UPDATE_UNIT);
	const [deleteUnit, { loading: deletingUnit }] = useMutation(DELETE_UNIT);

	const [currentIsProject, setCurrentIsProject] = useState<boolean>(false);
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
		// try {
		// 	let values = removeEmptyKeys<IUnits>({ objectToCheck: valuesSubmitted });
		// 	await createCategory({
		// 		variables: {
		// 			input: { data: { ...values } },
		// 		},
		// 		refetchQueries: [
		// 			{
		// 				query: GET_YEARTAGS,
		// 			},
		// 			{
		// 				query: GET_YEARTAGS_COUNT,
		// 			},
		// 		],
		// 	});
		// 	notificationDispatch(setSuccessNotification("Year Tag Creation Success"));
		// } catch (err: any) {
		// 	notificationDispatch(setErrorNotification(err?.message));
		// } finally {
		// 	props.handleClose();
		// }
	};

	const onUpdate = async (valuesSubmitted: IUnits) => {
		// try {
		// 	let values = removeEmptyKeys<IUnits>({
		// 		objectToCheck: valuesSubmitted,
		// 	});
		// 	if (compareObjectKeys(values, initialValues)) {
		// 		props.handleClose();
		// 		return;
		// 	}
		// 	delete (values as any).id;
		// 	await updateCategory({
		// 		variables: {
		// 			input: {
		// 				where: {
		// 					id: initialValues?.id,
		// 				},
		// 				data: values,
		// 			},
		// 		},
		// 	});
		// 	notificationDispatch(setSuccessNotification("Year Tag Updation Success"));
		// } catch (err) {
		// 	notificationDispatch(setErrorNotification(err?.message));
		// } finally {
		// 	props.handleClose();
		// }
	};

	addUnitForm[4].getInputValue = (value: boolean) => {
		setCurrentIsProject(value);
	};

	currentIsProject ? (addUnitForm[5].hidden = false) : (addUnitForm[5].hidden = true);

	// useEffect(() => {
	// 	console.log("IsProject: ", currentIsProject);
	// }, [currentIsProject]);

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
		// try {
		// 	await deleteCategory({
		// 		variables: {
		// 			input: {
		// 				where: {
		// 					id: initialValues?.id,
		// 				},
		// 			},
		// 		},
		// 		refetchQueries: [
		// 			{
		// 				query: GET_YEARTAGS,
		// 			},
		// 		],
		// 	});
		// 	notificationDispatch(setSuccessNotification("Year Tag Delete Success"));
		// } catch (err) {
		// 	notificationDispatch(setErrorNotification(err.message));
		// } finally {
		// 	props.handleClose();
		// }
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
				loading={creatingUnit || updatingUnit || deletingUnit}
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
