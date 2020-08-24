import { useMutation } from "@apollo/client";
import React from "react";
import { IDeliverable, DeliverableProps } from "../../models/deliverable/deliverable";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { CREATE_DELIVERABLE_CATEGORY } from "../../graphql/queries/Deliverable/category";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { deliverableCategoryForm } from "./inputField.json";

function getInitialValues(props: DeliverableProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		description: "",
		organization: props.organization,
	};
}

function Deliverable(props: DeliverableProps) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IDeliverable = getInitialValues(props);
	const [createDeliverableCategory, { loading }] = useMutation(CREATE_DELIVERABLE_CATEGORY);
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const onCreate = async (value: IDeliverable) => {
		try {
			await createDeliverableCategory({ variables: { input: value } });
			notificationDispatch(setSuccessNotification("Deliverable category created !"));
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable category creation Failed !"));
		}
	};

	const onUpdate = (value: IDeliverable) => {};

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

	return (
		<React.Fragment>
			<FormDialog
				title={"New Deliverable Category"}
				subtitle={"create a new deliverable category"}
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
						inputFields: deliverableCategoryForm,
					}}
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Deliverable;
