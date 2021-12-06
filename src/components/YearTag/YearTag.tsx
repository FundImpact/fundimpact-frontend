import { useMutation, useQuery } from "@apollo/client";
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
import { GET_COUNTRY_DATA } from "../../graphql/Geographies/GeographyCountry";

const defaultFormValues: IYearTag = {
	type: "annual",
	name: "",
	start_date: new Date(),
	end_date: new Date(),
	country_id: [],
};

const validate = (values: IYearTag) => {
	let errors: Partial<IYearTag> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (values.end_date <= values.start_date) {
		errors.end_date = "Time period must be bigger than or equal to start time period";
	}
	return errors;
};

function YearTag(props: IYearTagProps) {
	const { data: countryList } = useQuery(GET_COUNTRY_DATA);

	addYearTagForm[1].getInputValue = (value: any) => {
		if (value === "financial") {
			addYearTagForm[4].hidden = false;
		} else {
			addYearTagForm[4].hidden = true;
		}
	};

	let dummyArray: any = [];

	countryList?.countries.map((elem: any) =>
		dummyArray.push({
			id: elem.id,
			name: elem.name,
		})
	);

	addYearTagForm[4].optionsArray = dummyArray;
	const [createYearTag, { loading: creatingYearTag }] = useMutation(CREATE_YEAR_TAG);
	const [updateYearTag, { loading: updatingYearTag }] = useMutation(UPDATE_YEAR_TAG);
	const [deleteYearTag, { loading: deletingYearTag }] = useMutation(DELETE_YEAR_TAG);

	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	console.log("props.initialValues", props.initialValues);

	let parseValue: any = props.initialValues;

	// console.log("parseValue", JSON.parse(parseValue?.country_id));

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onCreate = async (valuesSubmitted: IYearTag) => {
		try {
			let values = removeEmptyKeys<IYearTag>({ objectToCheck: valuesSubmitted });
			// let country_id = JSON.stringify(values.country_id);

			let country_id = values.country_id;
			// let country_id = {};
			// values.country_id?.map((value: any) => {
			// 	Object.assign(country_id, { [value.id]: value });
			// });

			console.log("country_id", country_id);

			await createYearTag({
				variables: {
					input: { data: { ...values, country_id } },
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
		} catch (err: any) {
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
		} catch (err: any) {
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
