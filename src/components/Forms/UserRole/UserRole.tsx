import React from "react";
import { FORM_ACTIONS } from "../constant";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { userRoleForm } from "./inputField.json";
import { Typography, Grid } from "@material-ui/core";
// import { useMutation } from "@apollo/client";
// import {
// 	setSuccessNotification,
// 	setErrorNotification,
// } from "../../../reducers/notificationReducer";
import { UserRoleProps, IUserRole } from "../../../models/UserRole/UserRole";
import { FormattedMessage } from "react-intl";
import { GET_ROLES_BY_ORG } from "../../../graphql/UserRoles/query";
import { useQuery } from "@apollo/client";
function getInitialValues(props: UserRoleProps) {
	if (props.type === FORM_ACTIONS.UPDATE) {
		return { ...props.data };
	}
	return {
		email: "",
		role: "",
	};
}

function UserRoleForm(props: UserRoleProps) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IUserRole = getInitialValues(props);
	const formAction = props.type;
	// variables: { filter: { organization: dashboardData?.organization?.id } },
	const { data: role } = useQuery(GET_ROLES_BY_ORG, {
		onCompleted(data) {
			if (data?.role) {
				console.log("role", role);
			}
		},
		onError(err) {
			console.log("role", err);
		},
	});

	let title = (
		<FormattedMessage
			id="addUserRoleFormTitle"
			defaultMessage="Add Role to a User"
			description="This text will be show on user update form for title"
		/>
	);
	let subtitle = (
		<FormattedMessage
			id="addUserRoleFormTitle"
			defaultMessage="give user a role"
			description="This text will be show on user update form for subtitle"
		/>
	);

	const onCreate = (value: IUserRole) => {};

	const onUpdate = async (value: IUserRole) => {};

	const validate = (values: IUserRole) => {
		let errors: Partial<IUserRole> = {};
		if (!values.role) {
			errors.role = "Role is required";
		}
		if (!values.email) {
			errors.email = "Email is required";
		}
		return errors;
	};

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography data-testid="add-user-role-heading" variant="h6" gutterBottom>
						{title}
					</Typography>
					{/* <Typography variant="subtitle2" color="textSecondary" gutterBottom>
						{subtitle}
					</Typography> */}
				</Grid>
				<Grid item xs={12}>
					<CommonForm
						{...{
							initialValues,
							validate,
							onCreate,
							cancelButtonName: "Reset",
							createButtonName: "Add",
							formAction,
							onUpdate,
							inputFields: userRoleForm,
						}}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default UserRoleForm;
