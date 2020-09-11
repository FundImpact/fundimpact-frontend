import React from "react";
import { FORM_ACTIONS } from "../constant";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { updateUserForm } from "./inputField.json";
import { Typography, Grid } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_DETAILS } from "../../../graphql/User/mutation";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { setUser } from "../../../reducers/userReducer";
import { UserDispatchContext } from "../../../contexts/userContext";
import { IUser, UserProps } from "../../../models/User/user";
function getInitialValues(props: UserProps) {
	if (props.type === FORM_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		username: "",
		email: "",
	};
}

function UserForm(props: UserProps) {
	const notificationDispatch = useNotificationDispatch();
	const userDispatch = React.useContext(UserDispatchContext);
	let initialValues: IUser = getInitialValues(props);
	const formAction = props.type;
	const [updateUser, { data: userResponse }] = useMutation(UPDATE_USER_DETAILS, {
		onError() {
			notificationDispatch(setErrorNotification("Profile updation Failed !"));
		},
	});
	React.useEffect(() => {
		if (userResponse) {
			if (userDispatch) {
				userDispatch(setUser({ user: userResponse.updateUserCustomerInput }));
			}
			notificationDispatch(setSuccessNotification("Profile updated successfully !"));
		}
	}, [userResponse, userDispatch]);
	const onCreate = (value: IUser) => {};

	const onUpdate = (value: IUser) => {
		updateUser({
			variables: {
				id: value.id,
				input: { name: value.name, username: value.username, email: value.email },
			},
		});
	};

	const validate = (values: IUser) => {
		let errors: Partial<IUser> = {};
		if (!values.name) {
			errors.name = "Name is required";
		}
		if (!values.username) {
			errors.username = "Username is required";
		}
		if (!values.email) {
			errors.email = "Email is required";
		}
		return errors;
	};

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<Typography data-testid="update-profile-heading" variant="h6" gutterBottom>
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
							cancelButtonName: "Reset",
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
