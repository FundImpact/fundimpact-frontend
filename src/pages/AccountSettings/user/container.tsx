import React, { useEffect, useState } from "react";
import UserForm from "../../../components/Forms/User";
import PasswordReset from "../../../components/Forms/ResetPassword";
import { Box, Button, Paper } from "@material-ui/core";
import { useAuth, UserDispatchContext } from "../../../contexts/userContext";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_USER_DETAILS } from "../../../graphql/User/query";
import { setUser } from "../../../reducers/userReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { setErrorNotification } from "../../../reducers/notificationReducer";

export const ProfileContainer = () => {
	const auth = useAuth();
	const user: any = auth.user;
	const data = {
		id: user?.id,
		name: user?.name,
		email: user?.email,
		username: user?.username,
		profile_photo: user?.profile_photo?.id,
		logo: user?.profile_photo?.url,
		uploadPhoto: "",
	};
	const [openResetPassForm, setOpenResetPassForm] = useState<boolean>(false);
	const userDispatch = React.useContext(UserDispatchContext);
	let { data: userDetails, error: userDetailsError } = useQuery(GET_USER_DETAILS);

	useEffect(() => {
		console.log("errorData", userDetailsError, userDetails);
		if (userDetailsError) {
			/*Invalid Token or forbidden*/
			if (userDispatch) {
				userDispatch({
					type: "LOGOUT_USER",
					payload: { logoutMsg: "Invalid user or user dont have access" },
				});
			}
		}
		if (userDetails?.userCustomer) {
			if (userDispatch) {
				userDispatch(setUser({ user: userDetails?.userCustomer }));
			}
		}
	}, [userDetails, userDispatch, userDetailsError]);

	let verifyUrlJwt = false;
	let { pathname } = useLocation();

	let pathnameArr = pathname.split("/");
	if (pathnameArr?.length > 3) {
		if (pathnameArr[3] === "verify") verifyUrlJwt = true;
	}
	return (
		<Box>
			<h1>
				<FormattedMessage
					id={`profileHeading`}
					defaultMessage={`Profile`}
					description={`This text will be shown on Setting page for profile heading`}
				/>
			</h1>
			<Paper style={{ height: "400px" }}>
				<Box m={3} p={2}>
					<UserForm
						data={data}
						type={FORM_ACTIONS.UPDATE}
						updateWithToken={verifyUrlJwt}
					/>
				</Box>
			</Paper>
			{!verifyUrlJwt && (
				<Box m={1}>
					<Button color="primary" onClick={() => setOpenResetPassForm(true)}>
						<FormattedMessage
							id={`profileResetPassword`}
							defaultMessage={`Reset Password`}
							description={`This text will be shown on Setting page for reset password button`}
						/>
					</Button>
				</Box>
			)}
			{openResetPassForm && (
				<PasswordReset
					open={openResetPassForm}
					handleClose={() => setOpenResetPassForm(false)}
					userId={data?.id}
					type={FORM_ACTIONS.UPDATE}
				/>
			)}
		</Box>
	);
};
