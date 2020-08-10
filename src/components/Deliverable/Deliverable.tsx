import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
// import { CREATE_PROJECT, UPDATE_PROJECT } from "../../graphql/queries/project";
import { IDeliverable, DeliverableProps } from "../../models/deliverable/deliverable";
import Snackbar from "../Snackbar/Snackbar";
import DeliverableForm from "../Forms/Deliverable/Deliverable";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";

function getInitialValues(props: DeliverableProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Test Deliverable",
		code: "DD1",
		description: "This is a sample deliverable",
		project: 4,
	};
}

function Deliverable(props: DeliverableProps) {
	let initialValues: IDeliverable = getInitialValues(props);

	const onCreate = (value: IDeliverable) => {
		console.log(`on Created is called with: `, value);
		console.log("seeting loading to true");
	};

	const onUpdate = (value: IDeliverable) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
	};

	const clearErrors = (values: IDeliverable) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IDeliverable) => {
		let errors: Partial<IDeliverable> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.project) {
			errors.project = "Project is required";
		}
		return errors;
	};

	const formState = props.type;
	const project = props.project;

	return (
		<React.Fragment>
			<DeliverableForm
				{...{
					initialValues,
					formState,
					onCreate,
					onUpdate,
					clearErrors,
					validate,
					project,
				}}
			>
				{/* {props.type === DELIVERABLE_ACTIONS.CREATE && createError ? (
					<Snackbar severity="error" msg={"Create Failed"} />
				) : null}
				{props.type === DELIVERABLE_ACTIONS.UPDATE && updateError ? (
					<Snackbar severity="error" msg={"Update Failed"} />
				) : null} */}
			</DeliverableForm>
			{/* {response && response.createOrgProject && response.createOrgProject.name && (
				<Snackbar severity="success" msg={"Successfully created"} />
			)}
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null} */}
		</React.Fragment>
	);
}

export default Deliverable;
