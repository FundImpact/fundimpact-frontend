import React from "react";
import { FORM_ACTIONS } from "../constant";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { updateUserForm, updateUserWithTokenForm } from "./inputField.json";
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
import useFileUpload from "../../../hooks/fileUpload";
import { FormattedMessage } from "react-intl";
function getInitialValues(props: UserProps) {
	if (props.type === FORM_ACTIONS.UPDATE) {
		updateUserForm[0].logo = props.data?.logo;
		props.data.uploadPhoto = "";
		return { ...props.data };
	}
	return {
		name: "",
		username: "",
		email: "",
		uploadPhoto: "",
	};
}

function UserForm(props: UserProps) {
	const notificationDispatch = useNotificationDispatch();
	const userDispatch = React.useContext(UserDispatchContext);
	let initialValues: IUser = getInitialValues(props);
	let { uploadFile: uploadFile, loading: fileUploading } = useFileUpload();
	const formAction = props.type;
	let verifyAndUpdateUserForm: boolean | undefined = false;
	if (props.type === FORM_ACTIONS.UPDATE) {
		verifyAndUpdateUserForm = props.updateWithToken;
	}
	const [updateUser, { data: userResponse }] = useMutation(UPDATE_USER_DETAILS, {
		onError() {
			notificationDispatch(setErrorNotification("Profile updation Failed !"));
		},
	});
	let title = (
		<FormattedMessage
			id="updateUserFormTitle"
			defaultMessage="Update Profile"
			description="This text will be show on user update form for title"
		/>
	);
	let subtitle = (
		<FormattedMessage
			id="updateUserFormSubtitle"
			defaultMessage="your personal details"
			description="This text will be show on user update form for subtitle"
		/>
	);
	React.useEffect(() => {
		if (userResponse) {
			if (userDispatch) {
				userDispatch(setUser({ user: userResponse.updateUserCustomerInput }));
			}
			notificationDispatch(setSuccessNotification("Profile updated successfully !"));
		}
	}, [userResponse, userDispatch]);

	const onCreate = (value: IUser) => {};

	const onUpdate = async (value: IUser) => {
		/*if user uploads file*/
		if (value.uploadPhoto) {
			let formData = new FormData();
			/* uploadFile component set file attribute value to "removed" if cancel button is clicked on logo */
			let uploadResponse;
			if (value.uploadPhoto !== "removed") {
				formData.append("files", value.uploadPhoto);
				uploadResponse = await uploadFile(formData);
			}
			if (verifyAndUpdateUserForm) {
				updateUser({
					variables: {
						id: value.id,
						input: {
							name: value.name,
							password: value.password,
							profile_photo:
								value.uploadPhoto === "removed" ? null : uploadResponse?.[0]?.id,
						},
					},
				});
			} else {
				updateUser({
					variables: {
						id: value.id,
						input: {
							name: value.name,
							username: value.username,
							email: value.email,
							profile_photo:
								value.uploadPhoto === "removed" ? null : uploadResponse?.[0]?.id,
						},
					},
				});
			}
		} else {
			if (verifyAndUpdateUserForm) {
				updateUser({
					variables: {
						id: value.id,
						input: {
							name: value.name,
							password: value.password,
						},
					},
				});
			} else
				updateUser({
					variables: {
						id: value.id,
						input: {
							name: value.name,
							username: value.username,
							email: value.email,
							profile_photo: value.profile_photo,
						},
					},
				});
		}
	};

	const validate = (values: IUser) => {
		let errors: Partial<IUser> = {};
		if (props.type === FORM_ACTIONS.UPDATE && !verifyAndUpdateUserForm) {
			if (!values.name) {
				errors.name = "Name is required";
			}
			if (!values.username) {
				errors.username = "Username is required";
			}
			if (!values.email) {
				errors.email = "Email is required";
			}
		}
		if (props.type === FORM_ACTIONS.UPDATE && verifyAndUpdateUserForm) {
			if (!values.name) {
				errors.name = "Name is required";
			}
			if (!values.password) {
				errors.password = "Password is required";
			}
		}
		return errors;
	};

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<Typography data-testid="update-profile-heading" variant="h6" gutterBottom>
						{title}
					</Typography>
					<Typography variant="subtitle2" color="textSecondary" gutterBottom>
						{subtitle}
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
							inputFields: verifyAndUpdateUserForm
								? updateUserWithTokenForm
								: updateUserForm,
						}}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default UserForm;
