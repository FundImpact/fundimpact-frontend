import React from "react";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { newPasswordForm } from "./inputField.json";
import { useMutation } from "@apollo/client";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { IPassword, ResetPasswordProps } from "../../../models/ResetPassword/ResetPassword";
import { UPDATE_PASSWORD } from "../../../graphql/Password/mutation";
import { useIntl } from "react-intl";
import FormDialog from "../../FormDialog";

function PasswordReset(props: ResetPasswordProps) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IPassword = {
		password: "",
		passwordConfirmation: "",
	};
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const [resetPassword] = useMutation(UPDATE_PASSWORD, {
		onCompleted() {
			notificationDispatch(setSuccessNotification("Password updated successfully !"));
			onCancel();
		},
		onError() {
			notificationDispatch(setErrorNotification("Password updation Failed !"));
		},
	});
	const onUpdate = (value: IPassword) => {
		if (value.password !== value.passwordConfirmation) {
			notificationDispatch(setErrorNotification("Password does not match !"));
			return;
		}
		resetPassword({
			variables: {
				id: props.userId,
				input: value,
			},
		});
	};

	const validate = (values: IPassword) => {
		let errors: Partial<IPassword> = {};
		if (!values.password) {
			errors.password = "password is required";
		}
		if (!values.passwordConfirmation) {
			errors.passwordConfirmation = "Confirm Password is required";
		}

		return errors;
	};
	const intl = useIntl();
	let resetPasswordTitle = intl.formatMessage({
		id: "reserPasswordFormTitle",
		defaultMessage: "Password",
		description: "This text will be show on reset password form for title",
	});
	let resetPasswordSubtitle = intl.formatMessage({
		id: "reserPasswordFormSubtitle",
		defaultMessage: "Update your password",
		description: "This text will be show on reset password form for subtitle",
	});

	return (
		<React.Fragment>
			<FormDialog
				title={resetPasswordTitle}
				subtitle={resetPasswordSubtitle}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate: () => {},
						onCancel,
						formAction,
						onUpdate,
						inputFields: newPasswordForm,
					}}
				/>
			</FormDialog>
		</React.Fragment>
	);
}

export default PasswordReset;
