import { useMutation } from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../models/constants";
import { IYearTag, IYearTagProps } from "../../models/yearTags";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys } from "../../utils";
import { removeEmptyKeys } from "../../utils";
import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { addYearTagForm } from "./inputField.json";
import { useIntl } from "react-intl";
import DeleteModal from "../DeleteModal";
import { CREATE_YEAR_TAG, DELETE_YEAR_TAG, UPDATE_YEAR_TAG } from "../../graphql/yearTags/mutation";
import { GET_YEARTAGS, GET_YEARTAGS_COUNT } from "../../graphql/yearTags/query";

const defaultFormValues: IYearTag = {
	type: "annual",
	name: "",
	start_date: new Date(),
	end_date: new Date(),
};

const validate = (values: IYearTag) => {
	let errors: Partial<IYearTag> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

function YearTag(props: IYearTagProps) {
	const [createYearTag, { loading: creatingYearTag }] = useMutation(CREATE_YEAR_TAG);
	const [updateYearTag, { loading: updatingYearTag }] = useMutation(UPDATE_YEAR_TAG);
	const [deleteYearTag, { loading: deletingYearTag }] = useMutation(DELETE_YEAR_TAG);

	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onCreate = async (valuesSubmitted: IYearTag) => {
		try {
			let values = removeEmptyKeys<IYearTag>({ objectToCheck: valuesSubmitted });

			await createYearTag({
				variables: {
					input: { data: { ...values } },
				},
				refetchQueries: [
					{
						query: GET_YEARTAGS,
					},
					{
						query: GET_YEARTAGS_COUNT,
					},
				],
			});
			notificationDispatch(setSuccessNotification("Year Tag Creation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

	const onUpdate = async (valuesSubmitted: IYearTag) => {
		try {
			let values = removeEmptyKeys<IYearTag>({
				objectToCheck: valuesSubmitted,
			});

			if (compareObjectKeys(values, initialValues)) {
				props.handleClose();
				return;
			}
			delete (values as any).id;

			await updateYearTag({
				variables: {
					input: {
						where: {
							id: initialValues?.id,
						},
						data: values,
					},
				},
			});

			notificationDispatch(setSuccessNotification("Year Tag Updation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

	const intl = useIntl();

	const getTitle = () => {
		if (props.formAction === FORM_ACTIONS.CREATE) {
			return intl.formatMessage({
				id: `yearTagCreateFormTitle`,
				defaultMessage: "Add Year Tag",
				description: `This text will be show as title of year tag form`,
			});
		} else {
			return intl.formatMessage({
				id: `yearTagUpdateFormTitle`,
				defaultMessage: "Update Year Tag",
				description: `This text will be show as title of year tag form`,
			});
		}
	};

	const updateYearTagSubtitle = intl.formatMessage({
		id: "yearTagUpdateFormSubtitle",
		defaultMessage: "Update Year Tag",
		description: `This text will be show on update year tag form`,
	});

	const createYearTagSubtitle = intl.formatMessage({
		id: "yearTagCreateFormSubtitle",
		defaultMessage: "Create New Year Tag ",
		description: `This text will be show on create Year Tag form`,
	});

	const onDelete = async () => {
		try {
			await deleteYearTag({
				variables: {
					input: {
						where: {
							id: initialValues?.id,
						},
					},
				},
				refetchQueries: [
					{
						query: GET_YEARTAGS,
					},
				],
			});

			notificationDispatch(setSuccessNotification("Year Tag Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			props.handleClose();
		}
	};

	if (props.deleteYearTag) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={props.handleClose}
				onDeleteConformation={onDelete}
				title="Delete Year Tag"
			/>
		);
	}

	return (
		<>
			<FormDialog
				handleClose={props.handleClose}
				open={props.open}
				loading={creatingYearTag || updatingYearTag || deletingYearTag}
				title={getTitle()}
				subtitle={
					props.formAction === FORM_ACTIONS.CREATE
						? createYearTagSubtitle
						: updateYearTagSubtitle
				}
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onCreate}
					onCancel={props.handleClose}
					inputFields={addYearTagForm}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default YearTag;
