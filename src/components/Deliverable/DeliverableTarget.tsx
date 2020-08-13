import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
	IDeliverableTarget,
	DeliverableTargetProps,
} from "../../models/deliverable/deliverableTarget";
import Snackbar from "../Snackbar/Snackbar";
import DeliverableTargetForm from "../Forms/DeliverableTarget/DeliverableTarget";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";

function getInitialValues(props: DeliverableTargetProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Test Deliverable",
		description: "This is a sample deliverable",
		targetValue: "",
		deliverableCategory: "",
		deliverableUnit: 1,
		deliverableCategoryUnit: 1,
		project: 4,
	};
}
const getDeliverableCategory = async () => {};
function DeliverableTarget(props: DeliverableTargetProps) {
	let initialValues: IDeliverableTarget = getInitialValues(props);
	const onCreate = (value: IDeliverableTarget) => {
		console.log(`on Created is called with: `, value);
		console.log("seeting loading to true");
	};

	const onUpdate = (value: IDeliverableTarget) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
	};

	const clearErrors = (values: IDeliverableTarget) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IDeliverableTarget) => {
		let errors: Partial<IDeliverableTarget> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.project) {
			errors.project = "Project is required";
		}
		return errors;
	};

	const formState = props.type;
	const formIsOpen = props.open;
	const handleFormOpen = props.handleClose;
	return (
		<React.Fragment>
			<DeliverableTargetForm
				{...{
					initialValues,
					formState,
					onCreate,
					onUpdate,
					clearErrors,
					validate,
					formIsOpen,
					handleFormOpen,
				}}
			>
				{/* {props.type === DELIVERABLE_ACTIONS.CREATE && createError ? (
					<Snackbar severity="error" msg={"Create Failed"} />
				) : null}
				{props.type === DELIVERABLE_ACTIONS.UPDATE && updateError ? (
					<Snackbar severity="error" msg={"Update Failed"} />
				) : null} */}
			</DeliverableTargetForm>
			{/* {response && response.createOrgProject && response.createOrgProject.name && (
				<Snackbar severity="success" msg={"Successfully created"} />
			)}
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null} */}
		</React.Fragment>
	);
}

export default DeliverableTarget;
