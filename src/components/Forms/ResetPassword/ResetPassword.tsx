import React from "react";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { newPasswordForm } from "./inputField.json";
import { Typography, Grid } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { IPassword, ResetPasswordProps } from "../../../models/ResetPassword/ResetPassword";
import { UPDATE_PASSWORD } from "../../../graphql/Password/mutation";
import { FormattedMessage } from "react-intl";

function PasswordReset(props: ResetPasswordProps) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IPassword = {
		password: "",
		passwordConfirmation: "",
	};
	const formAction = props.type;
	const [resetPassword] = useMutation(UPDATE_PASSWORD, {
		onCompleted() {
			notificationDispatch(setSuccessNotification("Password updated successfully !"));
		},
		onError() {
			notificationDispatch(setErrorNotification("Password updation Failed !"));
		},
	});
	const onUpdate = (value: IPassword) => {
		if (value.password != value.passwordConfirmation) {
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

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<Typography data-testid="reset-password-heading" variant="h6" gutterBottom>
						<FormattedMessage
							id="reserPasswordFormTitle"
							defaultMessage="Password"
							description="This text will be show on reset password form for title"
						/>
					</Typography>
					<Typography variant="subtitle2" color="textSecondary" gutterBottom>
						<FormattedMessage
							id="reserPasswordFormSubtitle"
							defaultMessage="update your password"
							description="This text will be show on reset password form for subtitle"
						/>
					</Typography>
				</Grid>
				<Grid item xs={9}>
					<CommonForm
						{...{
							initialValues,
							validate,
							onCreate: () => {},
							cancelButtonName: "Reset",
							formAction,
							onUpdate,
							inputFields: newPasswordForm,
						}}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default PasswordReset;
