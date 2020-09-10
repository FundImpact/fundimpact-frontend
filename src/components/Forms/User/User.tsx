import React from "react";
import { FORM_ACTIONS } from "../constant";
// import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { updateUserForm } from "./inputField.json";
// import { useDashBoardData } from "../../../contexts/dashboardContext";
import { Typography, Grid } from "@material-ui/core";

function getInitialValues(props: any) {
	if (props.type === FORM_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		username: "",
		email: "",
	};
}

function UserForm(props: any) {
	// const notificationDispatch = useNotificationDispatch();
	// const dashboardData = useDashBoardData();
	let initialValues: any = getInitialValues(props);
	const formAction = props.type;
	// const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const onCreate = (value: any) => {};

	const onUpdate = (value: any) => {};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		if (!values.name) {
			errors.name = "Name is required";
		}
		return errors;
	};

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<Typography data-testid="dialog-header" variant="h6" gutterBottom>
						Update Profile
					</Typography>
					<Typography variant="subtitle2" color="textSecondary" gutterBottom>
						Your personal details
					</Typography>
				</Grid>
				<Grid item xs={9}>
					<CommonForm
						{...{
							initialValues,
							validate,
							onCreate,
							onCancel,
							formAction,
							onUpdate,
							inputFields: updateUserForm,
						}}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default UserForm;
