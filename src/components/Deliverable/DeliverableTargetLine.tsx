import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
	IDeliverableTargetLine,
	DeliverableTargetLineProps,
} from "../../models/deliverable/deliverableTargetLine";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { CREATE_DELIVERABLE_CATEGORY } from "../../graphql/queries/Deliverable/category";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { deliverableTragetLineForm } from "../../utils/inputFields.json";

function getInitialValues(props: DeliverableTargetLineProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		deliverable_target_project: props.deliverableTarget,
		annual_year: "string",
		value: "",
		financial_years_org: -1,
		financial_years_donor: -1,
		reporting_date: "",
		note: "",
	};
}

function DeliverableTargetLine(props: DeliverableTargetLineProps) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IDeliverableTargetLine = getInitialValues(props);
	const [createDeliverableCategory, { data: response, loading }] = useMutation(
		CREATE_DELIVERABLE_CATEGORY
	);

	useEffect(() => {
		if (response) {
			notificationDispatch(setSuccessNotification("Deliverable category created !"));
			props.handleClose();
		}
	}, [response]);
	const onCreate = async (value: IDeliverableTargetLine) => {
		// console.log(`on Created is called with: `, value);
		// try {
		// 	await createDeliverableCategory({ variables: { input: value } });
		// } catch (error) {
		// 	notificationDispatch(setErrorNotification("Deliverable category creation Failed !"));
		// }
	};

	const onUpdate = (value: IDeliverableTargetLine) => {};

	const clearErrors = (values: IDeliverableTargetLine) => {};

	const validate = (values: IDeliverableTargetLine) => {
		let errors: Partial<IDeliverableTargetLine> = {};
		if (!values.annual_year) {
			errors.annual_year = "Annual year is required";
		}

		return errors;
	};

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	return (
		<React.Fragment>
			<FormDialog
				title={"New Deliverable Target Line"}
				subtitle={"Manage Targets"}
				workspace={"workspace"}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: deliverableTragetLineForm,
					}}
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default DeliverableTargetLine;
