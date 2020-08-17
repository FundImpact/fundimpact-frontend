import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { IDeliverable, DeliverableProps } from "../../models/deliverable/deliverable";
import DeliverableForm from "../Forms/Deliverable/Deliverable";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { CREATE_DELIVERABLE_CATEGORY } from "../../graphql/queries/Deliverable/category";
import FormDialog from "../FormDialog/FormDialog";

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
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IDeliverable = getInitialValues(props);
	const [createDeliverableCategory, { data: response, loading }] = useMutation(
		CREATE_DELIVERABLE_CATEGORY
	);

	useEffect(() => {
		if (response) {
			notificationDispatch(setSuccessNotification("Deliverable category created !"));
			props.handleClose();
		}
	}, [response]);
	const onCreate = async (value: IDeliverable) => {
		console.log(`on Created is called with: `, value);
		try {
			await createDeliverableCategory({ variables: { input: value } });
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable category creation Failed !"));
		}
	};

	const onUpdate = (value: IDeliverable) => {};

	const clearErrors = (values: IDeliverable) => {};

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
			<FormDialog
				title={"New Deliverable Category"}
				subtitle={"create a new deliverable category"}
				workspace={"workspace"}
				open={formIsOpen}
				handleClose={handleFormOpen}
			>
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
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Deliverable;
