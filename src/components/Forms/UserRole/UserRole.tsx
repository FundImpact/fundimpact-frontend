import React, { useEffect, useState, useMemo } from "react";
import { FORM_ACTIONS } from "../constant";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { userRoleForm } from "./inputField.json";
import { Typography, Grid } from "@material-ui/core";
import { UserRoleProps, IUserRole } from "../../../models/UserRole/UserRole";
import { FormattedMessage } from "react-intl";
import {
	GET_INVITED_USER_LIST,
	GET_INVITED_USER_LIST_COUNT,
	GET_ROLES_BY_ORG,
} from "../../../graphql/UserRoles/query";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { INVITE_USER } from "../../../graphql/UserRoles/mutation";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import FullScreenLoader from "../../commons/GlobalLoader";
function getInitialValues(props: UserRoleProps) {
	if (props.type === FORM_ACTIONS.UPDATE) {
		return { ...props.data };
	}
	return {
		email: "",
		role: "",
	};
}

const filterOrganizationRoles = (
	roles: { type: string; id: string; name: string }[],
	organizationId: string
) => roles.filter((role) => role.type !== `admin-org-${organizationId}`);

function UserRoleForm(props: UserRoleProps) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IUserRole = getInitialValues(props);
	const dashboardData = useDashBoardData();
	const [formValues, setFormValues] = useState<{ email: string; role: string } | null>();
	const formAction = props.type;
	const [sendInvitationToUser, { loading: sendInvitationToUserLoading }] = useMutation(
		INVITE_USER,
		{
			onCompleted(data) {
				notificationDispatch(setSuccessNotification("Invitation Sent"));
			},
			onError(err) {
				notificationDispatch(setErrorNotification("Inviting User Failed !"));
			},
		}
	);

	const [getInvitedUserCount, { data: count }] = useLazyQuery(GET_INVITED_USER_LIST_COUNT, {
		onCompleted(data) {
			setFormValues(null);
		},
	});

	const { data: userRoles } = useQuery(GET_ROLES_BY_ORG, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
		onError(err) {
			console.log("role", err);
		},
	});

	(userRoleForm[1].optionsArray as {
		type: string;
		id: string;
		name: string;
	}[]) = useMemo(
		() =>
			filterOrganizationRoles(
				userRoles?.organizationRoles || [],
				dashboardData?.organization?.id || ""
			),
		[filterOrganizationRoles, userRoles, dashboardData]
	);

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

	useEffect(() => {
		if (count && formValues) {
			const limit = count?.userListCount;
			sendInvitationToUser({
				variables: {
					input: {
						...formValues,
						redirectTo: `${window.location.protocol}//${window.location.host}/account/profile`,
					},
				},
				refetchQueries: [
					{
						query: GET_INVITED_USER_LIST,
						variables: {
							filter: {},
							limit: limit > 10 ? 10 : limit,
							start: 0,
							sort: "created_at:DESC",
						},
					},
					{
						query: GET_INVITED_USER_LIST_COUNT,
						variables: {
							filter: {},
						},
					},
				],
			});
		}
	}, [count, formValues]);

	const onCreate = (value: IUserRole) => {
		setFormValues(value);
		// need count to refetch the invited user table count and list
		getInvitedUserCount();
	};

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
				{sendInvitationToUserLoading ? <FullScreenLoader /> : null}
			</Grid>
		</React.Fragment>
	);
}

export default UserRoleForm;
