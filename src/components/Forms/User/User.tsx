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
import { UserDispatchContext, useAuth } from "../../../contexts/userContext";
import { IUser, UserProps } from "../../../models/User/user";
import useFileUpload from "../../../hooks/fileUpload";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { languages } from "../../../utils/languages.json";

(updateUserForm[3].optionsArray as { id: string; name: string; code: string }[]) = languages;

let getLanguageFronId = (id: string) => languages.find((language) => language.id == id);

let getLanguageFromCode = (languageCode: string) =>
	languages.find((language) => language.code == languageCode);

function getInitialValues(props: UserProps) {
	if (props.type === FORM_ACTIONS.UPDATE) {
		updateUserForm[0].logo = props.data?.logo;
		props.data.uploadPhoto = "";

		return { ...props.data, language: getLanguageFromCode(props.data.language)?.id || "1" };
	}
	return {
		name: "",
		email: "",
		uploadPhoto: "",
		theme: {},
		language: "1",
	};
}

function UserForm(props: UserProps) {
	const notificationDispatch = useNotificationDispatch();
	const userDispatch = React.useContext(UserDispatchContext);
	let initialValues: IUser = getInitialValues(props);
	let { uploadFile } = useFileUpload();
	const formAction = props.type;
	const navigate = useNavigate();
	let verifyAndUpdateUserForm: boolean | undefined = false;
	let userTheme = {};
	if (props.type === FORM_ACTIONS.UPDATE) {
		verifyAndUpdateUserForm = props.updateWithToken;
		userTheme = props.data?.theme;
	}

	const [updateUser, { data: userResponse }] = useMutation(UPDATE_USER_DETAILS, {
		onCompleted() {
			if (verifyAndUpdateUserForm) {
				navigate("/account/profile");
			}
			notificationDispatch(setSuccessNotification("Profile updated successfully !"));
		},
		onError(err) {
			notificationDispatch(setErrorNotification(err?.message));
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
			defaultMessage="Your personal details"
			description="This text will be show on user update form for subtitle"
		/>
	);
	React.useEffect(() => {
		if (userResponse) {
			if (userDispatch) {
				userDispatch(
					setUser({ user: { ...userResponse.updateUserCustomerInput, theme: userTheme } })
				);
			}
		}
	}, [userResponse, userDispatch, userTheme]);

	const onCreate = (value: IUser) => {};

	const onUpdate = async (value: IUser) => {
		let languageSelected = getLanguageFronId(value.language);
		let languageCode = (languageSelected && languageSelected.code) || "en";
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
							language: languageCode,
						},
					},
				});
			} else {
				updateUser({
					variables: {
						id: value.id,
						input: {
							name: value.name,
							email: value.email,
							profile_photo:
								value.uploadPhoto === "removed" ? null : uploadResponse?.[0]?.id,
							language: languageCode,
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
							language: languageCode,
						},
					},
				});
			} else
				updateUser({
					variables: {
						id: value.id,
						input: {
							name: value.name,
							email: value.email,
							profile_photo: value.profile_photo,
							language: languageCode,
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
