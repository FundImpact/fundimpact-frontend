import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { IDeliverable, DeliverableProps } from "../../models/deliverable/deliverable";
import Snackbar from "../Snackbar/Snackbar";
import DeliverableForm from "../Forms/Deliverable/Deliverable";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { CREATE_DELIVERABLE_CATEGORY } from "../../graphql/queries/Deliverable/category";
function getInitialValues(props: DeliverableProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		description: "",
		organization: 2,
	};
}

function Deliverable(props: DeliverableProps) {
	let initialValues: IDeliverable = getInitialValues(props);
	const [
		createDeliverableCategory,
		{ data: response, loading: createLoading, error: createError },
	] = useMutation(CREATE_DELIVERABLE_CATEGORY);

	useEffect(() => {
		if (response) {
			props.handleClose();
		}
	}, [response]);
	const onCreate = async (value: IDeliverable) => {
		console.log(`on Created is called with: `, value);
		try {
			await createDeliverableCategory({ variables: { input: value } });
		} catch (error) {}

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
		if (!values.organization) {
			errors.organization = "Organization is required";
		}
		return errors;
	};

	const formState = props.type;
	const formIsOpen = props.open;
	const handleFormOpen = props.handleClose;
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
