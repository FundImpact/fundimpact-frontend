import React, { useEffect, useState } from "react";
import UserForm from "../../../components/Forms/User";
import PasswordReset from "../../../components/Forms/ResetPassword";
import { Box, Button, Paper, ButtonGroup } from "@material-ui/core";
import { useAuth, UserDispatchContext } from "../../../contexts/userContext";
import { FORM_ACTIONS, Enitity } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_USER_DETAILS } from "../../../graphql/User/query";
import { setUser } from "../../../reducers/userReducer";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AddContactAddressDialog from "../../../components/AddContactAddressDialog";
import ContactListDialog from "../../../components/ContactListDialog";

export const ProfileContainer = () => {
	const [contactAddressDialogOpen, setContactAddressDialogOpen] = useState<boolean>(false);
	const [contactListDialogOpen, setContactListDialogOpen] = useState<boolean>(false);
	const auth = useAuth();
	const user: any = auth.user;
	const data = {
		id: user?.id,
		name: user?.name,
		email: user?.email,
		// username: user?.username,
		theme: user?.theme,
		profile_photo: user?.profile_photo?.id,
		logo: user?.profile_photo?.url,
		uploadPhoto: "",
		language: user?.language,
	};
	const [openResetPassForm, setOpenResetPassForm] = useState<boolean>(false);
	const userDispatch = React.useContext(UserDispatchContext);
	let { data: userDetails, error: userDetailsError } = useQuery(GET_USER_DETAILS);

	let verifyUrlJwt = false;
	let { pathname } = useLocation();

	let pathnameArr = pathname.split("/");
	if (pathnameArr?.length > 3) {
		if (pathnameArr[3] === "verify") verifyUrlJwt = true;
	}

	useEffect(() => {
		if (verifyUrlJwt) {
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
		}
	}, [userDetails, userDispatch, userDetailsError, verifyUrlJwt]);
	return (
		<Box>
			<h1>
				<FormattedMessage
					id={`profileHeading`}
					defaultMessage={`Profile`}
					description={`This text will be shown on Setting page for profile heading`}
				/>
			</h1>
			<Paper>
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
					<ButtonGroup
						color="primary"
						variant="contained"
						aria-label="outlined primary button group"
					>
						<Button onClick={() => setOpenResetPassForm(true)}>
							<FormattedMessage
								id={`profileResetPassword`}
								defaultMessage={`Reset Password`}
								description={`This text will be shown on Setting page for reset password button`}
							/>
						</Button>
						<Button
							startIcon={<PersonAddIcon />}
							onClick={() => setContactAddressDialogOpen(true)}
						>
							<FormattedMessage
								id={`addContactButton`}
								defaultMessage={`Add Contact`}
								description={`This text will be shown on add contact button`}
							/>
						</Button>
						<Button fullWidth onClick={() => setContactListDialogOpen(true)}>
							<FormattedMessage
								id={`showContactList`}
								defaultMessage={`Contacts Details`}
								description={`This text will be shown on show contact button`}
							/>
						</Button>
					</ButtonGroup>
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
			<AddContactAddressDialog
				open={contactAddressDialogOpen}
				handleClose={() => setContactAddressDialogOpen(false)}
				entity_id={data?.id || ""}
				entity_name={Enitity.user}
			/>
			<ContactListDialog
				open={contactListDialogOpen}
				handleClose={() => setContactListDialogOpen(false)}
				entity_name={Enitity.user}
				entity_id={data?.id || ""}
			/>
		</Box>
	);
};
